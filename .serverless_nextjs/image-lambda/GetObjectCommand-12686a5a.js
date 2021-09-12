'use strict';

var lazyJson = require('./lazy-json-37175b28.js');
var httpRequest = require('./httpRequest-79d7914f.js');
var imageHandler = require('./image-handler-1f543192.js');
require('./manifest.json');
require('./routes-manifest.json');
require('stream');
require('zlib');
require('http');
require('url');
require('path');
require('fs');
require('crypto');
require('events');
require('util');
require('tty');
require('net');
require('https');

var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var DOT_PATTERN = /\./;
var S3_HOSTNAME_PATTERN = /^(.+\.)?s3[.-]([a-z0-9-]+)\./;
var S3_US_EAST_1_ALTNAME_PATTERN = /^s3(-external-1)?\.amazonaws\.com$/;
var AWS_PARTITION_SUFFIX = "amazonaws.com";
var isBucketNameOptions = function (options) { return typeof options.bucketName === "string"; };
/**
 * Get pseudo region from supplied region. For example, if supplied with `fips-us-west-2`, it returns `us-west-2`.
 * @internal
 */
var getPseudoRegion = function (region) { return (isFipsRegion(region) ? region.replace(/fips-|-fips/, "") : region); };
/**
 * Determines whether a given string is DNS compliant per the rules outlined by
 * S3. Length, capitaization, and leading dot restrictions are enforced by the
 * DOMAIN_PATTERN regular expression.
 * @internal
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
 */
var isDnsCompatibleBucketName = function (bucketName) {
    return DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
};
var getRegionalSuffix = function (hostname) {
    var parts = hostname.match(S3_HOSTNAME_PATTERN);
    return [parts[2], hostname.replace(new RegExp("^" + parts[0]), "")];
};
var getSuffix = function (hostname) {
    return S3_US_EAST_1_ALTNAME_PATTERN.test(hostname) ? ["us-east-1", AWS_PARTITION_SUFFIX] : getRegionalSuffix(hostname);
};
/**
 * Infer region and hostname suffix from a complete hostname
 * @internal
 * @param hostname - Hostname
 * @returns [Region, Hostname suffix]
 */
var getSuffixForArnEndpoint = function (hostname) {
    return S3_US_EAST_1_ALTNAME_PATTERN.test(hostname)
        ? [hostname.replace("." + AWS_PARTITION_SUFFIX, ""), AWS_PARTITION_SUFFIX]
        : getRegionalSuffix(hostname);
};
var validateArnEndpointOptions = function (options) {
    if (options.pathStyleEndpoint) {
        throw new Error("Path-style S3 endpoint is not supported when bucket is an ARN");
    }
    if (options.accelerateEndpoint) {
        throw new Error("Accelerate endpoint is not supported when bucket is an ARN");
    }
    if (!options.tlsCompatible) {
        throw new Error("HTTPS is required when bucket is an ARN");
    }
};
var validateService = function (service) {
    if (service !== "s3" && service !== "s3-outposts") {
        throw new Error("Expect 's3' or 's3-outposts' in ARN service component");
    }
};
var validateS3Service = function (service) {
    if (service !== "s3") {
        throw new Error("Expect 's3' in Accesspoint ARN service component");
    }
};
var validateOutpostService = function (service) {
    if (service !== "s3-outposts") {
        throw new Error("Expect 's3-posts' in Outpost ARN service component");
    }
};
/**
 * Validate partition inferred from ARN is the same to `options.clientPartition`.
 * @internal
 */
var validatePartition = function (partition, options) {
    if (partition !== options.clientPartition) {
        throw new Error("Partition in ARN is incompatible, got \"" + partition + "\" but expected \"" + options.clientPartition + "\"");
    }
};
/**
 * validate region value inferred from ARN. If `options.useArnRegion` is set, it validates the region is not a FIPS
 * region. If `options.useArnRegion` is unset, it validates the region is equal to `options.clientRegion` or
 * `options.clientSigningRegion`.
 * @internal
 */
var validateRegion = function (region, options) {
    if (region === "") {
        throw new Error("ARN region is empty");
    }
    if (!options.useArnRegion &&
        !isEqualRegions(region, options.clientRegion) &&
        !isEqualRegions(region, options.clientSigningRegion)) {
        throw new Error("Region in ARN is incompatible, got " + region + " but expected " + options.clientRegion);
    }
    if (options.useArnRegion && isFipsRegion(region)) {
        throw new Error("Endpoint does not support FIPS region");
    }
};
var isFipsRegion = function (region) { return region.startsWith("fips-") || region.endsWith("-fips"); };
var isEqualRegions = function (regionA, regionB) {
    return regionA === regionB || getPseudoRegion(regionA) === regionB || regionA === getPseudoRegion(regionB);
};
/**
 * Validate an account ID
 * @internal
 */
var validateAccountId = function (accountId) {
    if (!/[0-9]{12}/.exec(accountId)) {
        throw new Error("Access point ARN accountID does not match regex '[0-9]{12}'");
    }
};
/**
 * Validate a host label according to https://tools.ietf.org/html/rfc3986#section-3.2.2
 * @internal
 */
var validateDNSHostLabel = function (label, options) {
    if (options === void 0) { options = { tlsCompatible: true }; }
    // reference: https://tools.ietf.org/html/rfc3986#section-3.2.2
    if (label.length >= 64 ||
        !/^[a-z0-9][a-z0-9.-]+[a-z0-9]$/.test(label) ||
        /(\d+\.){3}\d+/.test(label) ||
        /[.-]{2}/.test(label) ||
        ((options === null || options === void 0 ? void 0 : options.tlsCompatible) && DOT_PATTERN.test(label))) {
        throw new Error("Invalid DNS label " + label);
    }
};
/**
 * Validate and parse an Access Point ARN or Outposts ARN
 * @internal
 *
 * @param resource - The resource section of an ARN
 * @returns Access Point Name and optional Outpost ID.
 */
var getArnResources = function (resource) {
    var delimiter = resource.includes(":") ? ":" : "/";
    var _a = httpRequest.__read(resource.split(delimiter)), resourceType = _a[0], rest = _a.slice(1);
    if (resourceType === "accesspoint") {
        // Parse accesspoint ARN
        if (rest.length !== 1 || rest[0] === "") {
            throw new Error("Access Point ARN should have one resource accesspoint" + delimiter + "{accesspointname}");
        }
        return { accesspointName: rest[0] };
    }
    else if (resourceType === "outpost") {
        // Parse outpost ARN
        if (!rest[0] || rest[1] !== "accesspoint" || !rest[2] || rest.length !== 3) {
            throw new Error("Outpost ARN should have resource outpost" + delimiter + "{outpostId}" + delimiter + "accesspoint" + delimiter + "{accesspointName}");
        }
        var _b = httpRequest.__read(rest, 3), outpostId = _b[0]; _b[1]; var accesspointName = _b[2];
        return { outpostId: outpostId, accesspointName: accesspointName };
    }
    else {
        throw new Error("ARN resource should begin with 'accesspoint" + delimiter + "' or 'outpost" + delimiter + "'");
    }
};
/**
 * Throw if dual stack configuration is set to true.
 * @internal
 */
var validateNoDualstack = function (dualstackEndpoint) {
    if (dualstackEndpoint)
        throw new Error("Dualstack endpoint is not supported with Outpost");
};
/**
 * Validate region is not appended or prepended with a `fips-`
 * @internal
 */
var validateNoFIPS = function (region) {
    if (isFipsRegion(region !== null && region !== void 0 ? region : ""))
        throw new Error("FIPS region is not supported with Outpost, got " + region);
};

var bucketHostname = function (options) {
    var baseHostname = options.baseHostname;
    if (!S3_HOSTNAME_PATTERN.test(baseHostname)) {
        return {
            bucketEndpoint: false,
            hostname: baseHostname,
        };
    }
    return isBucketNameOptions(options)
        ? // Construct endpoint when bucketName is a string referring to a bucket name
            getEndpointFromBucketName(options)
        : // Construct endpoint when bucketName is an ARN referring to an S3 resource like Access Point
            getEndpointFromArn(options);
};
var getEndpointFromArn = function (options) {
    // Infer client region and hostname suffix from hostname from endpoints.json, like `s3.us-west-2.amazonaws.com`
    var _a = httpRequest.__read(getSuffixForArnEndpoint(options.baseHostname), 2), clientRegion = _a[0], hostnameSuffix = _a[1];
    var pathStyleEndpoint = options.pathStyleEndpoint, _b = options.dualstackEndpoint, dualstackEndpoint = _b === void 0 ? false : _b, _c = options.accelerateEndpoint, accelerateEndpoint = _c === void 0 ? false : _c, _d = options.tlsCompatible, tlsCompatible = _d === void 0 ? true : _d, useArnRegion = options.useArnRegion, bucketName = options.bucketName, _e = options.clientPartition, clientPartition = _e === void 0 ? "aws" : _e, _f = options.clientSigningRegion, clientSigningRegion = _f === void 0 ? clientRegion : _f;
    validateArnEndpointOptions({ pathStyleEndpoint: pathStyleEndpoint, accelerateEndpoint: accelerateEndpoint, tlsCompatible: tlsCompatible });
    // Validate and parse the ARN supplied as a bucket name
    var service = bucketName.service, partition = bucketName.partition, accountId = bucketName.accountId, region = bucketName.region, resource = bucketName.resource;
    validateService(service);
    validatePartition(partition, { clientPartition: clientPartition });
    validateAccountId(accountId);
    validateRegion(region, { useArnRegion: useArnRegion, clientRegion: clientRegion, clientSigningRegion: clientSigningRegion });
    var _g = getArnResources(resource), accesspointName = _g.accesspointName, outpostId = _g.outpostId;
    validateDNSHostLabel(accesspointName + "-" + accountId, { tlsCompatible: tlsCompatible });
    var endpointRegion = useArnRegion ? region : clientRegion;
    var signingRegion = useArnRegion ? region : clientSigningRegion;
    if (outpostId) {
        // if this is an Outpost ARN
        validateOutpostService(service);
        validateDNSHostLabel(outpostId, { tlsCompatible: tlsCompatible });
        validateNoDualstack(dualstackEndpoint);
        validateNoFIPS(endpointRegion);
        return {
            bucketEndpoint: true,
            hostname: accesspointName + "-" + accountId + "." + outpostId + ".s3-outposts." + endpointRegion + "." + hostnameSuffix,
            signingRegion: signingRegion,
            signingService: "s3-outposts",
        };
    }
    // construct endpoint from Accesspoint ARN
    validateS3Service(service);
    return {
        bucketEndpoint: true,
        hostname: accesspointName + "-" + accountId + ".s3-accesspoint" + (dualstackEndpoint ? ".dualstack" : "") + "." + endpointRegion + "." + hostnameSuffix,
        signingRegion: signingRegion,
    };
};
var getEndpointFromBucketName = function (_a) {
    var _b = _a.accelerateEndpoint, accelerateEndpoint = _b === void 0 ? false : _b, baseHostname = _a.baseHostname, bucketName = _a.bucketName, _c = _a.dualstackEndpoint, dualstackEndpoint = _c === void 0 ? false : _c, _d = _a.pathStyleEndpoint, pathStyleEndpoint = _d === void 0 ? false : _d, _e = _a.tlsCompatible, tlsCompatible = _e === void 0 ? true : _e;
    var _f = httpRequest.__read(getSuffix(baseHostname), 2), clientRegion = _f[0], hostnameSuffix = _f[1];
    if (pathStyleEndpoint || !isDnsCompatibleBucketName(bucketName) || (tlsCompatible && DOT_PATTERN.test(bucketName))) {
        return {
            bucketEndpoint: false,
            hostname: dualstackEndpoint ? "s3.dualstack." + clientRegion + "." + hostnameSuffix : baseHostname,
        };
    }
    if (accelerateEndpoint) {
        baseHostname = "s3-accelerate" + (dualstackEndpoint ? ".dualstack" : "") + "." + hostnameSuffix;
    }
    else if (dualstackEndpoint) {
        baseHostname = "s3.dualstack." + clientRegion + "." + hostnameSuffix;
    }
    return {
        bucketEndpoint: true,
        hostname: bucketName + "." + baseHostname,
    };
};

var bucketEndpointMiddleware = function (options) { return function (next, context) { return function (args) { return httpRequest.__awaiter(void 0, void 0, void 0, function () {
    var bucketName, replaceBucketInPath, request, bucketArn, clientRegion, _a, _b, partition, _c, signingRegion, useArnRegion, _d, hostname, bucketEndpoint, modifiedSigningRegion, signingService, _e, hostname, bucketEndpoint;
    return httpRequest.__generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                bucketName = args.input.Bucket;
                replaceBucketInPath = options.bucketEndpoint;
                request = args.request;
                if (!httpRequest.HttpRequest.isInstance(request)) return [3 /*break*/, 7];
                if (!options.bucketEndpoint) return [3 /*break*/, 1];
                request.hostname = bucketName;
                return [3 /*break*/, 6];
            case 1:
                if (!lazyJson.validate(bucketName)) return [3 /*break*/, 5];
                bucketArn = lazyJson.parse(bucketName);
                _a = getPseudoRegion;
                return [4 /*yield*/, options.region()];
            case 2:
                clientRegion = _a.apply(void 0, [_f.sent()]);
                return [4 /*yield*/, options.regionInfoProvider(clientRegion)];
            case 3:
                _b = (_f.sent()) || {}, partition = _b.partition, _c = _b.signingRegion, signingRegion = _c === void 0 ? clientRegion : _c;
                return [4 /*yield*/, options.useArnRegion()];
            case 4:
                useArnRegion = _f.sent();
                _d = bucketHostname({
                    bucketName: bucketArn,
                    baseHostname: request.hostname,
                    accelerateEndpoint: options.useAccelerateEndpoint,
                    dualstackEndpoint: options.useDualstackEndpoint,
                    pathStyleEndpoint: options.forcePathStyle,
                    tlsCompatible: request.protocol === "https:",
                    useArnRegion: useArnRegion,
                    clientPartition: partition,
                    clientSigningRegion: signingRegion,
                }), hostname = _d.hostname, bucketEndpoint = _d.bucketEndpoint, modifiedSigningRegion = _d.signingRegion, signingService = _d.signingService;
                // If the request needs to use a region or service name inferred from ARN that different from client region, we
                // need to set them in the handler context so the signer will use them
                if (modifiedSigningRegion && modifiedSigningRegion !== signingRegion) {
                    context["signing_region"] = modifiedSigningRegion;
                }
                if (signingService && signingService !== "s3") {
                    context["signing_service"] = signingService;
                }
                request.hostname = hostname;
                replaceBucketInPath = bucketEndpoint;
                return [3 /*break*/, 6];
            case 5:
                _e = bucketHostname({
                    bucketName: bucketName,
                    baseHostname: request.hostname,
                    accelerateEndpoint: options.useAccelerateEndpoint,
                    dualstackEndpoint: options.useDualstackEndpoint,
                    pathStyleEndpoint: options.forcePathStyle,
                    tlsCompatible: request.protocol === "https:",
                }), hostname = _e.hostname, bucketEndpoint = _e.bucketEndpoint;
                request.hostname = hostname;
                replaceBucketInPath = bucketEndpoint;
                _f.label = 6;
            case 6:
                if (replaceBucketInPath) {
                    request.path = request.path.replace(/^(\/)?[^\/]+/, "");
                    if (request.path === "") {
                        request.path = "/";
                    }
                }
                _f.label = 7;
            case 7: return [2 /*return*/, next(httpRequest.__assign(httpRequest.__assign({}, args), { request: request }))];
        }
    });
}); }; }; };
var bucketEndpointMiddlewareOptions = {
    tags: ["BUCKET_ENDPOINT"],
    name: "bucketEndpointMiddleware",
    relation: "before",
    toMiddleware: "hostHeaderMiddleware",
};
var getBucketEndpointPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.addRelativeTo(bucketEndpointMiddleware(options), bucketEndpointMiddlewareOptions);
    },
}); };

var Command = /** @class */ (function () {
    function Command() {
        this.middlewareStack = lazyJson.constructStack();
    }
    return Command;
}());

/**
 * Function that wraps encodeURIComponent to encode additional characters
 * to fully adhere to RFC 3986.
 */
function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16);
    });
}

/**
 * Recursively parses object and populates value is node from
 * "#text" key if it's available
 */
var getValueFromTextNode = function (obj) {
    var textNodeName = "#text";
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== undefined) {
            obj[key] = obj[key][textNodeName];
        }
        else if (typeof obj[key] === "object" && obj[key] !== null) {
            obj[key] = getValueFromTextNode(obj[key]);
        }
    }
    return obj;
};

/**
 * Builds a proper UTC HttpDate timestamp from a Date object
 * since not all environments will have this as the expected
 * format.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString
 * > Prior to ECMAScript 2018, the format of the return value
 * > varied according to the platform. The most common return
 * > value was an RFC-1123 formatted date stamp, which is a
 * > slightly updated version of RFC-822 date stamps.
 */
// Build indexes outside so we allocate them once.
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// prettier-ignore
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date) {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var dayOfWeek = date.getUTCDay();
    var dayOfMonthInt = date.getUTCDate();
    var hoursInt = date.getUTCHours();
    var minutesInt = date.getUTCMinutes();
    var secondsInt = date.getUTCSeconds();
    // Build 0 prefixed strings for contents that need to be
    // two digits and where we get an integer back.
    var dayOfMonthString = dayOfMonthInt < 10 ? "0" + dayOfMonthInt : "" + dayOfMonthInt;
    var hoursString = hoursInt < 10 ? "0" + hoursInt : "" + hoursInt;
    var minutesString = minutesInt < 10 ? "0" + minutesInt : "" + minutesInt;
    var secondsString = secondsInt < 10 ? "0" + secondsInt : "" + secondsInt;
    return days[dayOfWeek] + ", " + dayOfMonthString + " " + months[month] + " " + year + " " + hoursString + ":" + minutesString + ":" + secondsString + " GMT";
}

var SENSITIVE_STRING = "***SensitiveInformation***";

var AbortIncompleteMultipartUpload;
(function (AbortIncompleteMultipartUpload) {
    AbortIncompleteMultipartUpload.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AbortIncompleteMultipartUpload || (AbortIncompleteMultipartUpload = {}));
var AbortMultipartUploadOutput;
(function (AbortMultipartUploadOutput) {
    AbortMultipartUploadOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AbortMultipartUploadOutput || (AbortMultipartUploadOutput = {}));
var AbortMultipartUploadRequest;
(function (AbortMultipartUploadRequest) {
    AbortMultipartUploadRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AbortMultipartUploadRequest || (AbortMultipartUploadRequest = {}));
var NoSuchUpload;
(function (NoSuchUpload) {
    NoSuchUpload.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NoSuchUpload || (NoSuchUpload = {}));
var AccelerateConfiguration;
(function (AccelerateConfiguration) {
    AccelerateConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AccelerateConfiguration || (AccelerateConfiguration = {}));
var Grantee;
(function (Grantee) {
    Grantee.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Grantee || (Grantee = {}));
var Grant;
(function (Grant) {
    Grant.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Grant || (Grant = {}));
var Owner;
(function (Owner) {
    Owner.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Owner || (Owner = {}));
var AccessControlPolicy;
(function (AccessControlPolicy) {
    AccessControlPolicy.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AccessControlPolicy || (AccessControlPolicy = {}));
var AccessControlTranslation;
(function (AccessControlTranslation) {
    AccessControlTranslation.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AccessControlTranslation || (AccessControlTranslation = {}));
var CompleteMultipartUploadOutput;
(function (CompleteMultipartUploadOutput) {
    CompleteMultipartUploadOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(CompleteMultipartUploadOutput || (CompleteMultipartUploadOutput = {}));
var CompletedPart;
(function (CompletedPart) {
    CompletedPart.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CompletedPart || (CompletedPart = {}));
var CompletedMultipartUpload;
(function (CompletedMultipartUpload) {
    CompletedMultipartUpload.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CompletedMultipartUpload || (CompletedMultipartUpload = {}));
var CompleteMultipartUploadRequest;
(function (CompleteMultipartUploadRequest) {
    CompleteMultipartUploadRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CompleteMultipartUploadRequest || (CompleteMultipartUploadRequest = {}));
var CopyObjectResult;
(function (CopyObjectResult) {
    CopyObjectResult.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CopyObjectResult || (CopyObjectResult = {}));
var CopyObjectOutput;
(function (CopyObjectOutput) {
    CopyObjectOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }),
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(CopyObjectOutput || (CopyObjectOutput = {}));
var CopyObjectRequest;
(function (CopyObjectRequest) {
    CopyObjectRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }),
        ...(obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }),
        ...(obj.CopySourceSSECustomerKey && { CopySourceSSECustomerKey: SENSITIVE_STRING }),
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(CopyObjectRequest || (CopyObjectRequest = {}));
var ObjectNotInActiveTierError;
(function (ObjectNotInActiveTierError) {
    ObjectNotInActiveTierError.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectNotInActiveTierError || (ObjectNotInActiveTierError = {}));
var BucketAlreadyExists;
(function (BucketAlreadyExists) {
    BucketAlreadyExists.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BucketAlreadyExists || (BucketAlreadyExists = {}));
var BucketAlreadyOwnedByYou;
(function (BucketAlreadyOwnedByYou) {
    BucketAlreadyOwnedByYou.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BucketAlreadyOwnedByYou || (BucketAlreadyOwnedByYou = {}));
var CreateBucketOutput;
(function (CreateBucketOutput) {
    CreateBucketOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CreateBucketOutput || (CreateBucketOutput = {}));
var CreateBucketConfiguration;
(function (CreateBucketConfiguration) {
    CreateBucketConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CreateBucketConfiguration || (CreateBucketConfiguration = {}));
var CreateBucketRequest;
(function (CreateBucketRequest) {
    CreateBucketRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CreateBucketRequest || (CreateBucketRequest = {}));
var CreateMultipartUploadOutput;
(function (CreateMultipartUploadOutput) {
    CreateMultipartUploadOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }),
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(CreateMultipartUploadOutput || (CreateMultipartUploadOutput = {}));
var CreateMultipartUploadRequest;
(function (CreateMultipartUploadRequest) {
    CreateMultipartUploadRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
        ...(obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }),
        ...(obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }),
    });
})(CreateMultipartUploadRequest || (CreateMultipartUploadRequest = {}));
var DeleteBucketRequest;
(function (DeleteBucketRequest) {
    DeleteBucketRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketRequest || (DeleteBucketRequest = {}));
var DeleteBucketAnalyticsConfigurationRequest;
(function (DeleteBucketAnalyticsConfigurationRequest) {
    DeleteBucketAnalyticsConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketAnalyticsConfigurationRequest || (DeleteBucketAnalyticsConfigurationRequest = {}));
var DeleteBucketCorsRequest;
(function (DeleteBucketCorsRequest) {
    DeleteBucketCorsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketCorsRequest || (DeleteBucketCorsRequest = {}));
var DeleteBucketEncryptionRequest;
(function (DeleteBucketEncryptionRequest) {
    DeleteBucketEncryptionRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketEncryptionRequest || (DeleteBucketEncryptionRequest = {}));
var DeleteBucketInventoryConfigurationRequest;
(function (DeleteBucketInventoryConfigurationRequest) {
    DeleteBucketInventoryConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketInventoryConfigurationRequest || (DeleteBucketInventoryConfigurationRequest = {}));
var DeleteBucketLifecycleRequest;
(function (DeleteBucketLifecycleRequest) {
    DeleteBucketLifecycleRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketLifecycleRequest || (DeleteBucketLifecycleRequest = {}));
var DeleteBucketMetricsConfigurationRequest;
(function (DeleteBucketMetricsConfigurationRequest) {
    DeleteBucketMetricsConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketMetricsConfigurationRequest || (DeleteBucketMetricsConfigurationRequest = {}));
var DeleteBucketOwnershipControlsRequest;
(function (DeleteBucketOwnershipControlsRequest) {
    DeleteBucketOwnershipControlsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketOwnershipControlsRequest || (DeleteBucketOwnershipControlsRequest = {}));
var DeleteBucketPolicyRequest;
(function (DeleteBucketPolicyRequest) {
    DeleteBucketPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketPolicyRequest || (DeleteBucketPolicyRequest = {}));
var DeleteBucketReplicationRequest;
(function (DeleteBucketReplicationRequest) {
    DeleteBucketReplicationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketReplicationRequest || (DeleteBucketReplicationRequest = {}));
var DeleteBucketTaggingRequest;
(function (DeleteBucketTaggingRequest) {
    DeleteBucketTaggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketTaggingRequest || (DeleteBucketTaggingRequest = {}));
var DeleteBucketWebsiteRequest;
(function (DeleteBucketWebsiteRequest) {
    DeleteBucketWebsiteRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteBucketWebsiteRequest || (DeleteBucketWebsiteRequest = {}));
var DeleteObjectOutput;
(function (DeleteObjectOutput) {
    DeleteObjectOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteObjectOutput || (DeleteObjectOutput = {}));
var DeleteObjectRequest;
(function (DeleteObjectRequest) {
    DeleteObjectRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteObjectRequest || (DeleteObjectRequest = {}));
var DeletedObject;
(function (DeletedObject) {
    DeletedObject.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeletedObject || (DeletedObject = {}));
var _Error;
(function (_Error) {
    _Error.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(_Error || (_Error = {}));
var DeleteObjectsOutput;
(function (DeleteObjectsOutput) {
    DeleteObjectsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteObjectsOutput || (DeleteObjectsOutput = {}));
var ObjectIdentifier;
(function (ObjectIdentifier) {
    ObjectIdentifier.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectIdentifier || (ObjectIdentifier = {}));
var Delete;
(function (Delete) {
    Delete.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Delete || (Delete = {}));
var DeleteObjectsRequest;
(function (DeleteObjectsRequest) {
    DeleteObjectsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteObjectsRequest || (DeleteObjectsRequest = {}));
var DeleteObjectTaggingOutput;
(function (DeleteObjectTaggingOutput) {
    DeleteObjectTaggingOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteObjectTaggingOutput || (DeleteObjectTaggingOutput = {}));
var DeleteObjectTaggingRequest;
(function (DeleteObjectTaggingRequest) {
    DeleteObjectTaggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteObjectTaggingRequest || (DeleteObjectTaggingRequest = {}));
var DeletePublicAccessBlockRequest;
(function (DeletePublicAccessBlockRequest) {
    DeletePublicAccessBlockRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeletePublicAccessBlockRequest || (DeletePublicAccessBlockRequest = {}));
var GetBucketAccelerateConfigurationOutput;
(function (GetBucketAccelerateConfigurationOutput) {
    GetBucketAccelerateConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketAccelerateConfigurationOutput || (GetBucketAccelerateConfigurationOutput = {}));
var GetBucketAccelerateConfigurationRequest;
(function (GetBucketAccelerateConfigurationRequest) {
    GetBucketAccelerateConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketAccelerateConfigurationRequest || (GetBucketAccelerateConfigurationRequest = {}));
var GetBucketAclOutput;
(function (GetBucketAclOutput) {
    GetBucketAclOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketAclOutput || (GetBucketAclOutput = {}));
var GetBucketAclRequest;
(function (GetBucketAclRequest) {
    GetBucketAclRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketAclRequest || (GetBucketAclRequest = {}));
var Tag;
(function (Tag) {
    Tag.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Tag || (Tag = {}));
var AnalyticsAndOperator;
(function (AnalyticsAndOperator) {
    AnalyticsAndOperator.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AnalyticsAndOperator || (AnalyticsAndOperator = {}));
var AnalyticsFilter;
(function (AnalyticsFilter) {
    AnalyticsFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AnalyticsFilter || (AnalyticsFilter = {}));
var AnalyticsS3BucketDestination;
(function (AnalyticsS3BucketDestination) {
    AnalyticsS3BucketDestination.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AnalyticsS3BucketDestination || (AnalyticsS3BucketDestination = {}));
var AnalyticsExportDestination;
(function (AnalyticsExportDestination) {
    AnalyticsExportDestination.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AnalyticsExportDestination || (AnalyticsExportDestination = {}));
var StorageClassAnalysisDataExport;
(function (StorageClassAnalysisDataExport) {
    StorageClassAnalysisDataExport.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(StorageClassAnalysisDataExport || (StorageClassAnalysisDataExport = {}));
var StorageClassAnalysis;
(function (StorageClassAnalysis) {
    StorageClassAnalysis.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(StorageClassAnalysis || (StorageClassAnalysis = {}));
var AnalyticsConfiguration;
(function (AnalyticsConfiguration) {
    AnalyticsConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AnalyticsConfiguration || (AnalyticsConfiguration = {}));
var GetBucketAnalyticsConfigurationOutput;
(function (GetBucketAnalyticsConfigurationOutput) {
    GetBucketAnalyticsConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketAnalyticsConfigurationOutput || (GetBucketAnalyticsConfigurationOutput = {}));
var GetBucketAnalyticsConfigurationRequest;
(function (GetBucketAnalyticsConfigurationRequest) {
    GetBucketAnalyticsConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketAnalyticsConfigurationRequest || (GetBucketAnalyticsConfigurationRequest = {}));
var CORSRule;
(function (CORSRule) {
    CORSRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CORSRule || (CORSRule = {}));
var GetBucketCorsOutput;
(function (GetBucketCorsOutput) {
    GetBucketCorsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketCorsOutput || (GetBucketCorsOutput = {}));
var GetBucketCorsRequest;
(function (GetBucketCorsRequest) {
    GetBucketCorsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketCorsRequest || (GetBucketCorsRequest = {}));
var ServerSideEncryptionByDefault;
(function (ServerSideEncryptionByDefault) {
    ServerSideEncryptionByDefault.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.KMSMasterKeyID && { KMSMasterKeyID: SENSITIVE_STRING }),
    });
})(ServerSideEncryptionByDefault || (ServerSideEncryptionByDefault = {}));
var ServerSideEncryptionRule;
(function (ServerSideEncryptionRule) {
    ServerSideEncryptionRule.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.ApplyServerSideEncryptionByDefault && {
            ApplyServerSideEncryptionByDefault: ServerSideEncryptionByDefault.filterSensitiveLog(obj.ApplyServerSideEncryptionByDefault),
        }),
    });
})(ServerSideEncryptionRule || (ServerSideEncryptionRule = {}));
var ServerSideEncryptionConfiguration;
(function (ServerSideEncryptionConfiguration) {
    ServerSideEncryptionConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.Rules && { Rules: obj.Rules.map((item) => ServerSideEncryptionRule.filterSensitiveLog(item)) }),
    });
})(ServerSideEncryptionConfiguration || (ServerSideEncryptionConfiguration = {}));
var GetBucketEncryptionOutput;
(function (GetBucketEncryptionOutput) {
    GetBucketEncryptionOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.ServerSideEncryptionConfiguration && {
            ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration.filterSensitiveLog(obj.ServerSideEncryptionConfiguration),
        }),
    });
})(GetBucketEncryptionOutput || (GetBucketEncryptionOutput = {}));
var GetBucketEncryptionRequest;
(function (GetBucketEncryptionRequest) {
    GetBucketEncryptionRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketEncryptionRequest || (GetBucketEncryptionRequest = {}));
var SSEKMS;
(function (SSEKMS) {
    SSEKMS.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.KeyId && { KeyId: SENSITIVE_STRING }),
    });
})(SSEKMS || (SSEKMS = {}));
var SSES3;
(function (SSES3) {
    SSES3.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(SSES3 || (SSES3 = {}));
var InventoryEncryption;
(function (InventoryEncryption) {
    InventoryEncryption.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMS && { SSEKMS: SSEKMS.filterSensitiveLog(obj.SSEKMS) }),
    });
})(InventoryEncryption || (InventoryEncryption = {}));
var InventoryS3BucketDestination;
(function (InventoryS3BucketDestination) {
    InventoryS3BucketDestination.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.Encryption && { Encryption: InventoryEncryption.filterSensitiveLog(obj.Encryption) }),
    });
})(InventoryS3BucketDestination || (InventoryS3BucketDestination = {}));
var InventoryDestination;
(function (InventoryDestination) {
    InventoryDestination.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.S3BucketDestination && {
            S3BucketDestination: InventoryS3BucketDestination.filterSensitiveLog(obj.S3BucketDestination),
        }),
    });
})(InventoryDestination || (InventoryDestination = {}));
var InventoryFilter;
(function (InventoryFilter) {
    InventoryFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InventoryFilter || (InventoryFilter = {}));
var InventorySchedule;
(function (InventorySchedule) {
    InventorySchedule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InventorySchedule || (InventorySchedule = {}));
var InventoryConfiguration;
(function (InventoryConfiguration) {
    InventoryConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.Destination && { Destination: InventoryDestination.filterSensitiveLog(obj.Destination) }),
    });
})(InventoryConfiguration || (InventoryConfiguration = {}));
var GetBucketInventoryConfigurationOutput;
(function (GetBucketInventoryConfigurationOutput) {
    GetBucketInventoryConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.InventoryConfiguration && {
            InventoryConfiguration: InventoryConfiguration.filterSensitiveLog(obj.InventoryConfiguration),
        }),
    });
})(GetBucketInventoryConfigurationOutput || (GetBucketInventoryConfigurationOutput = {}));
var GetBucketInventoryConfigurationRequest;
(function (GetBucketInventoryConfigurationRequest) {
    GetBucketInventoryConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketInventoryConfigurationRequest || (GetBucketInventoryConfigurationRequest = {}));
var LifecycleExpiration;
(function (LifecycleExpiration) {
    LifecycleExpiration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecycleExpiration || (LifecycleExpiration = {}));
var LifecycleRuleAndOperator;
(function (LifecycleRuleAndOperator) {
    LifecycleRuleAndOperator.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecycleRuleAndOperator || (LifecycleRuleAndOperator = {}));
var LifecycleRuleFilter;
(function (LifecycleRuleFilter) {
    LifecycleRuleFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecycleRuleFilter || (LifecycleRuleFilter = {}));
var NoncurrentVersionExpiration;
(function (NoncurrentVersionExpiration) {
    NoncurrentVersionExpiration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NoncurrentVersionExpiration || (NoncurrentVersionExpiration = {}));
var NoncurrentVersionTransition;
(function (NoncurrentVersionTransition) {
    NoncurrentVersionTransition.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NoncurrentVersionTransition || (NoncurrentVersionTransition = {}));
var Transition;
(function (Transition) {
    Transition.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Transition || (Transition = {}));
var LifecycleRule;
(function (LifecycleRule) {
    LifecycleRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecycleRule || (LifecycleRule = {}));
var GetBucketLifecycleConfigurationOutput;
(function (GetBucketLifecycleConfigurationOutput) {
    GetBucketLifecycleConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketLifecycleConfigurationOutput || (GetBucketLifecycleConfigurationOutput = {}));
var GetBucketLifecycleConfigurationRequest;
(function (GetBucketLifecycleConfigurationRequest) {
    GetBucketLifecycleConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketLifecycleConfigurationRequest || (GetBucketLifecycleConfigurationRequest = {}));
var GetBucketLocationOutput;
(function (GetBucketLocationOutput) {
    GetBucketLocationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketLocationOutput || (GetBucketLocationOutput = {}));
var GetBucketLocationRequest;
(function (GetBucketLocationRequest) {
    GetBucketLocationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketLocationRequest || (GetBucketLocationRequest = {}));
var TargetGrant;
(function (TargetGrant) {
    TargetGrant.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(TargetGrant || (TargetGrant = {}));
var LoggingEnabled;
(function (LoggingEnabled) {
    LoggingEnabled.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LoggingEnabled || (LoggingEnabled = {}));
var GetBucketLoggingOutput;
(function (GetBucketLoggingOutput) {
    GetBucketLoggingOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketLoggingOutput || (GetBucketLoggingOutput = {}));
var GetBucketLoggingRequest;
(function (GetBucketLoggingRequest) {
    GetBucketLoggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketLoggingRequest || (GetBucketLoggingRequest = {}));
var MetricsAndOperator;
(function (MetricsAndOperator) {
    MetricsAndOperator.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(MetricsAndOperator || (MetricsAndOperator = {}));
var MetricsFilter;
(function (MetricsFilter) {
    MetricsFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(MetricsFilter || (MetricsFilter = {}));
var MetricsConfiguration;
(function (MetricsConfiguration) {
    MetricsConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(MetricsConfiguration || (MetricsConfiguration = {}));
var GetBucketMetricsConfigurationOutput;
(function (GetBucketMetricsConfigurationOutput) {
    GetBucketMetricsConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketMetricsConfigurationOutput || (GetBucketMetricsConfigurationOutput = {}));
var GetBucketMetricsConfigurationRequest;
(function (GetBucketMetricsConfigurationRequest) {
    GetBucketMetricsConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketMetricsConfigurationRequest || (GetBucketMetricsConfigurationRequest = {}));
var GetBucketNotificationConfigurationRequest;
(function (GetBucketNotificationConfigurationRequest) {
    GetBucketNotificationConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketNotificationConfigurationRequest || (GetBucketNotificationConfigurationRequest = {}));
var FilterRule;
(function (FilterRule) {
    FilterRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(FilterRule || (FilterRule = {}));
var S3KeyFilter;
(function (S3KeyFilter) {
    S3KeyFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(S3KeyFilter || (S3KeyFilter = {}));
var NotificationConfigurationFilter;
(function (NotificationConfigurationFilter) {
    NotificationConfigurationFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NotificationConfigurationFilter || (NotificationConfigurationFilter = {}));
var LambdaFunctionConfiguration;
(function (LambdaFunctionConfiguration) {
    LambdaFunctionConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LambdaFunctionConfiguration || (LambdaFunctionConfiguration = {}));
var QueueConfiguration;
(function (QueueConfiguration) {
    QueueConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(QueueConfiguration || (QueueConfiguration = {}));
var TopicConfiguration;
(function (TopicConfiguration) {
    TopicConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(TopicConfiguration || (TopicConfiguration = {}));
var NotificationConfiguration;
(function (NotificationConfiguration) {
    NotificationConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NotificationConfiguration || (NotificationConfiguration = {}));
var OwnershipControlsRule;
(function (OwnershipControlsRule) {
    OwnershipControlsRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(OwnershipControlsRule || (OwnershipControlsRule = {}));
var OwnershipControls;
(function (OwnershipControls) {
    OwnershipControls.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(OwnershipControls || (OwnershipControls = {}));
var GetBucketOwnershipControlsOutput;
(function (GetBucketOwnershipControlsOutput) {
    GetBucketOwnershipControlsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketOwnershipControlsOutput || (GetBucketOwnershipControlsOutput = {}));
var GetBucketOwnershipControlsRequest;
(function (GetBucketOwnershipControlsRequest) {
    GetBucketOwnershipControlsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketOwnershipControlsRequest || (GetBucketOwnershipControlsRequest = {}));
var GetBucketPolicyOutput;
(function (GetBucketPolicyOutput) {
    GetBucketPolicyOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketPolicyOutput || (GetBucketPolicyOutput = {}));
var GetBucketPolicyRequest;
(function (GetBucketPolicyRequest) {
    GetBucketPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketPolicyRequest || (GetBucketPolicyRequest = {}));
var PolicyStatus;
(function (PolicyStatus) {
    PolicyStatus.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PolicyStatus || (PolicyStatus = {}));
var GetBucketPolicyStatusOutput;
(function (GetBucketPolicyStatusOutput) {
    GetBucketPolicyStatusOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketPolicyStatusOutput || (GetBucketPolicyStatusOutput = {}));
var GetBucketPolicyStatusRequest;
(function (GetBucketPolicyStatusRequest) {
    GetBucketPolicyStatusRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketPolicyStatusRequest || (GetBucketPolicyStatusRequest = {}));
var DeleteMarkerReplication;
(function (DeleteMarkerReplication) {
    DeleteMarkerReplication.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteMarkerReplication || (DeleteMarkerReplication = {}));
var EncryptionConfiguration;
(function (EncryptionConfiguration) {
    EncryptionConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(EncryptionConfiguration || (EncryptionConfiguration = {}));
var ReplicationTimeValue;
(function (ReplicationTimeValue) {
    ReplicationTimeValue.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationTimeValue || (ReplicationTimeValue = {}));
var Metrics;
(function (Metrics) {
    Metrics.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Metrics || (Metrics = {}));
var ReplicationTime;
(function (ReplicationTime) {
    ReplicationTime.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationTime || (ReplicationTime = {}));
var Destination;
(function (Destination) {
    Destination.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Destination || (Destination = {}));
var ExistingObjectReplication;
(function (ExistingObjectReplication) {
    ExistingObjectReplication.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ExistingObjectReplication || (ExistingObjectReplication = {}));
var ReplicationRuleAndOperator;
(function (ReplicationRuleAndOperator) {
    ReplicationRuleAndOperator.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationRuleAndOperator || (ReplicationRuleAndOperator = {}));
var ReplicationRuleFilter;
(function (ReplicationRuleFilter) {
    ReplicationRuleFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationRuleFilter || (ReplicationRuleFilter = {}));
var SseKmsEncryptedObjects;
(function (SseKmsEncryptedObjects) {
    SseKmsEncryptedObjects.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(SseKmsEncryptedObjects || (SseKmsEncryptedObjects = {}));
var SourceSelectionCriteria;
(function (SourceSelectionCriteria) {
    SourceSelectionCriteria.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(SourceSelectionCriteria || (SourceSelectionCriteria = {}));
var ReplicationRule;
(function (ReplicationRule) {
    ReplicationRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationRule || (ReplicationRule = {}));
var ReplicationConfiguration;
(function (ReplicationConfiguration) {
    ReplicationConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationConfiguration || (ReplicationConfiguration = {}));
var GetBucketReplicationOutput;
(function (GetBucketReplicationOutput) {
    GetBucketReplicationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketReplicationOutput || (GetBucketReplicationOutput = {}));
var GetBucketReplicationRequest;
(function (GetBucketReplicationRequest) {
    GetBucketReplicationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketReplicationRequest || (GetBucketReplicationRequest = {}));
var GetBucketRequestPaymentOutput;
(function (GetBucketRequestPaymentOutput) {
    GetBucketRequestPaymentOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketRequestPaymentOutput || (GetBucketRequestPaymentOutput = {}));
var GetBucketRequestPaymentRequest;
(function (GetBucketRequestPaymentRequest) {
    GetBucketRequestPaymentRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketRequestPaymentRequest || (GetBucketRequestPaymentRequest = {}));
var GetBucketTaggingOutput;
(function (GetBucketTaggingOutput) {
    GetBucketTaggingOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketTaggingOutput || (GetBucketTaggingOutput = {}));
var GetBucketTaggingRequest;
(function (GetBucketTaggingRequest) {
    GetBucketTaggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketTaggingRequest || (GetBucketTaggingRequest = {}));
var GetBucketVersioningOutput;
(function (GetBucketVersioningOutput) {
    GetBucketVersioningOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketVersioningOutput || (GetBucketVersioningOutput = {}));
var GetBucketVersioningRequest;
(function (GetBucketVersioningRequest) {
    GetBucketVersioningRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketVersioningRequest || (GetBucketVersioningRequest = {}));
var ErrorDocument;
(function (ErrorDocument) {
    ErrorDocument.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ErrorDocument || (ErrorDocument = {}));
var IndexDocument;
(function (IndexDocument) {
    IndexDocument.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(IndexDocument || (IndexDocument = {}));
var RedirectAllRequestsTo;
(function (RedirectAllRequestsTo) {
    RedirectAllRequestsTo.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RedirectAllRequestsTo || (RedirectAllRequestsTo = {}));
var Condition;
(function (Condition) {
    Condition.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Condition || (Condition = {}));
var Redirect;
(function (Redirect) {
    Redirect.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Redirect || (Redirect = {}));
var RoutingRule;
(function (RoutingRule) {
    RoutingRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RoutingRule || (RoutingRule = {}));
var GetBucketWebsiteOutput;
(function (GetBucketWebsiteOutput) {
    GetBucketWebsiteOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketWebsiteOutput || (GetBucketWebsiteOutput = {}));
var GetBucketWebsiteRequest;
(function (GetBucketWebsiteRequest) {
    GetBucketWebsiteRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetBucketWebsiteRequest || (GetBucketWebsiteRequest = {}));
var GetObjectOutput;
(function (GetObjectOutput) {
    GetObjectOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(GetObjectOutput || (GetObjectOutput = {}));
var GetObjectRequest;
(function (GetObjectRequest) {
    GetObjectRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }),
    });
})(GetObjectRequest || (GetObjectRequest = {}));
var NoSuchKey;
(function (NoSuchKey) {
    NoSuchKey.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NoSuchKey || (NoSuchKey = {}));
var GetObjectAclOutput;
(function (GetObjectAclOutput) {
    GetObjectAclOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectAclOutput || (GetObjectAclOutput = {}));
var GetObjectAclRequest;
(function (GetObjectAclRequest) {
    GetObjectAclRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectAclRequest || (GetObjectAclRequest = {}));
var ObjectLockLegalHold;
(function (ObjectLockLegalHold) {
    ObjectLockLegalHold.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectLockLegalHold || (ObjectLockLegalHold = {}));
var GetObjectLegalHoldOutput;
(function (GetObjectLegalHoldOutput) {
    GetObjectLegalHoldOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectLegalHoldOutput || (GetObjectLegalHoldOutput = {}));
var GetObjectLegalHoldRequest;
(function (GetObjectLegalHoldRequest) {
    GetObjectLegalHoldRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectLegalHoldRequest || (GetObjectLegalHoldRequest = {}));
var DefaultRetention;
(function (DefaultRetention) {
    DefaultRetention.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DefaultRetention || (DefaultRetention = {}));
var ObjectLockRule;
(function (ObjectLockRule) {
    ObjectLockRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectLockRule || (ObjectLockRule = {}));
var ObjectLockConfiguration;
(function (ObjectLockConfiguration) {
    ObjectLockConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectLockConfiguration || (ObjectLockConfiguration = {}));
var GetObjectLockConfigurationOutput;
(function (GetObjectLockConfigurationOutput) {
    GetObjectLockConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectLockConfigurationOutput || (GetObjectLockConfigurationOutput = {}));
var GetObjectLockConfigurationRequest;
(function (GetObjectLockConfigurationRequest) {
    GetObjectLockConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectLockConfigurationRequest || (GetObjectLockConfigurationRequest = {}));
var ObjectLockRetention;
(function (ObjectLockRetention) {
    ObjectLockRetention.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectLockRetention || (ObjectLockRetention = {}));
var GetObjectRetentionOutput;
(function (GetObjectRetentionOutput) {
    GetObjectRetentionOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectRetentionOutput || (GetObjectRetentionOutput = {}));
var GetObjectRetentionRequest;
(function (GetObjectRetentionRequest) {
    GetObjectRetentionRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectRetentionRequest || (GetObjectRetentionRequest = {}));
var GetObjectTaggingOutput;
(function (GetObjectTaggingOutput) {
    GetObjectTaggingOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectTaggingOutput || (GetObjectTaggingOutput = {}));
var GetObjectTaggingRequest;
(function (GetObjectTaggingRequest) {
    GetObjectTaggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectTaggingRequest || (GetObjectTaggingRequest = {}));
var GetObjectTorrentOutput;
(function (GetObjectTorrentOutput) {
    GetObjectTorrentOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectTorrentOutput || (GetObjectTorrentOutput = {}));
var GetObjectTorrentRequest;
(function (GetObjectTorrentRequest) {
    GetObjectTorrentRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetObjectTorrentRequest || (GetObjectTorrentRequest = {}));
var PublicAccessBlockConfiguration;
(function (PublicAccessBlockConfiguration) {
    PublicAccessBlockConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PublicAccessBlockConfiguration || (PublicAccessBlockConfiguration = {}));
var GetPublicAccessBlockOutput;
(function (GetPublicAccessBlockOutput) {
    GetPublicAccessBlockOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetPublicAccessBlockOutput || (GetPublicAccessBlockOutput = {}));
var GetPublicAccessBlockRequest;
(function (GetPublicAccessBlockRequest) {
    GetPublicAccessBlockRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetPublicAccessBlockRequest || (GetPublicAccessBlockRequest = {}));
var HeadBucketRequest;
(function (HeadBucketRequest) {
    HeadBucketRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(HeadBucketRequest || (HeadBucketRequest = {}));
var NoSuchBucket;
(function (NoSuchBucket) {
    NoSuchBucket.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(NoSuchBucket || (NoSuchBucket = {}));
var HeadObjectOutput;
(function (HeadObjectOutput) {
    HeadObjectOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(HeadObjectOutput || (HeadObjectOutput = {}));
var HeadObjectRequest;
(function (HeadObjectRequest) {
    HeadObjectRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }),
    });
})(HeadObjectRequest || (HeadObjectRequest = {}));
var ListBucketAnalyticsConfigurationsOutput;
(function (ListBucketAnalyticsConfigurationsOutput) {
    ListBucketAnalyticsConfigurationsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListBucketAnalyticsConfigurationsOutput || (ListBucketAnalyticsConfigurationsOutput = {}));
var ListBucketAnalyticsConfigurationsRequest;
(function (ListBucketAnalyticsConfigurationsRequest) {
    ListBucketAnalyticsConfigurationsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListBucketAnalyticsConfigurationsRequest || (ListBucketAnalyticsConfigurationsRequest = {}));
var ListBucketInventoryConfigurationsOutput;
(function (ListBucketInventoryConfigurationsOutput) {
    ListBucketInventoryConfigurationsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.InventoryConfigurationList && {
            InventoryConfigurationList: obj.InventoryConfigurationList.map((item) => InventoryConfiguration.filterSensitiveLog(item)),
        }),
    });
})(ListBucketInventoryConfigurationsOutput || (ListBucketInventoryConfigurationsOutput = {}));
var ListBucketInventoryConfigurationsRequest;
(function (ListBucketInventoryConfigurationsRequest) {
    ListBucketInventoryConfigurationsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListBucketInventoryConfigurationsRequest || (ListBucketInventoryConfigurationsRequest = {}));
var ListBucketMetricsConfigurationsOutput;
(function (ListBucketMetricsConfigurationsOutput) {
    ListBucketMetricsConfigurationsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListBucketMetricsConfigurationsOutput || (ListBucketMetricsConfigurationsOutput = {}));
var ListBucketMetricsConfigurationsRequest;
(function (ListBucketMetricsConfigurationsRequest) {
    ListBucketMetricsConfigurationsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListBucketMetricsConfigurationsRequest || (ListBucketMetricsConfigurationsRequest = {}));
var Bucket;
(function (Bucket) {
    Bucket.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Bucket || (Bucket = {}));
var ListBucketsOutput;
(function (ListBucketsOutput) {
    ListBucketsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListBucketsOutput || (ListBucketsOutput = {}));
var CommonPrefix;
(function (CommonPrefix) {
    CommonPrefix.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CommonPrefix || (CommonPrefix = {}));
var Initiator;
(function (Initiator) {
    Initiator.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Initiator || (Initiator = {}));
var MultipartUpload;
(function (MultipartUpload) {
    MultipartUpload.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(MultipartUpload || (MultipartUpload = {}));
var ListMultipartUploadsOutput;
(function (ListMultipartUploadsOutput) {
    ListMultipartUploadsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListMultipartUploadsOutput || (ListMultipartUploadsOutput = {}));
var ListMultipartUploadsRequest;
(function (ListMultipartUploadsRequest) {
    ListMultipartUploadsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListMultipartUploadsRequest || (ListMultipartUploadsRequest = {}));
var _Object;
(function (_Object) {
    _Object.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(_Object || (_Object = {}));
var ListObjectsOutput;
(function (ListObjectsOutput) {
    ListObjectsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListObjectsOutput || (ListObjectsOutput = {}));
var ListObjectsRequest;
(function (ListObjectsRequest) {
    ListObjectsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListObjectsRequest || (ListObjectsRequest = {}));
var ListObjectsV2Output;
(function (ListObjectsV2Output) {
    ListObjectsV2Output.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListObjectsV2Output || (ListObjectsV2Output = {}));
var ListObjectsV2Request;
(function (ListObjectsV2Request) {
    ListObjectsV2Request.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListObjectsV2Request || (ListObjectsV2Request = {}));
var DeleteMarkerEntry;
(function (DeleteMarkerEntry) {
    DeleteMarkerEntry.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteMarkerEntry || (DeleteMarkerEntry = {}));
var ObjectVersion;
(function (ObjectVersion) {
    ObjectVersion.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectVersion || (ObjectVersion = {}));
var ListObjectVersionsOutput;
(function (ListObjectVersionsOutput) {
    ListObjectVersionsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListObjectVersionsOutput || (ListObjectVersionsOutput = {}));
var ListObjectVersionsRequest;
(function (ListObjectVersionsRequest) {
    ListObjectVersionsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListObjectVersionsRequest || (ListObjectVersionsRequest = {}));
var Part;
(function (Part) {
    Part.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Part || (Part = {}));
var ListPartsOutput;
(function (ListPartsOutput) {
    ListPartsOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListPartsOutput || (ListPartsOutput = {}));
var ListPartsRequest;
(function (ListPartsRequest) {
    ListPartsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListPartsRequest || (ListPartsRequest = {}));
var PutBucketAccelerateConfigurationRequest;
(function (PutBucketAccelerateConfigurationRequest) {
    PutBucketAccelerateConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketAccelerateConfigurationRequest || (PutBucketAccelerateConfigurationRequest = {}));
var PutBucketAclRequest;
(function (PutBucketAclRequest) {
    PutBucketAclRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketAclRequest || (PutBucketAclRequest = {}));
var PutBucketAnalyticsConfigurationRequest;
(function (PutBucketAnalyticsConfigurationRequest) {
    PutBucketAnalyticsConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketAnalyticsConfigurationRequest || (PutBucketAnalyticsConfigurationRequest = {}));
var CORSConfiguration;
(function (CORSConfiguration) {
    CORSConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CORSConfiguration || (CORSConfiguration = {}));
var PutBucketCorsRequest;
(function (PutBucketCorsRequest) {
    PutBucketCorsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketCorsRequest || (PutBucketCorsRequest = {}));
var PutBucketEncryptionRequest;
(function (PutBucketEncryptionRequest) {
    PutBucketEncryptionRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.ServerSideEncryptionConfiguration && {
            ServerSideEncryptionConfiguration: ServerSideEncryptionConfiguration.filterSensitiveLog(obj.ServerSideEncryptionConfiguration),
        }),
    });
})(PutBucketEncryptionRequest || (PutBucketEncryptionRequest = {}));
var PutBucketInventoryConfigurationRequest;
(function (PutBucketInventoryConfigurationRequest) {
    PutBucketInventoryConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.InventoryConfiguration && {
            InventoryConfiguration: InventoryConfiguration.filterSensitiveLog(obj.InventoryConfiguration),
        }),
    });
})(PutBucketInventoryConfigurationRequest || (PutBucketInventoryConfigurationRequest = {}));
var BucketLifecycleConfiguration;
(function (BucketLifecycleConfiguration) {
    BucketLifecycleConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BucketLifecycleConfiguration || (BucketLifecycleConfiguration = {}));
var PutBucketLifecycleConfigurationRequest;
(function (PutBucketLifecycleConfigurationRequest) {
    PutBucketLifecycleConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketLifecycleConfigurationRequest || (PutBucketLifecycleConfigurationRequest = {}));
var BucketLoggingStatus;
(function (BucketLoggingStatus) {
    BucketLoggingStatus.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BucketLoggingStatus || (BucketLoggingStatus = {}));
var PutBucketLoggingRequest;
(function (PutBucketLoggingRequest) {
    PutBucketLoggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketLoggingRequest || (PutBucketLoggingRequest = {}));
var PutBucketMetricsConfigurationRequest;
(function (PutBucketMetricsConfigurationRequest) {
    PutBucketMetricsConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketMetricsConfigurationRequest || (PutBucketMetricsConfigurationRequest = {}));
var PutBucketNotificationConfigurationRequest;
(function (PutBucketNotificationConfigurationRequest) {
    PutBucketNotificationConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketNotificationConfigurationRequest || (PutBucketNotificationConfigurationRequest = {}));
var PutBucketOwnershipControlsRequest;
(function (PutBucketOwnershipControlsRequest) {
    PutBucketOwnershipControlsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketOwnershipControlsRequest || (PutBucketOwnershipControlsRequest = {}));
var PutBucketPolicyRequest;
(function (PutBucketPolicyRequest) {
    PutBucketPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketPolicyRequest || (PutBucketPolicyRequest = {}));
var PutBucketReplicationRequest;
(function (PutBucketReplicationRequest) {
    PutBucketReplicationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketReplicationRequest || (PutBucketReplicationRequest = {}));
var RequestPaymentConfiguration;
(function (RequestPaymentConfiguration) {
    RequestPaymentConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RequestPaymentConfiguration || (RequestPaymentConfiguration = {}));
var PutBucketRequestPaymentRequest;
(function (PutBucketRequestPaymentRequest) {
    PutBucketRequestPaymentRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketRequestPaymentRequest || (PutBucketRequestPaymentRequest = {}));
var Tagging;
(function (Tagging) {
    Tagging.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Tagging || (Tagging = {}));
var PutBucketTaggingRequest;
(function (PutBucketTaggingRequest) {
    PutBucketTaggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketTaggingRequest || (PutBucketTaggingRequest = {}));
var VersioningConfiguration;
(function (VersioningConfiguration) {
    VersioningConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(VersioningConfiguration || (VersioningConfiguration = {}));
var PutBucketVersioningRequest;
(function (PutBucketVersioningRequest) {
    PutBucketVersioningRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketVersioningRequest || (PutBucketVersioningRequest = {}));
var WebsiteConfiguration;
(function (WebsiteConfiguration) {
    WebsiteConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(WebsiteConfiguration || (WebsiteConfiguration = {}));
var PutBucketWebsiteRequest;
(function (PutBucketWebsiteRequest) {
    PutBucketWebsiteRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutBucketWebsiteRequest || (PutBucketWebsiteRequest = {}));
var PutObjectOutput;
(function (PutObjectOutput) {
    PutObjectOutput.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }),
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(PutObjectOutput || (PutObjectOutput = {}));
var PutObjectRequest;
(function (PutObjectRequest) {
    PutObjectRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING }),
        ...(obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }),
        ...(obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING }),
    });
})(PutObjectRequest || (PutObjectRequest = {}));
var PutObjectAclOutput;
(function (PutObjectAclOutput) {
    PutObjectAclOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectAclOutput || (PutObjectAclOutput = {}));
var PutObjectAclRequest;
(function (PutObjectAclRequest) {
    PutObjectAclRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectAclRequest || (PutObjectAclRequest = {}));
var PutObjectLegalHoldOutput;
(function (PutObjectLegalHoldOutput) {
    PutObjectLegalHoldOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectLegalHoldOutput || (PutObjectLegalHoldOutput = {}));
var PutObjectLegalHoldRequest;
(function (PutObjectLegalHoldRequest) {
    PutObjectLegalHoldRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectLegalHoldRequest || (PutObjectLegalHoldRequest = {}));
var PutObjectLockConfigurationOutput;
(function (PutObjectLockConfigurationOutput) {
    PutObjectLockConfigurationOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectLockConfigurationOutput || (PutObjectLockConfigurationOutput = {}));
var PutObjectLockConfigurationRequest;
(function (PutObjectLockConfigurationRequest) {
    PutObjectLockConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectLockConfigurationRequest || (PutObjectLockConfigurationRequest = {}));
var PutObjectRetentionOutput;
(function (PutObjectRetentionOutput) {
    PutObjectRetentionOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectRetentionOutput || (PutObjectRetentionOutput = {}));
var PutObjectRetentionRequest;
(function (PutObjectRetentionRequest) {
    PutObjectRetentionRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectRetentionRequest || (PutObjectRetentionRequest = {}));
var PutObjectTaggingOutput;
(function (PutObjectTaggingOutput) {
    PutObjectTaggingOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectTaggingOutput || (PutObjectTaggingOutput = {}));
var PutObjectTaggingRequest;
(function (PutObjectTaggingRequest) {
    PutObjectTaggingRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutObjectTaggingRequest || (PutObjectTaggingRequest = {}));
var PutPublicAccessBlockRequest;
(function (PutPublicAccessBlockRequest) {
    PutPublicAccessBlockRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutPublicAccessBlockRequest || (PutPublicAccessBlockRequest = {}));
var ObjectAlreadyInActiveTierError;
(function (ObjectAlreadyInActiveTierError) {
    ObjectAlreadyInActiveTierError.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ObjectAlreadyInActiveTierError || (ObjectAlreadyInActiveTierError = {}));
var RestoreObjectOutput;
(function (RestoreObjectOutput) {
    RestoreObjectOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RestoreObjectOutput || (RestoreObjectOutput = {}));
var GlacierJobParameters;
(function (GlacierJobParameters) {
    GlacierJobParameters.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GlacierJobParameters || (GlacierJobParameters = {}));
var Encryption;
(function (Encryption) {
    Encryption.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.KMSKeyId && { KMSKeyId: SENSITIVE_STRING }),
    });
})(Encryption || (Encryption = {}));
var MetadataEntry;
(function (MetadataEntry) {
    MetadataEntry.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(MetadataEntry || (MetadataEntry = {}));
var S3Location;
(function (S3Location) {
    S3Location.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.Encryption && { Encryption: Encryption.filterSensitiveLog(obj.Encryption) }),
    });
})(S3Location || (S3Location = {}));
var OutputLocation;
(function (OutputLocation) {
    OutputLocation.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.S3 && { S3: S3Location.filterSensitiveLog(obj.S3) }),
    });
})(OutputLocation || (OutputLocation = {}));
var FileHeaderInfo;
(function (FileHeaderInfo) {
    FileHeaderInfo["IGNORE"] = "IGNORE";
    FileHeaderInfo["NONE"] = "NONE";
    FileHeaderInfo["USE"] = "USE";
})(FileHeaderInfo || (FileHeaderInfo = {}));
var CSVInput;
(function (CSVInput) {
    CSVInput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CSVInput || (CSVInput = {}));
var JSONType;
(function (JSONType) {
    JSONType["DOCUMENT"] = "DOCUMENT";
    JSONType["LINES"] = "LINES";
})(JSONType || (JSONType = {}));
var JSONInput;
(function (JSONInput) {
    JSONInput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(JSONInput || (JSONInput = {}));
var ParquetInput;
(function (ParquetInput) {
    ParquetInput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ParquetInput || (ParquetInput = {}));
var InputSerialization;
(function (InputSerialization) {
    InputSerialization.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InputSerialization || (InputSerialization = {}));
var QuoteFields;
(function (QuoteFields) {
    QuoteFields["ALWAYS"] = "ALWAYS";
    QuoteFields["ASNEEDED"] = "ASNEEDED";
})(QuoteFields || (QuoteFields = {}));
var CSVOutput;
(function (CSVOutput) {
    CSVOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CSVOutput || (CSVOutput = {}));
var JSONOutput;
(function (JSONOutput) {
    JSONOutput.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(JSONOutput || (JSONOutput = {}));
var OutputSerialization;
(function (OutputSerialization) {
    OutputSerialization.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(OutputSerialization || (OutputSerialization = {}));
var SelectParameters;
(function (SelectParameters) {
    SelectParameters.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(SelectParameters || (SelectParameters = {}));

var util = imageHandler.createCommonjsModule(function (module, exports) {

const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*';
const regexName = new RegExp('^' + nameRegexp + '$');

const getAllMatches = function(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
};

const isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === 'undefined');
};

exports.isExist = function(v) {
  return typeof v !== 'undefined';
};

exports.isEmptyObject = function(obj) {
  return Object.keys(obj).length === 0;
};

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
exports.merge = function(target, a, arrayMode) {
  if (a) {
    const keys = Object.keys(a); // will return an array of own properties
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      if(arrayMode === 'strict'){
        target[keys[i]] = [ a[keys[i]] ];
      }else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

exports.getValue = function(v) {
  if (exports.isExist(v)) {
    return v;
  } else {
    return '';
  }
};

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};

exports.buildOptions = function(options, defaultOptions, props) {
  var newOptions = {};
  if (!options) {
    return defaultOptions; //if there are not options
  }

  for (let i = 0; i < props.length; i++) {
    if (options[props[i]] !== undefined) {
      newOptions[props[i]] = options[props[i]];
    } else {
      newOptions[props[i]] = defaultOptions[props[i]];
    }
  }
  return newOptions;
};

exports.isName = isName;
exports.getAllMatches = getAllMatches;
exports.nameRegexp = nameRegexp;
});

const convertToJson = function(node, options) {
  const jObj = {};

  //when no child node or attr is present
  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        if(options.arrayMode === "strict"){
          jObj[options.textNodeName] = [ node.val ];
        }else {
          jObj[options.textNodeName] = node.val;
        }
      }
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    var tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj[tagname] = [];
      for (var tag in node.child[tagname]) {
        jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
      }
    } else {
      if(options.arrayMode === true){
        const result = convertToJson(node.child[tagname][0], options);
        if(typeof result === 'object')
          jObj[tagname] = [ result ];
        else
          jObj[tagname] = result;
      }else if(options.arrayMode === "strict"){
        jObj[tagname] = [convertToJson(node.child[tagname][0], options) ];
      }else {
        jObj[tagname] = convertToJson(node.child[tagname][0], options);
      }
    }
  }

  //add value
  return jObj;
};

var convertToJson_1 = convertToJson;

var node2json = {
	convertToJson: convertToJson_1
};

var xmlNode = function(tagname, parent, val) {
  this.tagname = tagname;
  this.parent = parent;
  this.child = {}; //child tags
  this.attrsMap = {}; //attributes map
  this.val = val; //text only
  this.addChild = function(child) {
    if (Array.isArray(this.child[child.tagname])) {
      //already presents
      this.child[child.tagname].push(child);
    } else {
      this.child[child.tagname] = [child];
    }
  };
};

const buildOptions$3 = util.buildOptions;

'<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)'
  .replace(/NAME/g, util.nameRegexp);

//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

//polyfill
if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}

const defaultOptions$2 = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false, //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true, //Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: '\\c',
  tagValueProcessor: function(a, tagName) {
    return a;
  },
  attrValueProcessor: function(a, attrName) {
    return a;
  },
  stopNodes: []
  //decodeStrict: false,
};

var defaultOptions_1 = defaultOptions$2;

const props$2 = [
  'attributeNamePrefix',
  'attrNodeName',
  'textNodeName',
  'ignoreAttributes',
  'ignoreNameSpace',
  'allowBooleanAttributes',
  'parseNodeValue',
  'parseAttributeValue',
  'arrayMode',
  'trimValues',
  'cdataTagName',
  'cdataPositionChar',
  'tagValueProcessor',
  'attrValueProcessor',
  'parseTrueNumberOnly',
  'stopNodes'
];
var props_1 = props$2;

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} val
 * @param {object} options
 */
function processTagValue(tagName, val, options) {
  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }
    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    const tags = tagname.split(':');
    const prefix = tagname.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}

function parseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'string') {
    let parsed;
    if (val.trim() === '' || isNaN(val)) {
      parsed = val === 'true' ? true : val === 'false' ? false : val;
    } else {
      if (val.indexOf('0x') !== -1) {
        //support hexa decimal
        parsed = Number.parseInt(val, 16);
      } else if (val.indexOf('.') !== -1) {
        parsed = Number.parseFloat(val);
        val = val.replace(/\.?0+$/, "");
      } else {
        parsed = Number.parseInt(val, 10);
      }
      if (parseTrueNumberOnly) {
        parsed = String(parsed) === val ? parsed : val;
      }
    }
    return parsed;
  } else {
    if (util.isExist(val)) {
      return val;
    } else {
      return '';
    }
  }
}

//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g');

function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === 'string') {
    attrStr = attrStr.replace(/\r?\n/g, ' ');
    //attrStr = attrStr || attrStr.trim();

    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length; //don't make it inline
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const attrName = resolveNameSpace(matches[i][1], options);
      if (attrName.length) {
        if (matches[i][4] !== undefined) {
          if (options.trimValues) {
            matches[i][4] = matches[i][4].trim();
          }
          matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
          attrs[options.attributeNamePrefix + attrName] = parseValue(
            matches[i][4],
            options.parseAttributeValue,
            options.parseTrueNumberOnly
          );
        } else if (options.allowBooleanAttributes) {
          attrs[options.attributeNamePrefix + attrName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (options.attrNodeName) {
      const attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}

const getTraversalObj = function(xmlData, options) {
  xmlData = xmlData.replace(/(\r\n)|\n/, " ");
  options = buildOptions$3(options, defaultOptions$2, props$2);
  const xmlObj = new xmlNode('!xml');
  let currentNode = xmlObj;
  let textData = "";

//function match(xmlData){
  for(let i=0; i< xmlData.length; i++){
    const ch = xmlData[i];
    if(ch === '<'){
      if( xmlData[i+1] === '/') {//Closing Tag
        const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
        let tagName = xmlData.substring(i+2,closeIndex).trim();

        if(options.ignoreNameSpace){
          const colonIndex = tagName.indexOf(":");
          if(colonIndex !== -1){
            tagName = tagName.substr(colonIndex+1);
          }
        }

        /* if (currentNode.parent) {
          currentNode.parent.val = util.getValue(currentNode.parent.val) + '' + processTagValue2(tagName, textData , options);
        } */
        if(currentNode){
          if(currentNode.val){
            currentNode.val = util.getValue(currentNode.val) + '' + processTagValue(tagName, textData , options);
          }else {
            currentNode.val = processTagValue(tagName, textData , options);
          }
        }

        if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
          currentNode.child = [];
          if (currentNode.attrsMap == undefined) { currentNode.attrsMap = {};}
          currentNode.val = xmlData.substr(currentNode.startIndex + 1, i - currentNode.startIndex - 1);
        }
        currentNode = currentNode.parent;
        textData = "";
        i = closeIndex;
      } else if( xmlData[i+1] === '?') {
        i = findClosingIndex(xmlData, "?>", i, "Pi Tag is not closed.");
      } else if(xmlData.substr(i + 1, 3) === '!--') {
        i = findClosingIndex(xmlData, "-->", i, "Comment is not closed.");
      } else if( xmlData.substr(i + 1, 2) === '!D') {
        const closeIndex = findClosingIndex(xmlData, ">", i, "DOCTYPE is not closed.");
        const tagExp = xmlData.substring(i, closeIndex);
        if(tagExp.indexOf("[") >= 0){
          i = xmlData.indexOf("]>", i) + 1;
        }else {
          i = closeIndex;
        }
      }else if(xmlData.substr(i + 1, 2) === '![') {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i + 9,closeIndex);

        //considerations
        //1. CDATA will always have parent node
        //2. A tag with CDATA is not a leaf node so it's value would be string type.
        if(textData){
          currentNode.val = util.getValue(currentNode.val) + '' + processTagValue(currentNode.tagname, textData , options);
          textData = "";
        }

        if (options.cdataTagName) {
          //add cdata node
          const childNode = new xmlNode(options.cdataTagName, currentNode, tagExp);
          currentNode.addChild(childNode);
          //for backtracking
          currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar;
          //add rest value to parent node
          if (tagExp) {
            childNode.val = tagExp;
          }
        } else {
          currentNode.val = (currentNode.val || '') + (tagExp || '');
        }

        i = closeIndex + 2;
      }else {//Opening tag
        const result = closingIndexForOpeningTag(xmlData, i+1);
        let tagExp = result.data;
        const closeIndex = result.index;
        const separatorIndex = tagExp.indexOf(" ");
        let tagName = tagExp;
        if(separatorIndex !== -1){
          tagName = tagExp.substr(0, separatorIndex).trimRight();
          tagExp = tagExp.substr(separatorIndex + 1);
        }

        if(options.ignoreNameSpace){
          const colonIndex = tagName.indexOf(":");
          if(colonIndex !== -1){
            tagName = tagName.substr(colonIndex+1);
          }
        }

        //save text to parent node
        if (currentNode && textData) {
          if(currentNode.tagname !== '!xml'){
            currentNode.val = util.getValue(currentNode.val) + '' + processTagValue( currentNode.tagname, textData, options);
          }
        }

        if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){//selfClosing tag

          if(tagName[tagName.length - 1] === "/"){ //remove trailing '/'
            tagName = tagName.substr(0, tagName.length - 1);
            tagExp = tagName;
          }else {
            tagExp = tagExp.substr(0, tagExp.length - 1);
          }

          const childNode = new xmlNode(tagName, currentNode, '');
          if(tagName !== tagExp){
            childNode.attrsMap = buildAttributesMap(tagExp, options);
          }
          currentNode.addChild(childNode);
        }else {//opening tag

          const childNode = new xmlNode( tagName, currentNode );
          if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
            childNode.startIndex=closeIndex;
          }
          if(tagName !== tagExp){
            childNode.attrsMap = buildAttributesMap(tagExp, options);
          }
          currentNode.addChild(childNode);
          currentNode = childNode;
        }
        textData = "";
        i = closeIndex;
      }
    }else {
      textData += xmlData[i];
    }
  }
  return xmlObj;
};

function closingIndexForOpeningTag(data, i){
  let attrBoundary;
  let tagExp = "";
  for (let index = i; index < data.length; index++) {
    let ch = data[index];
    if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";//reset
    } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
    } else if (ch === '>') {
        return {
          data: tagExp,
          index: index
        }
    } else if (ch === '\t') {
      ch = " ";
    }
    tagExp += ch;
  }
}

function findClosingIndex(xmlData, str, i, errMsg){
  const closingIndex = xmlData.indexOf(str, i);
  if(closingIndex === -1){
    throw new Error(errMsg)
  }else {
    return closingIndex + str.length - 1;
  }
}

var getTraversalObj_1 = getTraversalObj;

var xmlstr2xmlnode = {
	defaultOptions: defaultOptions_1,
	props: props_1,
	getTraversalObj: getTraversalObj_1
};

const defaultOptions$1 = {
  allowBooleanAttributes: false, //A tag can have attributes without any value
};

const props$1 = ['allowBooleanAttributes'];

//const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
var validate = function (xmlData, options) {
  options = util.buildOptions(options, defaultOptions$1, props$1);

  //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE
  const tags = [];
  let tagFound = false;

  //indicates that the root tag has been closed (aka. depth 0 has been reached)
  let reachedRoot = false;

  if (xmlData[0] === '\ufeff') {
    // check for byte order mark (BOM)
    xmlData = xmlData.substr(1);
  }

  for (let i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === '<') {
      //starting of tag
      //read until you reach to '>' avoiding any '>' in attribute value

      i++;
      if (xmlData[i] === '?') {
        i = readPI(xmlData, ++i);
        if (i.err) {
          return i;
        }
      } else if (xmlData[i] === '!') {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i] === '/') {
          //closing tag
          closingTag = true;
          i++;
        }
        //read tagname
        let tagName = '';
        for (; i < xmlData.length &&
          xmlData[i] !== '>' &&
          xmlData[i] !== ' ' &&
          xmlData[i] !== '\t' &&
          xmlData[i] !== '\n' &&
          xmlData[i] !== '\r'; i++
        ) {
          tagName += xmlData[i];
        }
        tagName = tagName.trim();
        //console.log(tagName);

        if (tagName[tagName.length - 1] === '/') {
          //self closing tag without attributes
          tagName = tagName.substring(0, tagName.length - 1);
          //continue;
          i--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "There is an unnecessary space between tag name and backward slash '</ ..'.";
          } else {
            msg = "Tag '"+tagName+"' is an invalid name.";
          }
          return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
        }

        const result = readAttributeStr(xmlData, i);
        if (result === false) {
          return getErrorObject('InvalidAttr', "Attributes for '"+tagName+"' have open quote.", getLineNumberForPosition(xmlData, i));
        }
        let attrStr = result.value;
        i = result.index;

        if (attrStr[attrStr.length - 1] === '/') {
          //self closing tag
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
            //continue; //text may presents after self closing tag
          } else {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, i));
          } else {
            const otg = tags.pop();
            if (tagName !== otg) {
              return getErrorObject('InvalidTag', "Closing tag '"+otg+"' is expected inplace of '"+tagName+"'.", getLineNumberForPosition(xmlData, i));
            }

            //when there are no more tags, we reached the root level.
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }

          //if the root level has been reached before ...
          if (reachedRoot === true) {
            return getErrorObject('InvalidXml', 'Multiple possible root nodes found.', getLineNumberForPosition(xmlData, i));
          } else {
            tags.push(tagName);
          }
          tagFound = true;
        }

        //skip tag text value
        //It may include comments and CDATA value
        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === '<') {
            if (xmlData[i + 1] === '!') {
              //comment or CADATA
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else {
              break;
            }
          } else if (xmlData[i] === '&') {
            const afterAmp = validateAmpersand(xmlData, i);
            if (afterAmp == -1)
              return getErrorObject('InvalidChar', "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
            i = afterAmp;
          }
        } //end of reading tag text value
        if (xmlData[i] === '<') {
          i--;
        }
      }
    } else {
      if (xmlData[i] === ' ' || xmlData[i] === '\t' || xmlData[i] === '\n' || xmlData[i] === '\r') {
        continue;
      }
      return getErrorObject('InvalidChar', "char '"+xmlData[i]+"' is not expected.", getLineNumberForPosition(xmlData, i));
    }
  }

  if (!tagFound) {
    return getErrorObject('InvalidXml', 'Start tag expected.', 1);
  } else if (tags.length > 0) {
    return getErrorObject('InvalidXml', "Invalid '"+JSON.stringify(tags, null, 4).replace(/\r?\n/g, '')+"' found.", 1);
  }

  return true;
};

/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */
function readPI(xmlData, i) {
  var start = i;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] == '?' || xmlData[i] == ' ') {
      //tagname
      var tagname = xmlData.substr(start, i - start);
      if (i > 5 && tagname === 'xml') {
        return getErrorObject('InvalidXml', 'XML declaration allowed only at the start of the document.', getLineNumberForPosition(xmlData, i));
      } else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
        //check if valid attribut string
        i++;
        break;
      } else {
        continue;
      }
    }
  }
  return i;
}

function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
    //comment
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  } else if (
    xmlData.length > i + 8 &&
    xmlData[i + 1] === 'D' &&
    xmlData[i + 2] === 'O' &&
    xmlData[i + 3] === 'C' &&
    xmlData[i + 4] === 'T' &&
    xmlData[i + 5] === 'Y' &&
    xmlData[i + 6] === 'P' &&
    xmlData[i + 7] === 'E'
  ) {
    let angleBracketsCount = 1;
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === '<') {
        angleBracketsCount++;
      } else if (xmlData[i] === '>') {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (
    xmlData.length > i + 9 &&
    xmlData[i + 1] === '[' &&
    xmlData[i + 2] === 'C' &&
    xmlData[i + 3] === 'D' &&
    xmlData[i + 4] === 'A' &&
    xmlData[i + 5] === 'T' &&
    xmlData[i + 6] === 'A' &&
    xmlData[i + 7] === '['
  ) {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  }

  return i;
}

var doubleQuote = '"';
var singleQuote = "'";

/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */
function readAttributeStr(xmlData, i) {
  let attrStr = '';
  let startChar = '';
  let tagClosed = false;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === '') {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
        //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
        continue;
      } else {
        startChar = '';
      }
    } else if (xmlData[i] === '>') {
      if (startChar === '') {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i];
  }
  if (startChar !== '') {
    return false;
  }

  return {
    value: attrStr,
    index: i,
    tagClosed: tagClosed
  };
}

/**
 * Select all the attributes whether valid or invalid.
 */
const validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr, options) {
  //console.log("start:"+attrStr+":end");

  //if(attrStr.trim().length === 0) return true; //empty string

  const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};

  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].length === 0) {
      //nospace before attribute name: a="sd"b="saf"
      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' has no space in starting.", getPositionFromMatch(attrStr, matches[i][0]))
    } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
      //independent attribute: ab
      return getErrorObject('InvalidAttr', "boolean attribute '"+matches[i][2]+"' is not allowed.", getPositionFromMatch(attrStr, matches[i][0]));
    }
    /* else if(matches[i][6] === undefined){//attribute without value: ab=
                    return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
                } */
    const attrName = matches[i][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is an invalid name.", getPositionFromMatch(attrStr, matches[i][0]));
    }
    if (!attrNames.hasOwnProperty(attrName)) {
      //check for duplicate attribute.
      attrNames[attrName] = 1;
    } else {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is repeated.", getPositionFromMatch(attrStr, matches[i][0]));
    }
  }

  return true;
}

function validateNumberAmpersand(xmlData, i) {
  let re = /\d/;
  if (xmlData[i] === 'x') {
    i++;
    re = /[\da-fA-F]/;
  }
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === ';')
      return i;
    if (!xmlData[i].match(re))
      break;
  }
  return -1;
}

function validateAmpersand(xmlData, i) {
  // https://www.w3.org/TR/xml/#dt-charref
  i++;
  if (xmlData[i] === ';')
    return -1;
  if (xmlData[i] === '#') {
    i++;
    return validateNumberAmpersand(xmlData, i);
  }
  let count = 0;
  for (; i < xmlData.length; i++, count++) {
    if (xmlData[i].match(/\w/) && count < 20)
      continue;
    if (xmlData[i] === ';')
      break;
    return -1;
  }
  return i;
}

function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code: code,
      msg: message,
      line: lineNumber,
    },
  };
}

function validateAttrName(attrName) {
  return util.isName(attrName);
}

// const startsWithXML = /^xml/i;

function validateTagName(tagname) {
  return util.isName(tagname) /* && !tagname.match(startsWithXML) */;
}

//this function returns the line number for the character at the given index
function getLineNumberForPosition(xmlData, index) {
  var lines = xmlData.substring(0, index).split(/\r?\n/);
  return lines.length;
}

//this function returns the position of the last character of match within attrStr
function getPositionFromMatch(attrStr, match) {
  return attrStr.indexOf(match) + match.length;
}

var validator = {
	validate: validate
};

const char = function(a) {
  return String.fromCharCode(a);
};

const chars = {
  nilChar: char(176),
  missingChar: char(201),
  nilPremitive: char(175),
  missingPremitive: char(200),

  emptyChar: char(178),
  emptyValue: char(177), //empty Premitive

  boundryChar: char(179),

  objStart: char(198),
  arrStart: char(204),
  arrayEnd: char(185),
};

const charsArr = [
  chars.nilChar,
  chars.nilPremitive,
  chars.missingChar,
  chars.missingPremitive,
  chars.boundryChar,
  chars.emptyChar,
  chars.emptyValue,
  chars.arrayEnd,
  chars.objStart,
  chars.arrStart,
];

const _e = function(node, e_schema, options) {
  if (typeof e_schema === 'string') {
    //premitive
    if (node && node[0] && node[0].val !== undefined) {
      return getValue(node[0].val);
    } else {
      return getValue(node);
    }
  } else {
    const hasValidData = hasData(node);
    if (hasValidData === true) {
      let str = '';
      if (Array.isArray(e_schema)) {
        //attributes can't be repeated. hence check in children tags only
        str += chars.arrStart;
        const itemSchema = e_schema[0];
        //var itemSchemaType = itemSchema;
        const arr_len = node.length;

        if (typeof itemSchema === 'string') {
          for (let arr_i = 0; arr_i < arr_len; arr_i++) {
            const r = getValue(node[arr_i].val);
            str = processValue(str, r);
          }
        } else {
          for (let arr_i = 0; arr_i < arr_len; arr_i++) {
            const r = _e(node[arr_i], itemSchema, options);
            str = processValue(str, r);
          }
        }
        str += chars.arrayEnd; //indicates that next item is not array item
      } else {
        //object
        str += chars.objStart;
        const keys = Object.keys(e_schema);
        if (Array.isArray(node)) {
          node = node[0];
        }
        for (let i in keys) {
          const key = keys[i];
          //a property defined in schema can be present either in attrsMap or children tags
          //options.textNodeName will not present in both maps, take it's value from val
          //options.attrNodeName will be present in attrsMap
          let r;
          if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
            r = _e(node.attrsMap[key], e_schema[key], options);
          } else if (key === options.textNodeName) {
            r = _e(node.val, e_schema[key], options);
          } else {
            r = _e(node.child[key], e_schema[key], options);
          }
          str = processValue(str, r);
        }
      }
      return str;
    } else {
      return hasValidData;
    }
  }
};

const getValue = function(a /*, type*/) {
  switch (a) {
    case undefined:
      return chars.missingPremitive;
    case null:
      return chars.nilPremitive;
    case '':
      return chars.emptyValue;
    default:
      return a;
  }
};

const processValue = function(str, r) {
  if (!isAppChar(r[0]) && !isAppChar(str[str.length - 1])) {
    str += chars.boundryChar;
  }
  return str + r;
};

const isAppChar = function(ch) {
  return charsArr.indexOf(ch) !== -1;
};

function hasData(jObj) {
  if (jObj === undefined) {
    return chars.missingChar;
  } else if (jObj === null) {
    return chars.nilChar;
  } else if (
    jObj.child &&
    Object.keys(jObj.child).length === 0 &&
    (!jObj.attrsMap || Object.keys(jObj.attrsMap).length === 0)
  ) {
    return chars.emptyChar;
  } else {
    return true;
  }
}


const buildOptions$2 = util.buildOptions;

const convert2nimn = function(node, e_schema, options) {
  options = buildOptions$2(options, xmlstr2xmlnode.defaultOptions, xmlstr2xmlnode.props);
  return _e(node, e_schema, options);
};

var convert2nimn_1 = convert2nimn;

var nimndata = {
	convert2nimn: convert2nimn_1
};

const buildOptions$1 = util.buildOptions;


//TODO: do it later
const convertToJsonString = function(node, options) {
  options = buildOptions$1(options, xmlstr2xmlnode.defaultOptions, xmlstr2xmlnode.props);

  options.indentBy = options.indentBy || '';
  return _cToJsonStr(node, options);
};

const _cToJsonStr = function(node, options, level) {
  let jObj = '{';

  //traver through all the children
  const keys = Object.keys(node.child);

  for (let index = 0; index < keys.length; index++) {
    var tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj += '"' + tagname + '" : [ ';
      for (var tag in node.child[tagname]) {
        jObj += _cToJsonStr(node.child[tagname][tag], options) + ' , ';
      }
      jObj = jObj.substr(0, jObj.length - 1) + ' ] '; //remove extra comma in last
    } else {
      jObj += '"' + tagname + '" : ' + _cToJsonStr(node.child[tagname][0], options) + ' ,';
    }
  }
  util.merge(jObj, node.attrsMap);
  //add attrsMap as new children
  if (util.isEmptyObject(jObj)) {
    return util.isExist(node.val) ? node.val : '';
  } else {
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        jObj += '"' + options.textNodeName + '" : ' + stringval(node.val);
      }
    }
  }
  //add value
  if (jObj[jObj.length - 1] === ',') {
    jObj = jObj.substr(0, jObj.length - 2);
  }
  return jObj + '}';
};

function stringval(v) {
  if (v === true || v === false || !isNaN(v)) {
    return v;
  } else {
    return '"' + v + '"';
  }
}

var convertToJsonString_1 = convertToJsonString;

var node2json_str = {
	convertToJsonString: convertToJsonString_1
};

//parse Empty Node as self closing node
const buildOptions = util.buildOptions;

const defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  cdataTagName: false,
  cdataPositionChar: '\\c',
  format: false,
  indentBy: '  ',
  supressEmptyNode: false,
  tagValueProcessor: function(a) {
    return a;
  },
  attrValueProcessor: function(a) {
    return a;
  },
};

const props = [
  'attributeNamePrefix',
  'attrNodeName',
  'textNodeName',
  'ignoreAttributes',
  'cdataTagName',
  'cdataPositionChar',
  'format',
  'indentBy',
  'supressEmptyNode',
  'tagValueProcessor',
  'attrValueProcessor',
];

function Parser(options) {
  this.options = buildOptions(options, defaultOptions, props);
  if (this.options.ignoreAttributes || this.options.attrNodeName) {
    this.isAttribute = function(/*a*/) {
      return false;
    };
  } else {
    this.attrPrefixLen = this.options.attributeNamePrefix.length;
    this.isAttribute = isAttribute;
  }
  if (this.options.cdataTagName) {
    this.isCDATA = isCDATA;
  } else {
    this.isCDATA = function(/*a*/) {
      return false;
    };
  }
  this.replaceCDATAstr = replaceCDATAstr;
  this.replaceCDATAarr = replaceCDATAarr;

  if (this.options.format) {
    this.indentate = indentate;
    this.tagEndChar = '>\n';
    this.newLine = '\n';
  } else {
    this.indentate = function() {
      return '';
    };
    this.tagEndChar = '>';
    this.newLine = '';
  }

  if (this.options.supressEmptyNode) {
    this.buildTextNode = buildEmptyTextNode;
    this.buildObjNode = buildEmptyObjNode;
  } else {
    this.buildTextNode = buildTextValNode;
    this.buildObjNode = buildObjectNode;
  }

  this.buildTextValNode = buildTextValNode;
  this.buildObjectNode = buildObjectNode;
}

Parser.prototype.parse = function(jObj) {
  return this.j2x(jObj, 0).val;
};

Parser.prototype.j2x = function(jObj, level) {
  let attrStr = '';
  let val = '';
  const keys = Object.keys(jObj);
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    if (typeof jObj[key] === 'undefined') ; else if (jObj[key] === null) {
      val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
    } else if (jObj[key] instanceof Date) {
      val += this.buildTextNode(jObj[key], key, '', level);
    } else if (typeof jObj[key] !== 'object') {
      //premitive type
      const attr = this.isAttribute(key);
      if (attr) {
        attrStr += ' ' + attr + '="' + this.options.attrValueProcessor('' + jObj[key]) + '"';
      } else if (this.isCDATA(key)) {
        if (jObj[this.options.textNodeName]) {
          val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
        } else {
          val += this.replaceCDATAstr('', jObj[key]);
        }
      } else {
        //tag value
        if (key === this.options.textNodeName) {
          if (jObj[this.options.cdataTagName]) ; else {
            val += this.options.tagValueProcessor('' + jObj[key]);
          }
        } else {
          val += this.buildTextNode(jObj[key], key, '', level);
        }
      }
    } else if (Array.isArray(jObj[key])) {
      //repeated nodes
      if (this.isCDATA(key)) {
        val += this.indentate(level);
        if (jObj[this.options.textNodeName]) {
          val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
        } else {
          val += this.replaceCDATAarr('', jObj[key]);
        }
      } else {
        //nested nodes
        const arrLen = jObj[key].length;
        for (let j = 0; j < arrLen; j++) {
          const item = jObj[key][j];
          if (typeof item === 'undefined') ; else if (item === null) {
            val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
          } else if (typeof item === 'object') {
            const result = this.j2x(item, level + 1);
            val += this.buildObjNode(result.val, key, result.attrStr, level);
          } else {
            val += this.buildTextNode(item, key, '', level);
          }
        }
      }
    } else {
      //nested node
      if (this.options.attrNodeName && key === this.options.attrNodeName) {
        const Ks = Object.keys(jObj[key]);
        const L = Ks.length;
        for (let j = 0; j < L; j++) {
          attrStr += ' ' + Ks[j] + '="' + this.options.attrValueProcessor('' + jObj[key][Ks[j]]) + '"';
        }
      } else {
        const result = this.j2x(jObj[key], level + 1);
        val += this.buildObjNode(result.val, key, result.attrStr, level);
      }
    }
  }
  return {attrStr: attrStr, val: val};
};

function replaceCDATAstr(str, cdata) {
  str = this.options.tagValueProcessor('' + str);
  if (this.options.cdataPositionChar === '' || str === '') {
    return str + '<![CDATA[' + cdata + ']]' + this.tagEndChar;
  } else {
    return str.replace(this.options.cdataPositionChar, '<![CDATA[' + cdata + ']]' + this.tagEndChar);
  }
}

function replaceCDATAarr(str, cdata) {
  str = this.options.tagValueProcessor('' + str);
  if (this.options.cdataPositionChar === '' || str === '') {
    return str + '<![CDATA[' + cdata.join(']]><![CDATA[') + ']]' + this.tagEndChar;
  } else {
    for (let v in cdata) {
      str = str.replace(this.options.cdataPositionChar, '<![CDATA[' + cdata[v] + ']]>');
    }
    return str + this.newLine;
  }
}

function buildObjectNode(val, key, attrStr, level) {
  if (attrStr && !val.includes('<')) {
    return (
      this.indentate(level) +
      '<' +
      key +
      attrStr +
      '>' +
      val +
      //+ this.newLine
      // + this.indentate(level)
      '</' +
      key +
      this.tagEndChar
    );
  } else {
    return (
      this.indentate(level) +
      '<' +
      key +
      attrStr +
      this.tagEndChar +
      val +
      //+ this.newLine
      this.indentate(level) +
      '</' +
      key +
      this.tagEndChar
    );
  }
}

function buildEmptyObjNode(val, key, attrStr, level) {
  if (val !== '') {
    return this.buildObjectNode(val, key, attrStr, level);
  } else {
    return this.indentate(level) + '<' + key + attrStr + '/' + this.tagEndChar;
    //+ this.newLine
  }
}

function buildTextValNode(val, key, attrStr, level) {
  return (
    this.indentate(level) +
    '<' +
    key +
    attrStr +
    '>' +
    this.options.tagValueProcessor(val) +
    '</' +
    key +
    this.tagEndChar
  );
}

function buildEmptyTextNode(val, key, attrStr, level) {
  if (val !== '') {
    return this.buildTextValNode(val, key, attrStr, level);
  } else {
    return this.indentate(level) + '<' + key + attrStr + '/' + this.tagEndChar;
  }
}

function indentate(level) {
  return this.options.indentBy.repeat(level);
}

function isAttribute(name /*, options*/) {
  if (name.startsWith(this.options.attributeNamePrefix)) {
    return name.substr(this.attrPrefixLen);
  } else {
    return false;
  }
}

function isCDATA(name) {
  return name === this.options.cdataTagName;
}

//formatting
//indentation
//\n after each closing or self closing tag

var json2xml = Parser;

var parser = imageHandler.createCommonjsModule(function (module, exports) {



const x2xmlnode = xmlstr2xmlnode;
const buildOptions = util.buildOptions;


exports.parse = function(xmlData, options, validationOption) {
  if( validationOption){
    if(validationOption === true) validationOption = {};
    
    const result = validator.validate(xmlData, validationOption);
    if (result !== true) {
      throw Error( result.err.msg)
    }
  }
  options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
  const traversableObj = xmlstr2xmlnode.getTraversalObj(xmlData, options);
  //print(traversableObj, "  ");
  return node2json.convertToJson(traversableObj, options);
};
exports.convertTonimn = nimndata.convert2nimn;
exports.getTraversalObj = xmlstr2xmlnode.getTraversalObj;
exports.convertToJson = node2json.convertToJson;
exports.convertToJsonString = node2json_str.convertToJsonString;
exports.validate = validator.validate;
exports.j2xParser = json2xml;
exports.parseToNimn = function(xmlData, schema, options) {
  return exports.convertTonimn(exports.getTraversalObj(xmlData, options), schema, options);
};
});

const serializeAws_restXmlGetObjectCommand = async (input, context) => {
    const headers = {
        "Content-Type": "",
        ...(isSerializableHeaderValue(input.SSECustomerKey) && {
            "x-amz-server-side-encryption-customer-key": input.SSECustomerKey,
        }),
        ...(isSerializableHeaderValue(input.SSECustomerAlgorithm) && {
            "x-amz-server-side-encryption-customer-algorithm": input.SSECustomerAlgorithm,
        }),
        ...(isSerializableHeaderValue(input.SSECustomerKeyMD5) && {
            "x-amz-server-side-encryption-customer-key-MD5": input.SSECustomerKeyMD5,
        }),
        ...(isSerializableHeaderValue(input.RequestPayer) && { "x-amz-request-payer": input.RequestPayer }),
        ...(isSerializableHeaderValue(input.ExpectedBucketOwner) && {
            "x-amz-expected-bucket-owner": input.ExpectedBucketOwner,
        }),
        ...(isSerializableHeaderValue(input.IfUnmodifiedSince) && {
            "If-Unmodified-Since": dateToUtcString(input.IfUnmodifiedSince).toString(),
        }),
        ...(isSerializableHeaderValue(input.IfModifiedSince) && {
            "If-Modified-Since": dateToUtcString(input.IfModifiedSince).toString(),
        }),
        ...(isSerializableHeaderValue(input.IfNoneMatch) && { "If-None-Match": input.IfNoneMatch }),
        ...(isSerializableHeaderValue(input.IfMatch) && { "If-Match": input.IfMatch }),
        ...(isSerializableHeaderValue(input.Range) && { Range: input.Range }),
    };
    let resolvedPath = "/{Bucket}/{Key+}";
    if (input.Bucket !== undefined) {
        const labelValue = input.Bucket;
        if (labelValue.length <= 0) {
            throw new Error("Empty value provided for input HTTP label: Bucket.");
        }
        resolvedPath = resolvedPath.replace("{Bucket}", extendedEncodeURIComponent(labelValue));
    }
    else {
        throw new Error("No value provided for input HTTP label: Bucket.");
    }
    if (input.Key !== undefined) {
        const labelValue = input.Key;
        if (labelValue.length <= 0) {
            throw new Error("Empty value provided for input HTTP label: Key.");
        }
        resolvedPath = resolvedPath.replace("{Key+}", labelValue
            .split("/")
            .map((segment) => extendedEncodeURIComponent(segment))
            .join("/"));
    }
    else {
        throw new Error("No value provided for input HTTP label: Key.");
    }
    const query = {
        "x-id": "GetObject",
        ...(input.ResponseContentEncoding !== undefined && { "response-content-encoding": input.ResponseContentEncoding }),
        ...(input.ResponseCacheControl !== undefined && { "response-cache-control": input.ResponseCacheControl }),
        ...(input.ResponseContentLanguage !== undefined && { "response-content-language": input.ResponseContentLanguage }),
        ...(input.ResponseContentDisposition !== undefined && {
            "response-content-disposition": input.ResponseContentDisposition,
        }),
        ...(input.PartNumber !== undefined && { partNumber: input.PartNumber.toString() }),
        ...(input.VersionId !== undefined && { versionId: input.VersionId }),
        ...(input.ResponseExpires !== undefined && {
            "response-expires": (input.ResponseExpires.toISOString().split(".")[0] + "Z").toString(),
        }),
        ...(input.ResponseContentType !== undefined && { "response-content-type": input.ResponseContentType }),
    };
    let body;
    const { hostname, protocol = "https", port } = await context.endpoint();
    return new httpRequest.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
const deserializeAws_restXmlGetObjectCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restXmlGetObjectCommandError(output, context);
    }
    const contents = {
        $metadata: deserializeMetadata(output),
        AcceptRanges: undefined,
        Body: undefined,
        CacheControl: undefined,
        ContentDisposition: undefined,
        ContentEncoding: undefined,
        ContentLanguage: undefined,
        ContentLength: undefined,
        ContentRange: undefined,
        ContentType: undefined,
        DeleteMarker: undefined,
        ETag: undefined,
        Expiration: undefined,
        Expires: undefined,
        LastModified: undefined,
        Metadata: undefined,
        MissingMeta: undefined,
        ObjectLockLegalHoldStatus: undefined,
        ObjectLockMode: undefined,
        ObjectLockRetainUntilDate: undefined,
        PartsCount: undefined,
        ReplicationStatus: undefined,
        RequestCharged: undefined,
        Restore: undefined,
        SSECustomerAlgorithm: undefined,
        SSECustomerKeyMD5: undefined,
        SSEKMSKeyId: undefined,
        ServerSideEncryption: undefined,
        StorageClass: undefined,
        TagCount: undefined,
        VersionId: undefined,
        WebsiteRedirectLocation: undefined,
    };
    if (output.headers["x-amz-object-lock-mode"] !== undefined) {
        contents.ObjectLockMode = output.headers["x-amz-object-lock-mode"];
    }
    if (output.headers["content-language"] !== undefined) {
        contents.ContentLanguage = output.headers["content-language"];
    }
    if (output.headers["content-disposition"] !== undefined) {
        contents.ContentDisposition = output.headers["content-disposition"];
    }
    if (output.headers["cache-control"] !== undefined) {
        contents.CacheControl = output.headers["cache-control"];
    }
    if (output.headers["content-type"] !== undefined) {
        contents.ContentType = output.headers["content-type"];
    }
    if (output.headers["content-range"] !== undefined) {
        contents.ContentRange = output.headers["content-range"];
    }
    if (output.headers["x-amz-server-side-encryption-aws-kms-key-id"] !== undefined) {
        contents.SSEKMSKeyId = output.headers["x-amz-server-side-encryption-aws-kms-key-id"];
    }
    if (output.headers["content-length"] !== undefined) {
        contents.ContentLength = parseInt(output.headers["content-length"], 10);
    }
    if (output.headers["x-amz-object-lock-retain-until-date"] !== undefined) {
        contents.ObjectLockRetainUntilDate = new Date(output.headers["x-amz-object-lock-retain-until-date"]);
    }
    if (output.headers["x-amz-object-lock-legal-hold"] !== undefined) {
        contents.ObjectLockLegalHoldStatus = output.headers["x-amz-object-lock-legal-hold"];
    }
    if (output.headers["x-amz-delete-marker"] !== undefined) {
        contents.DeleteMarker = output.headers["x-amz-delete-marker"] === "true";
    }
    if (output.headers["x-amz-storage-class"] !== undefined) {
        contents.StorageClass = output.headers["x-amz-storage-class"];
    }
    if (output.headers["content-encoding"] !== undefined) {
        contents.ContentEncoding = output.headers["content-encoding"];
    }
    if (output.headers["x-amz-restore"] !== undefined) {
        contents.Restore = output.headers["x-amz-restore"];
    }
    if (output.headers["x-amz-website-redirect-location"] !== undefined) {
        contents.WebsiteRedirectLocation = output.headers["x-amz-website-redirect-location"];
    }
    if (output.headers["x-amz-server-side-encryption"] !== undefined) {
        contents.ServerSideEncryption = output.headers["x-amz-server-side-encryption"];
    }
    if (output.headers["x-amz-mp-parts-count"] !== undefined) {
        contents.PartsCount = parseInt(output.headers["x-amz-mp-parts-count"], 10);
    }
    if (output.headers["x-amz-server-side-encryption-customer-algorithm"] !== undefined) {
        contents.SSECustomerAlgorithm = output.headers["x-amz-server-side-encryption-customer-algorithm"];
    }
    if (output.headers["accept-ranges"] !== undefined) {
        contents.AcceptRanges = output.headers["accept-ranges"];
    }
    if (output.headers["x-amz-version-id"] !== undefined) {
        contents.VersionId = output.headers["x-amz-version-id"];
    }
    if (output.headers["expires"] !== undefined) {
        contents.Expires = new Date(output.headers["expires"]);
    }
    if (output.headers["x-amz-expiration"] !== undefined) {
        contents.Expiration = output.headers["x-amz-expiration"];
    }
    if (output.headers["x-amz-missing-meta"] !== undefined) {
        contents.MissingMeta = parseInt(output.headers["x-amz-missing-meta"], 10);
    }
    if (output.headers["x-amz-replication-status"] !== undefined) {
        contents.ReplicationStatus = output.headers["x-amz-replication-status"];
    }
    if (output.headers["x-amz-tagging-count"] !== undefined) {
        contents.TagCount = parseInt(output.headers["x-amz-tagging-count"], 10);
    }
    if (output.headers["x-amz-server-side-encryption-customer-key-md5"] !== undefined) {
        contents.SSECustomerKeyMD5 = output.headers["x-amz-server-side-encryption-customer-key-md5"];
    }
    if (output.headers["last-modified"] !== undefined) {
        contents.LastModified = new Date(output.headers["last-modified"]);
    }
    if (output.headers["etag"] !== undefined) {
        contents.ETag = output.headers["etag"];
    }
    if (output.headers["x-amz-request-charged"] !== undefined) {
        contents.RequestCharged = output.headers["x-amz-request-charged"];
    }
    Object.keys(output.headers).forEach((header) => {
        if (contents.Metadata === undefined) {
            contents.Metadata = {};
        }
        if (header.startsWith("x-amz-meta-")) {
            contents.Metadata[header.substring(11)] = output.headers[header];
        }
    });
    const data = output.body;
    contents.Body = data;
    return Promise.resolve(contents);
};
const deserializeAws_restXmlGetObjectCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "NoSuchKey":
        case "com.amazonaws.s3#NoSuchKey":
            response = {
                ...(await deserializeAws_restXmlNoSuchKeyResponse(parsedOutput)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_restXmlNoSuchKeyResponse = async (parsedOutput, context) => {
    const contents = {
        name: "NoSuchKey",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
    };
    parsedOutput.body;
    return contents;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    httpHeaders: output.headers,
    requestId: output.headers["x-amzn-requestid"],
});
// Collect low-level response body stream to Uint8Array.
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
// Encode Uint8Array data into string with utf-8.
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const isSerializableHeaderValue = (value) => value !== undefined &&
    value !== "" &&
    (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) &&
    (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
const decodeEscapedXML = (str) => str
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<");
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        const parsedObj = parser.parse(encoded, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseNodeValue: false,
            tagValueProcessor: (val, tagName) => decodeEscapedXML(val),
        });
        const textNodeName = "#text";
        const key = Object.keys(parsedObj)[0];
        const parsedObjToReturn = parsedObj[key];
        if (parsedObjToReturn[textNodeName]) {
            parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
            delete parsedObjToReturn[textNodeName];
        }
        return getValueFromTextNode(parsedObjToReturn);
    }
    return {};
});
const loadRestXmlErrorCode = (output, data) => {
    if (data.Code !== undefined) {
        return data.Code;
    }
    if (output.statusCode == 404) {
        return "NotFound";
    }
    return "";
};

var deserializerMiddleware = function (options, deserializer) { return function (next, context) { return function (args) { return httpRequest.__awaiter(void 0, void 0, void 0, function () {
    var logger, outputFilterSensitiveLog, response, parsed, outputWithoutMetadata;
    return httpRequest.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = context.logger, outputFilterSensitiveLog = context.outputFilterSensitiveLog;
                return [4 /*yield*/, next(args)];
            case 1:
                response = (_a.sent()).response;
                if (typeof (logger === null || logger === void 0 ? void 0 : logger.debug) === "function") {
                    logger.debug({
                        httpResponse: response,
                    });
                }
                return [4 /*yield*/, deserializer(response, options)];
            case 2:
                parsed = _a.sent();
                parsed.$metadata, outputWithoutMetadata = httpRequest.__rest(parsed, ["$metadata"]);
                if (typeof (logger === null || logger === void 0 ? void 0 : logger.info) === "function") {
                    logger.info({
                        output: outputFilterSensitiveLog(outputWithoutMetadata),
                    });
                }
                return [2 /*return*/, {
                        response: response,
                        output: parsed,
                    }];
        }
    });
}); }; }; };

var serializerMiddleware = function (options, serializer) { return function (next, context) { return function (args) { return httpRequest.__awaiter(void 0, void 0, void 0, function () {
    var logger, inputFilterSensitiveLog, request;
    return httpRequest.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = context.logger, inputFilterSensitiveLog = context.inputFilterSensitiveLog;
                if (typeof (logger === null || logger === void 0 ? void 0 : logger.info) === "function") {
                    logger.info({
                        input: inputFilterSensitiveLog(args.input),
                    });
                }
                return [4 /*yield*/, serializer(args.input, options)];
            case 1:
                request = _a.sent();
                if (typeof (logger === null || logger === void 0 ? void 0 : logger.debug) === "function") {
                    logger.debug({
                        httpRequest: request,
                    });
                }
                return [2 /*return*/, next(httpRequest.__assign(httpRequest.__assign({}, args), { request: request }))];
        }
    });
}); }; }; };

var deserializerMiddlewareOption = {
    name: "deserializerMiddleware",
    step: "deserialize",
    tags: ["DESERIALIZER"],
};
var serializerMiddlewareOption = {
    name: "serializerMiddleware",
    step: "serialize",
    tags: ["SERIALIZER"],
};
function getSerdePlugin(config, serializer, deserializer) {
    return {
        applyToStack: function (commandStack) {
            commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
            commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
        },
    };
}

function ssecMiddleware(options) {
    var _this = this;
    return function (next) { return function (args) { return httpRequest.__awaiter(_this, void 0, void 0, function () {
        var input, properties, properties_1, properties_1_1, prop, value, valueView, encoded, hash, _a, _b, _c, _d, e_1_1;
        var e_1, _e, _f;
        return httpRequest.__generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    input = httpRequest.__assign({}, args.input);
                    properties = [
                        {
                            target: "SSECustomerKey",
                            hash: "SSECustomerKeyMD5",
                        },
                        {
                            target: "CopySourceSSECustomerKey",
                            hash: "CopySourceSSECustomerKeyMD5",
                        },
                    ];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 6, 7, 8]);
                    properties_1 = httpRequest.__values(properties), properties_1_1 = properties_1.next();
                    _g.label = 2;
                case 2:
                    if (!!properties_1_1.done) return [3 /*break*/, 5];
                    prop = properties_1_1.value;
                    value = input[prop.target];
                    if (!value) return [3 /*break*/, 4];
                    valueView = ArrayBuffer.isView(value)
                        ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
                        : typeof value === "string"
                            ? options.utf8Decoder(value)
                            : new Uint8Array(value);
                    encoded = options.base64Encoder(valueView);
                    hash = new options.md5();
                    hash.update(valueView);
                    _a = [httpRequest.__assign({}, input)];
                    _f = {}, _f[prop.target] = encoded;
                    _b = prop.hash;
                    _d = (_c = options).base64Encoder;
                    return [4 /*yield*/, hash.digest()];
                case 3:
                    input = httpRequest.__assign.apply(void 0, _a.concat([(_f[_b] = _d.apply(_c, [_g.sent()]), _f)]));
                    _g.label = 4;
                case 4:
                    properties_1_1 = properties_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (properties_1_1 && !properties_1_1.done && (_e = properties_1.return)) _e.call(properties_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, next(httpRequest.__assign(httpRequest.__assign({}, args), { input: input }))];
            }
        });
    }); }; };
}
var ssecMiddlewareOptions = {
    name: "ssecMiddleware",
    step: "initialize",
    tags: ["SSE"],
};
var getSsecPlugin = function (config) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(ssecMiddleware(config), ssecMiddlewareOptions);
    },
}); };

class GetObjectCommand extends Command {
    // Start section: command_properties
    // End section: command_properties
    constructor(input) {
        // Start section: command_constructor
        super();
        this.input = input;
        // End section: command_constructor
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(getSsecPlugin(configuration));
        this.middlewareStack.use(getBucketEndpointPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const handlerExecutionContext = {
            logger,
            clientName: "S3Client",
            commandName: "GetObjectCommand",
            inputFilterSensitiveLog: GetObjectRequest.filterSensitiveLog,
            outputFilterSensitiveLog: GetObjectOutput.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return serializeAws_restXmlGetObjectCommand(input, context);
    }
    deserialize(output, context) {
        return deserializeAws_restXmlGetObjectCommand(output, context);
    }
}

exports.GetObjectCommand = GetObjectCommand;
