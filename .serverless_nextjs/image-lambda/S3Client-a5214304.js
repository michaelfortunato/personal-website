'use strict';

var httpRequest$1 = require('./httpRequest-79d7914f.js');
var Url = require('url');
var buffer = require('buffer');
var http = require('http');
var fs = require('fs');
var os = require('os');
var require$$1 = require('path');
var child_process = require('child_process');
var imageHandler = require('./image-handler-1f543192.js');
var Stream = require('stream');
var crypto = require('crypto');
var configurations = require('./configurations-53dc2b78.js');
var https = require('https');
require('http2');
var process$1 = require('process');
var lazyJson = require('./lazy-json-37175b28.js');
require('./manifest.json');
require('./routes-manifest.json');
require('zlib');
require('events');
require('util');
require('tty');
require('net');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var process__default = /*#__PURE__*/_interopDefaultLegacy(process$1);

var name = "@aws-sdk/client-s3";
var description = "AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native";
var version = "1.0.0-rc.3";
var scripts = {
	clean: "npm run remove-definitions && npm run remove-dist",
	"build-documentation": "npm run clean && typedoc ./",
	prepublishOnly: "yarn build",
	pretest: "yarn build:cjs",
	"remove-definitions": "rimraf ./types",
	"remove-dist": "rimraf ./dist",
	"remove-documentation": "rimraf ./docs",
	"test:unit": "mocha **/cjs/**/*.spec.js",
	"test:e2e": "mocha **/cjs/**/*.ispec.js && karma start karma.conf.js",
	test: "yarn test:unit",
	"build:cjs": "tsc -p tsconfig.json",
	"build:es": "tsc -p tsconfig.es.json",
	build: "yarn build:cjs && yarn build:es"
};
var main = "./dist/cjs/index.js";
var types = "./types/index.d.ts";
var module$1 = "./dist/es/index.js";
var browser = {
	"./runtimeConfig": "./runtimeConfig.browser"
};
var sideEffects = false;
var dependencies = {
	"@aws-crypto/sha256-browser": "^1.0.0",
	"@aws-crypto/sha256-js": "^1.0.0",
	"@aws-sdk/config-resolver": "1.0.0-rc.3",
	"@aws-sdk/credential-provider-node": "1.0.0-rc.3",
	"@aws-sdk/eventstream-serde-browser": "1.0.0-rc.3",
	"@aws-sdk/eventstream-serde-config-resolver": "1.0.0-rc.3",
	"@aws-sdk/eventstream-serde-node": "1.0.0-rc.3",
	"@aws-sdk/fetch-http-handler": "1.0.0-rc.3",
	"@aws-sdk/hash-blob-browser": "1.0.0-rc.3",
	"@aws-sdk/hash-node": "1.0.0-rc.3",
	"@aws-sdk/hash-stream-node": "1.0.0-rc.3",
	"@aws-sdk/invalid-dependency": "1.0.0-rc.3",
	"@aws-sdk/md5-js": "1.0.0-rc.3",
	"@aws-sdk/middleware-apply-body-checksum": "1.0.0-rc.3",
	"@aws-sdk/middleware-bucket-endpoint": "1.0.0-rc.3",
	"@aws-sdk/middleware-content-length": "1.0.0-rc.3",
	"@aws-sdk/middleware-expect-continue": "1.0.0-rc.3",
	"@aws-sdk/middleware-host-header": "1.0.0-rc.3",
	"@aws-sdk/middleware-location-constraint": "1.0.0-rc.3",
	"@aws-sdk/middleware-logger": "1.0.0-rc.3",
	"@aws-sdk/middleware-retry": "1.0.0-rc.3",
	"@aws-sdk/middleware-sdk-s3": "1.0.0-rc.3",
	"@aws-sdk/middleware-serde": "1.0.0-rc.3",
	"@aws-sdk/middleware-signing": "1.0.0-rc.3",
	"@aws-sdk/middleware-ssec": "1.0.0-rc.3",
	"@aws-sdk/middleware-stack": "1.0.0-rc.3",
	"@aws-sdk/middleware-user-agent": "1.0.0-rc.3",
	"@aws-sdk/node-config-provider": "1.0.0-rc.3",
	"@aws-sdk/node-http-handler": "1.0.0-rc.3",
	"@aws-sdk/protocol-http": "1.0.0-rc.3",
	"@aws-sdk/smithy-client": "1.0.0-rc.3",
	"@aws-sdk/types": "1.0.0-rc.3",
	"@aws-sdk/url-parser-browser": "1.0.0-rc.3",
	"@aws-sdk/url-parser-node": "1.0.0-rc.3",
	"@aws-sdk/util-base64-browser": "1.0.0-rc.3",
	"@aws-sdk/util-base64-node": "1.0.0-rc.3",
	"@aws-sdk/util-body-length-browser": "1.0.0-rc.3",
	"@aws-sdk/util-body-length-node": "1.0.0-rc.3",
	"@aws-sdk/util-user-agent-browser": "1.0.0-rc.3",
	"@aws-sdk/util-user-agent-node": "1.0.0-rc.3",
	"@aws-sdk/util-utf8-browser": "1.0.0-rc.3",
	"@aws-sdk/util-utf8-node": "1.0.0-rc.3",
	"@aws-sdk/xml-builder": "1.0.0-rc.3",
	"fast-xml-parser": "^3.16.0",
	tslib: "^2.0.0"
};
var devDependencies = {
	"@aws-sdk/client-documentation-generator": "1.0.0-rc.3",
	"@types/chai": "^4.2.11",
	"@types/mocha": "^7.0.2",
	"@types/node": "^12.7.5",
	jest: "^26.1.0",
	rimraf: "^3.0.0",
	typedoc: "^0.17.8",
	typescript: "~4.0.2"
};
var engines = {
	node: ">=10.0.0"
};
var author = {
	name: "AWS SDK for JavaScript Team",
	url: "https://aws.amazon.com/javascript/"
};
var license = "Apache-2.0";
var homepage = "https://github.com/aws/aws-sdk-js-v3/tree/master/clients/client-s3";
var repository = {
	type: "git",
	url: "https://github.com/aws/aws-sdk-js-v3.git",
	directory: "clients/client-s3"
};
var packageInfo = {
	name: name,
	description: description,
	version: version,
	scripts: scripts,
	main: main,
	types: types,
	module: module$1,
	browser: browser,
	"react-native": {
	"./runtimeConfig": "./runtimeConfig.native"
},
	sideEffects: sideEffects,
	dependencies: dependencies,
	devDependencies: devDependencies,
	engines: engines,
	author: author,
	license: license,
	homepage: homepage,
	repository: repository
};

var resolveEndpointsConfig = function (input) {
    var _a;
    return (httpRequest$1.__assign(httpRequest$1.__assign({}, input), { tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true, endpoint: input.endpoint ? normalizeEndpoint(input) : function () { return getEndPointFromRegion(input); }, isCustomEndpoint: input.endpoint ? true : false }));
};
var normalizeEndpoint = function (input) {
    var endpoint = input.endpoint, urlParser = input.urlParser;
    if (typeof endpoint === "string") {
        var promisified_1 = Promise.resolve(urlParser(endpoint));
        return function () { return promisified_1; };
    }
    else if (typeof endpoint === "object") {
        var promisified_2 = Promise.resolve(endpoint);
        return function () { return promisified_2; };
    }
    return endpoint;
};
var getEndPointFromRegion = function (input) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    var _a, tls, region, dnsHostRegex, hostname;
    var _b;
    return httpRequest$1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = input.tls, tls = _a === void 0 ? true : _a;
                return [4 /*yield*/, input.region()];
            case 1:
                region = _c.sent();
                dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
                if (!dnsHostRegex.test(region)) {
                    throw new Error("Invalid region in client config");
                }
                return [4 /*yield*/, input.regionInfoProvider(region)];
            case 2:
                hostname = ((_b = (_c.sent())) !== null && _b !== void 0 ? _b : {}).hostname;
                if (!hostname) {
                    throw new Error("Cannot resolve hostname from client config");
                }
                return [2 /*return*/, input.urlParser((tls ? "https:" : "http:") + "//" + hostname)];
        }
    });
}); };

var REGION_ENV_NAME = "AWS_REGION";
var REGION_INI_NAME = "region";
var NODE_REGION_CONFIG_OPTIONS = {
    environmentVariableSelector: function (env) { return env[REGION_ENV_NAME]; },
    configFileSelector: function (profile) { return profile[REGION_INI_NAME]; },
    default: function () {
        throw new Error("Region is missing");
    },
};
var NODE_REGION_CONFIG_FILE_OPTIONS = {
    preferredFile: "credentials",
};
var resolveRegionConfig = function (input) {
    if (!input.region) {
        throw new Error("Region is missing");
    }
    return httpRequest$1.__assign(httpRequest$1.__assign({}, input), { region: normalizeRegion(input.region) });
};
var normalizeRegion = function (region) {
    if (typeof region === "string") {
        var promisified_1 = Promise.resolve(region);
        return function () { return promisified_1; };
    }
    return region;
};

/**
 * An error representing a failure of an individual credential provider.
 *
 * This error class has special meaning to the {@link chain} method. If a
 * provider in the chain is rejected with an error, the chain will only proceed
 * to the next provider if the value of the `tryNextLink` property on the error
 * is truthy. This allows individual providers to halt the chain and also
 * ensures the chain will stop if an entirely unexpected error is encountered.
 */
var ProviderError = /** @class */ (function (_super) {
    httpRequest$1.__extends(ProviderError, _super);
    function ProviderError(message, tryNextLink) {
        if (tryNextLink === void 0) { tryNextLink = true; }
        var _this = _super.call(this, message) || this;
        _this.tryNextLink = tryNextLink;
        return _this;
    }
    return ProviderError;
}(Error));

/**
 * Compose a single credential provider function from multiple credential
 * providers. The first provider in the argument list will always be invoked;
 * subsequent providers in the list will be invoked in the order in which the
 * were received if the preceding provider did not successfully resolve.
 *
 * If no providers were received or no provider resolves successfully, the
 * returned promise will be rejected.
 */
function chain() {
    var providers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        providers[_i] = arguments[_i];
    }
    return function () {
        var e_1, _a;
        var promise = Promise.reject(new ProviderError("No providers in chain"));
        var _loop_1 = function (provider) {
            promise = promise.catch(function (err) {
                if (err === null || err === void 0 ? void 0 : err.tryNextLink) {
                    return provider();
                }
                throw err;
            });
        };
        try {
            for (var providers_1 = httpRequest$1.__values(providers), providers_1_1 = providers_1.next(); !providers_1_1.done; providers_1_1 = providers_1.next()) {
                var provider = providers_1_1.value;
                _loop_1(provider);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (providers_1_1 && !providers_1_1.done && (_a = providers_1.return)) _a.call(providers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return promise;
    };
}

var fromStatic$1 = function (staticValue) { return function () { return Promise.resolve(staticValue); }; };

var memoize = function (provider, isExpired, requiresRefresh) {
    var result;
    var hasResult;
    if (isExpired === undefined) {
        // This is a static memoization; no need to incorporate refreshing
        return function () {
            if (!hasResult) {
                result = provider();
                hasResult = true;
            }
            return result;
        };
    }
    var isConstant = false;
    return function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
        var resolved;
        return httpRequest$1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!hasResult) {
                        result = provider();
                        hasResult = true;
                    }
                    if (isConstant) {
                        return [2 /*return*/, result];
                    }
                    return [4 /*yield*/, result];
                case 1:
                    resolved = _a.sent();
                    if (requiresRefresh && !requiresRefresh(resolved)) {
                        isConstant = true;
                        return [2 /*return*/, resolved];
                    }
                    if (isExpired(resolved)) {
                        return [2 /*return*/, (result = provider())];
                    }
                    return [2 /*return*/, resolved];
            }
        });
    }); };
};

var ENV_KEY = "AWS_ACCESS_KEY_ID";
var ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
var ENV_SESSION = "AWS_SESSION_TOKEN";
var ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
/**
 * Source AWS credentials from known environment variables. If either the
 * `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` environment variable is not
 * set in this process, the provider will return a rejected promise.
 */
function fromEnv$1() {
    return function () {
        var accessKeyId = process.env[ENV_KEY];
        var secretAccessKey = process.env[ENV_SECRET];
        var expiry = process.env[ENV_EXPIRATION];
        if (accessKeyId && secretAccessKey) {
            return Promise.resolve({
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                sessionToken: process.env[ENV_SESSION],
                expiration: expiry ? new Date(expiry) : undefined,
            });
        }
        return Promise.reject(new ProviderError("Unable to find environment variable credentials."));
    };
}

/**
 * @internal
 */
function httpRequest(options) {
    return new Promise(function (resolve, reject) {
        var req = http.request(httpRequest$1.__assign({ method: "GET" }, options));
        req.on("error", function (err) {
            reject(Object.assign(new ProviderError("Unable to connect to instance metadata service"), err));
        });
        req.on("timeout", function () {
            reject(new Error("TimeoutError"));
        });
        req.on("response", function (res) {
            var _a = res.statusCode, statusCode = _a === void 0 ? 400 : _a;
            if (statusCode < 200 || 300 <= statusCode) {
                reject(Object.assign(new ProviderError("Error response received from instance metadata service"), { statusCode: statusCode }));
            }
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                resolve(buffer.Buffer.concat(chunks));
            });
        });
        req.end();
    });
}

var isImdsCredentials = function (arg) {
    return Boolean(arg) &&
        typeof arg === "object" &&
        typeof arg.AccessKeyId === "string" &&
        typeof arg.SecretAccessKey === "string" &&
        typeof arg.Token === "string" &&
        typeof arg.Expiration === "string";
};
var fromImdsCredentials = function (creds) { return ({
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.Token,
    expiration: new Date(creds.Expiration),
}); };

var DEFAULT_TIMEOUT = 1000;
// The default in AWS SDK for Python and CLI (botocore) is no retry or one attempt
// https://github.com/boto/botocore/blob/646c61a7065933e75bab545b785e6098bc94c081/botocore/utils.py#L273
var DEFAULT_MAX_RETRIES = 0;
var providerConfigFromInit = function (_a) {
    var _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT_MAX_RETRIES : _b, _c = _a.timeout, timeout = _c === void 0 ? DEFAULT_TIMEOUT : _c;
    return ({ maxRetries: maxRetries, timeout: timeout });
};

/**
 * @internal
 */
var retry = function (toRetry, maxRetries) {
    var promise = toRetry();
    for (var i = 0; i < maxRetries; i++) {
        promise = promise.catch(toRetry);
    }
    return promise;
};

var ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
var ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
var ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
/**
 * Creates a credential provider that will source credentials from the ECS
 * Container Metadata Service
 */
function fromContainerMetadata(init) {
    var _this = this;
    if (init === void 0) { init = {}; }
    var _a = providerConfigFromInit(init), timeout = _a.timeout, maxRetries = _a.maxRetries;
    return function () {
        return getCmdsUri().then(function (url) {
            return retry(function () { return httpRequest$1.__awaiter(_this, void 0, void 0, function () {
                var credsResponse, _a, _b;
                return httpRequest$1.__generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = JSON).parse;
                            return [4 /*yield*/, requestFromEcsImds(timeout, url)];
                        case 1:
                            credsResponse = _b.apply(_a, [_c.sent()]);
                            if (!isImdsCredentials(credsResponse)) {
                                throw new ProviderError("Invalid response received from instance metadata service.");
                            }
                            return [2 /*return*/, fromImdsCredentials(credsResponse)];
                    }
                });
            }); }, maxRetries);
        });
    };
}
function requestFromEcsImds(timeout, options) {
    if (process.env[ENV_CMDS_AUTH_TOKEN]) {
        var _a = options.headers, headers = _a === void 0 ? {} : _a;
        headers.Authorization = process.env[ENV_CMDS_AUTH_TOKEN];
        options.headers = headers;
    }
    return httpRequest(httpRequest$1.__assign(httpRequest$1.__assign({}, options), { timeout: timeout })).then(function (buffer) { return buffer.toString(); });
}
var CMDS_IP = "169.254.170.2";
var GREENGRASS_HOSTS = {
    localhost: true,
    "127.0.0.1": true,
};
var GREENGRASS_PROTOCOLS = {
    "http:": true,
    "https:": true,
};
function getCmdsUri() {
    if (process.env[ENV_CMDS_RELATIVE_URI]) {
        return Promise.resolve({
            hostname: CMDS_IP,
            path: process.env[ENV_CMDS_RELATIVE_URI],
        });
    }
    if (process.env[ENV_CMDS_FULL_URI]) {
        var parsed = Url.parse(process.env[ENV_CMDS_FULL_URI]);
        if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
            return Promise.reject(new ProviderError(parsed.hostname + " is not a valid container metadata service hostname", false));
        }
        if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
            return Promise.reject(new ProviderError(parsed.protocol + " is not a valid container metadata service protocol", false));
        }
        return Promise.resolve(httpRequest$1.__assign(httpRequest$1.__assign({}, parsed), { port: parsed.port ? parseInt(parsed.port, 10) : undefined }));
    }
    return Promise.reject(new ProviderError("The container metadata credential provider cannot be used unless" +
        (" the " + ENV_CMDS_RELATIVE_URI + " or " + ENV_CMDS_FULL_URI + " environment") +
        " variable is set", false));
}

var IMDS_IP = "169.254.169.254";
var IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
var IMDS_TOKEN_PATH = "/latest/api/token";
/**
 * Creates a credential provider that will source credentials from the EC2
 * Instance Metadata Service
 */
var fromInstanceMetadata = function (init) {
    if (init === void 0) { init = {}; }
    // when set to true, metadata service will not fetch token
    var disableFetchToken = false;
    var _a = providerConfigFromInit(init), timeout = _a.timeout, maxRetries = _a.maxRetries;
    var getCredentials = function (maxRetries, options) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
        var profile;
        return httpRequest$1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retry(function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
                        var profile, err_1;
                        return httpRequest$1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, getProfile(options)];
                                case 1:
                                    profile = _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    if (err_1.statusCode === 401) {
                                        disableFetchToken = false;
                                    }
                                    throw err_1;
                                case 3: return [2 /*return*/, profile];
                            }
                        });
                    }); }, maxRetries)];
                case 1:
                    profile = (_a.sent()).trim();
                    return [2 /*return*/, retry(function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
                            var creds, err_2;
                            return httpRequest$1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, getCredentialsFromProfile(profile, options)];
                                    case 1:
                                        creds = _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_2 = _a.sent();
                                        if (err_2.statusCode === 401) {
                                            disableFetchToken = false;
                                        }
                                        throw err_2;
                                    case 3: return [2 /*return*/, creds];
                                }
                            });
                        }); }, maxRetries)];
            }
        });
    }); };
    return function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
        var token, error_1;
        return httpRequest$1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!disableFetchToken) return [3 /*break*/, 1];
                    return [2 /*return*/, getCredentials(maxRetries, { timeout: timeout })];
                case 1:
                    token = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getMetadataToken({ timeout: timeout })];
                case 3:
                    token = (_a.sent()).toString();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.statusCode) === 400) {
                        throw Object.assign(error_1, {
                            message: "EC2 Metadata token request returned error",
                        });
                    }
                    else if (error_1.message === "TimeoutError" || [403, 404, 405].includes(error_1.statusCode)) {
                        disableFetchToken = true;
                    }
                    return [2 /*return*/, getCredentials(maxRetries, { timeout: timeout })];
                case 5: return [2 /*return*/, getCredentials(maxRetries, {
                        timeout: timeout,
                        headers: {
                            "x-aws-ec2-metadata-token": token,
                        },
                    })];
            }
        });
    }); };
};
var getMetadataToken = function (options) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    return httpRequest$1.__generator(this, function (_a) {
        return [2 /*return*/, httpRequest(httpRequest$1.__assign(httpRequest$1.__assign({}, options), { host: IMDS_IP, path: IMDS_TOKEN_PATH, method: "PUT", headers: {
                    "x-aws-ec2-metadata-token-ttl-seconds": "21600",
                } }))];
    });
}); };
var getProfile = function (options) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () { return httpRequest$1.__generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, httpRequest(httpRequest$1.__assign(httpRequest$1.__assign({}, options), { host: IMDS_IP, path: IMDS_PATH }))];
        case 1: return [2 /*return*/, (_a.sent()).toString()];
    }
}); }); };
var getCredentialsFromProfile = function (profile, options) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    var credsResponse, _a, _b;
    return httpRequest$1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, httpRequest(httpRequest$1.__assign(httpRequest$1.__assign({}, options), { host: IMDS_IP, path: IMDS_PATH + profile }))];
            case 1:
                credsResponse = _b.apply(_a, [(_c.sent()).toString()]);
                if (!isImdsCredentials(credsResponse)) {
                    throw new ProviderError("Invalid response received from instance metadata service.");
                }
                return [2 /*return*/, fromImdsCredentials(credsResponse)];
        }
    });
}); };

var ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
var ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
var swallowError = function () { return ({}); };
function loadSharedConfigFiles(init) {
    if (init === void 0) { init = {}; }
    var _a = init.filepath, filepath = _a === void 0 ? process.env[ENV_CREDENTIALS_PATH] || require$$1.join(getHomeDir(), ".aws", "credentials") : _a, _b = init.configFilepath, configFilepath = _b === void 0 ? process.env[ENV_CONFIG_PATH] || require$$1.join(getHomeDir(), ".aws", "config") : _b;
    return Promise.all([
        slurpFile(configFilepath).then(parseIni).then(normalizeConfigFile).catch(swallowError),
        slurpFile(filepath).then(parseIni).catch(swallowError),
    ]).then(function (parsedFiles) {
        var _a = httpRequest$1.__read(parsedFiles, 2), configFile = _a[0], credentialsFile = _a[1];
        return {
            configFile: configFile,
            credentialsFile: credentialsFile,
        };
    });
}
var profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
function normalizeConfigFile(data) {
    var e_1, _a;
    var map = {};
    try {
        for (var _b = httpRequest$1.__values(Object.keys(data)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var matches = void 0;
            if (key === "default") {
                map.default = data.default;
            }
            else if ((matches = profileKeyRegex.exec(key))) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                var _d = httpRequest$1.__read(matches, 3), _1 = _d[0], _2 = _d[1], normalizedKey = _d[2];
                if (normalizedKey) {
                    map[normalizedKey] = data[key];
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return map;
}
function parseIni(iniData) {
    var e_2, _a;
    var map = {};
    var currentSection;
    try {
        for (var _b = httpRequest$1.__values(iniData.split(/\r?\n/)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var line = _c.value;
            line = line.split(/(^|\s)[;#]/)[0]; // remove comments
            var section = line.match(/^\s*\[([^\[\]]+)]\s*$/);
            if (section) {
                currentSection = section[1];
            }
            else if (currentSection) {
                var item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
                if (item) {
                    map[currentSection] = map[currentSection] || {};
                    map[currentSection][item[1]] = item[2];
                }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return map;
}
function slurpFile(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, "utf8", function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
function getHomeDir() {
    var _a = process.env, HOME = _a.HOME, USERPROFILE = _a.USERPROFILE, HOMEPATH = _a.HOMEPATH, _b = _a.HOMEDRIVE, HOMEDRIVE = _b === void 0 ? "C:" + require$$1.sep : _b;
    if (HOME)
        return HOME;
    if (USERPROFILE)
        return USERPROFILE;
    if (HOMEPATH)
        return "" + HOMEDRIVE + HOMEPATH;
    return os.homedir();
}

var DEFAULT_PROFILE$1 = "default";
var ENV_PROFILE$1 = "AWS_PROFILE";
function isStaticCredsProfile(arg) {
    return (Boolean(arg) &&
        typeof arg === "object" &&
        typeof arg.aws_access_key_id === "string" &&
        typeof arg.aws_secret_access_key === "string" &&
        ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1);
}
function isAssumeRoleProfile(arg) {
    return (Boolean(arg) &&
        typeof arg === "object" &&
        typeof arg.role_arn === "string" &&
        typeof arg.source_profile === "string" &&
        ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.external_id) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1);
}
/**
 * Creates a credential provider that will read from ini files and supports
 * role assumption and multi-factor authentication.
 */
function fromIni(init) {
    if (init === void 0) { init = {}; }
    return function () { return parseKnownFiles(init).then(function (profiles) { return resolveProfileData(getMasterProfileName(init), profiles, init); }); };
}
function getMasterProfileName(init) {
    return init.profile || process.env[ENV_PROFILE$1] || DEFAULT_PROFILE$1;
}
function resolveProfileData(profileName, profiles, options, visitedProfiles) {
    if (visitedProfiles === void 0) { visitedProfiles = {}; }
    return httpRequest$1.__awaiter(this, void 0, void 0, function () {
        var data, ExternalId, mfa_serial, RoleArn, _a, RoleSessionName, source_profile, sourceCreds, params, _b, _c, _d;
        var _e;
        return httpRequest$1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    data = profiles[profileName];
                    // If this is not the first profile visited, static credentials should be
                    // preferred over role assumption metadata. This special treatment of
                    // second and subsequent hops is to ensure compatibility with the AWS CLI.
                    if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
                        return [2 /*return*/, resolveStaticCredentials(data)];
                    }
                    if (!isAssumeRoleProfile(data)) return [3 /*break*/, 4];
                    ExternalId = data.external_id, mfa_serial = data.mfa_serial, RoleArn = data.role_arn, _a = data.role_session_name, RoleSessionName = _a === void 0 ? "aws-sdk-js-" + Date.now() : _a, source_profile = data.source_profile;
                    if (!options.roleAssumer) {
                        throw new ProviderError("Profile " + profileName + " requires a role to be assumed, but no" + " role assumption callback was provided.", false);
                    }
                    if (source_profile in visitedProfiles) {
                        throw new ProviderError("Detected a cycle attempting to resolve credentials for profile" +
                            (" " + getMasterProfileName(options) + ". Profiles visited: ") +
                            Object.keys(visitedProfiles).join(", "), false);
                    }
                    sourceCreds = resolveProfileData(source_profile, profiles, options, httpRequest$1.__assign(httpRequest$1.__assign({}, visitedProfiles), (_e = {}, _e[source_profile] = true, _e)));
                    params = { RoleArn: RoleArn, RoleSessionName: RoleSessionName, ExternalId: ExternalId };
                    if (!mfa_serial) return [3 /*break*/, 2];
                    if (!options.mfaCodeProvider) {
                        throw new ProviderError("Profile " + profileName + " requires multi-factor authentication," + " but no MFA code callback was provided.", false);
                    }
                    params.SerialNumber = mfa_serial;
                    _b = params;
                    return [4 /*yield*/, options.mfaCodeProvider(mfa_serial)];
                case 1:
                    _b.TokenCode = _f.sent();
                    _f.label = 2;
                case 2:
                    _d = (_c = options).roleAssumer;
                    return [4 /*yield*/, sourceCreds];
                case 3: return [2 /*return*/, _d.apply(_c, [_f.sent(), params])];
                case 4:
                    // If no role assumption metadata is present, attempt to load static
                    // credentials from the selected profile.
                    if (isStaticCredsProfile(data)) {
                        return [2 /*return*/, resolveStaticCredentials(data)];
                    }
                    // If the profile cannot be parsed or contains neither static credentials
                    // nor role assumption metadata, throw an error. This should be considered a
                    // terminal resolution error if a profile has been specified by the user
                    // (whether via a parameter, an environment variable, or another profile's
                    // `source_profile` key).
                    throw new ProviderError("Profile " + profileName + " could not be found or parsed in shared" + " credentials file.");
            }
        });
    });
}
function parseKnownFiles(init) {
    var _a = init.loadedConfig, loadedConfig = _a === void 0 ? loadSharedConfigFiles(init) : _a;
    return loadedConfig.then(function (parsedFiles) {
        var configFile = parsedFiles.configFile, credentialsFile = parsedFiles.credentialsFile;
        return httpRequest$1.__assign(httpRequest$1.__assign({}, configFile), credentialsFile);
    });
}
function resolveStaticCredentials(profile) {
    return Promise.resolve({
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
        sessionToken: profile.aws_session_token,
    });
}

/**
 * Creates a credential provider that will read from a credential_process specified
 * in ini files.
 */
function fromProcess(init) {
    if (init === void 0) { init = {}; }
    return function () {
        return parseKnownFiles(init).then(function (profiles) { return resolveProcessCredentials(getMasterProfileName(init), profiles); });
    };
}
function resolveProcessCredentials(profileName, profiles, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
options) {
    return httpRequest$1.__awaiter(this, void 0, void 0, function () {
        var profile, credentialProcess;
        return httpRequest$1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profile = profiles[profileName];
                    if (!profiles[profileName]) return [3 /*break*/, 4];
                    credentialProcess = profile["credential_process"];
                    if (!(credentialProcess !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, execPromise(credentialProcess)
                            .then(function (processResult) {
                            var data;
                            try {
                                data = JSON.parse(processResult);
                            }
                            catch (_a) {
                                throw Error("Profile " + profileName + " credential_process returned invalid JSON.");
                            }
                            var version = data.Version, accessKeyId = data.AccessKeyId, secretAccessKey = data.SecretAccessKey, sessionToken = data.SessionToken, expiration = data.Expiration;
                            if (version !== 1) {
                                throw Error("Profile " + profileName + " credential_process did not return Version 1.");
                            }
                            if (accessKeyId === undefined || secretAccessKey === undefined) {
                                throw Error("Profile " + profileName + " credential_process returned invalid credentials.");
                            }
                            var expirationUnix;
                            if (expiration) {
                                var currentTime = new Date();
                                var expireTime = new Date(expiration);
                                if (expireTime < currentTime) {
                                    throw Error("Profile " + profileName + " credential_process returned expired credentials.");
                                }
                                expirationUnix = Math.floor(new Date(expiration).valueOf() / 1000);
                            }
                            return {
                                accessKeyId: accessKeyId,
                                secretAccessKey: secretAccessKey,
                                sessionToken: sessionToken,
                                expirationUnix: expirationUnix,
                            };
                        })
                            .catch(function (error) {
                            throw new ProviderError(error.message);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: throw new ProviderError("Profile " + profileName + " did not contain credential_process.");
                case 3: return [3 /*break*/, 5];
                case 4: 
                // If the profile cannot be parsed or does not contain the default or
                // specified profile throw an error. This should be considered a terminal
                // resolution error if a profile has been specified by the user (whether via
                // a parameter, anenvironment variable, or another profile's `source_profile` key).
                throw new ProviderError("Profile " + profileName + " could not be found in shared credentials file.");
                case 5: return [2 /*return*/];
            }
        });
    });
}
function execPromise(command) {
    return new Promise(function (resolve, reject) {
        child_process.exec(command, function (error, stdout) {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

var ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
/**
 * Creates a credential provider that will attempt to find credentials from the
 * following sources (listed in order of precedence):
 *   * Environment variables exposed via `process.env`
 *   * Shared credentials and config ini files
 *   * The EC2/ECS Instance Metadata Service
 *
 * The default credential provider will invoke one provider at a time and only
 * continue to the next if no credentials have been located. For example, if
 * the process finds values defined via the `AWS_ACCESS_KEY_ID` and
 * `AWS_SECRET_ACCESS_KEY` environment variables, the files at
 * `~/.aws/credentials` and `~/.aws/config` will not be read, nor will any
 * messages be sent to the Instance Metadata Service.
 *
 * @param init                  Configuration that is passed to each individual
 *                              provider
 *
 * @see fromEnv                 The function used to source credentials from
 *                              environment variables
 * @see fromIni                 The function used to source credentials from INI
 *                              files
 * @see fromProcess             The functino used to sources credentials from
 *                              credential_process in INI files
 * @see fromInstanceMetadata    The function used to source credentials from the
 *                              EC2 Instance Metadata Service
 * @see fromContainerMetadata   The function used to source credentials from the
 *                              ECS Container Metadata Service
 */
function defaultProvider(init) {
    if (init === void 0) { init = {}; }
    var _a = init.profile, profile = _a === void 0 ? process.env[ENV_PROFILE$1] : _a;
    var providerChain = profile
        ? fromIni(init)
        : chain(fromEnv$1(), fromIni(init), fromProcess(init), remoteProvider(init));
    return memoize(providerChain, function (credentials) { return credentials.expiration !== undefined && credentials.expiration.getTime() - Date.now() < 300000; }, function (credentials) { return credentials.expiration !== undefined; });
}
function remoteProvider(init) {
    if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
        return fromContainerMetadata(init);
    }
    if (process.env[ENV_IMDS_DISABLED]) {
        return function () { return Promise.reject(new ProviderError("EC2 Instance Metadata Service access disabled")); };
    }
    return fromInstanceMetadata(init);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

var tslib_es6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  __extends: __extends,
  get __assign () { return __assign; },
  __rest: __rest,
  __decorate: __decorate,
  __param: __param,
  __metadata: __metadata,
  __awaiter: __awaiter,
  __generator: __generator,
  __createBinding: __createBinding,
  __exportStar: __exportStar,
  __values: __values,
  __read: __read,
  __spread: __spread,
  __spreadArrays: __spreadArrays,
  __await: __await,
  __asyncGenerator: __asyncGenerator,
  __asyncDelegator: __asyncDelegator,
  __asyncValues: __asyncValues,
  __makeTemplateObject: __makeTemplateObject,
  __importStar: __importStar,
  __importDefault: __importDefault,
  __classPrivateFieldGet: __classPrivateFieldGet,
  __classPrivateFieldSet: __classPrivateFieldSet
});

var build = imageHandler.createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crc32 = exports.crc32 = void 0;

function crc32(data) {
    return new Crc32().update(data).digest();
}
exports.crc32 = crc32;
var Crc32 = /** @class */ (function () {
    function Crc32() {
        this.checksum = 0xffffffff;
    }
    Crc32.prototype.update = function (data) {
        var e_1, _a;
        try {
            for (var data_1 = tslib_es6.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var byte = data_1_1.value;
                this.checksum =
                    (this.checksum >>> 8) ^ lookupTable[(this.checksum ^ byte) & 0xff];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    Crc32.prototype.digest = function () {
        return (this.checksum ^ 0xffffffff) >>> 0;
    };
    return Crc32;
}());
exports.Crc32 = Crc32;
// prettier-ignore
var lookupTable = Uint32Array.from([
    0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA,
    0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
    0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
    0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91,
    0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
    0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
    0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC,
    0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5,
    0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172,
    0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
    0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940,
    0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
    0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116,
    0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
    0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
    0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
    0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A,
    0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
    0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818,
    0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
    0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E,
    0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457,
    0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C,
    0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
    0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
    0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB,
    0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0,
    0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9,
    0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086,
    0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
    0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4,
    0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD,
    0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A,
    0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683,
    0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
    0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
    0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE,
    0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7,
    0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC,
    0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
    0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252,
    0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
    0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60,
    0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79,
    0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
    0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F,
    0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04,
    0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
    0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A,
    0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
    0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38,
    0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21,
    0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E,
    0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
    0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
    0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45,
    0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2,
    0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB,
    0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0,
    0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
    0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6,
    0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF,
    0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94,
    0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D,
]);
//# sourceMappingURL=index.js.map
});

var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (var i = 0; i < 256; i++) {
    var encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = "0" + encodedByte;
    }
    SHORT_TO_HEX[i] = encodedByte;
    HEX_TO_SHORT[encodedByte] = i;
}
/**
 * Converts a hexadecimal encoded string to a Uint8Array of bytes.
 *
 * @param encoded The hexadecimal encoded string
 */
function fromHex(encoded) {
    if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
    }
    var out = new Uint8Array(encoded.length / 2);
    for (var i = 0; i < encoded.length; i += 2) {
        var encodedByte = encoded.substr(i, 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
            out[i / 2] = HEX_TO_SHORT[encodedByte];
        }
        else {
            throw new Error("Cannot decode unrecognized sequence " + encodedByte + " as hexadecimal");
        }
    }
    return out;
}
/**
 * Converts a Uint8Array of binary data to a hexadecimal encoded string.
 *
 * @param bytes The binary data to encode
 */
function toHex(bytes) {
    var out = "";
    for (var i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}

/**
 * A lossless representation of a signed, 64-bit integer. Instances of this
 * class may be used in arithmetic expressions as if they were numeric
 * primitives, but the binary representation will be preserved unchanged as the
 * `bytes` property of the object. The bytes should be encoded as big-endian,
 * two's complement integers.
 */
var Int64 = /** @class */ (function () {
    function Int64(bytes) {
        this.bytes = bytes;
        if (bytes.byteLength !== 8) {
            throw new Error("Int64 buffers must be exactly 8 bytes");
        }
    }
    Int64.fromNumber = function (number) {
        if (number > 9223372036854775807 || number < -9223372036854775808) {
            throw new Error(number + " is too large (or, if negative, too small) to represent as an Int64");
        }
        var bytes = new Uint8Array(8);
        for (var i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) {
            bytes[i] = remaining;
        }
        if (number < 0) {
            negate(bytes);
        }
        return new Int64(bytes);
    };
    /**
     * Called implicitly by infix arithmetic operators.
     */
    Int64.prototype.valueOf = function () {
        var bytes = this.bytes.slice(0);
        var negative = bytes[0] & 128;
        if (negative) {
            negate(bytes);
        }
        return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
    };
    Int64.prototype.toString = function () {
        return String(this.valueOf());
    };
    return Int64;
}());
function negate(bytes) {
    for (var i = 0; i < 8; i++) {
        bytes[i] ^= 0xff;
    }
    for (var i = 7; i > -1; i--) {
        bytes[i]++;
        if (bytes[i] !== 0)
            break;
    }
}

/**
 * @internal
 */
var HeaderMarshaller = /** @class */ (function () {
    function HeaderMarshaller(toUtf8, fromUtf8) {
        this.toUtf8 = toUtf8;
        this.fromUtf8 = fromUtf8;
    }
    HeaderMarshaller.prototype.format = function (headers) {
        var e_1, _a, e_2, _b;
        var chunks = [];
        try {
            for (var _c = httpRequest$1.__values(Object.keys(headers)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var headerName = _d.value;
                var bytes = this.fromUtf8(headerName);
                chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var out = new Uint8Array(chunks.reduce(function (carry, bytes) { return carry + bytes.byteLength; }, 0));
        var position = 0;
        try {
            for (var chunks_1 = httpRequest$1.__values(chunks), chunks_1_1 = chunks_1.next(); !chunks_1_1.done; chunks_1_1 = chunks_1.next()) {
                var chunk = chunks_1_1.value;
                out.set(chunk, position);
                position += chunk.byteLength;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (chunks_1_1 && !chunks_1_1.done && (_b = chunks_1.return)) _b.call(chunks_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return out;
    };
    HeaderMarshaller.prototype.formatHeaderValue = function (header) {
        switch (header.type) {
            case "boolean":
                return Uint8Array.from([header.value ? 0 /* boolTrue */ : 1 /* boolFalse */]);
            case "byte":
                return Uint8Array.from([2 /* byte */, header.value]);
            case "short":
                var shortView = new DataView(new ArrayBuffer(3));
                shortView.setUint8(0, 3 /* short */);
                shortView.setInt16(1, header.value, false);
                return new Uint8Array(shortView.buffer);
            case "integer":
                var intView = new DataView(new ArrayBuffer(5));
                intView.setUint8(0, 4 /* integer */);
                intView.setInt32(1, header.value, false);
                return new Uint8Array(intView.buffer);
            case "long":
                var longBytes = new Uint8Array(9);
                longBytes[0] = 5 /* long */;
                longBytes.set(header.value.bytes, 1);
                return longBytes;
            case "binary":
                var binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
                binView.setUint8(0, 6 /* byteArray */);
                binView.setUint16(1, header.value.byteLength, false);
                var binBytes = new Uint8Array(binView.buffer);
                binBytes.set(header.value, 3);
                return binBytes;
            case "string":
                var utf8Bytes = this.fromUtf8(header.value);
                var strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
                strView.setUint8(0, 7 /* string */);
                strView.setUint16(1, utf8Bytes.byteLength, false);
                var strBytes = new Uint8Array(strView.buffer);
                strBytes.set(utf8Bytes, 3);
                return strBytes;
            case "timestamp":
                var tsBytes = new Uint8Array(9);
                tsBytes[0] = 8 /* timestamp */;
                tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
                return tsBytes;
            case "uuid":
                if (!UUID_PATTERN.test(header.value)) {
                    throw new Error("Invalid UUID received: " + header.value);
                }
                var uuidBytes = new Uint8Array(17);
                uuidBytes[0] = 9 /* uuid */;
                uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
                return uuidBytes;
        }
    };
    HeaderMarshaller.prototype.parse = function (headers) {
        var out = {};
        var position = 0;
        while (position < headers.byteLength) {
            var nameLength = headers.getUint8(position++);
            var name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
            position += nameLength;
            switch (headers.getUint8(position++)) {
                case 0 /* boolTrue */:
                    out[name] = {
                        type: BOOLEAN_TAG,
                        value: true,
                    };
                    break;
                case 1 /* boolFalse */:
                    out[name] = {
                        type: BOOLEAN_TAG,
                        value: false,
                    };
                    break;
                case 2 /* byte */:
                    out[name] = {
                        type: BYTE_TAG,
                        value: headers.getInt8(position++),
                    };
                    break;
                case 3 /* short */:
                    out[name] = {
                        type: SHORT_TAG,
                        value: headers.getInt16(position, false),
                    };
                    position += 2;
                    break;
                case 4 /* integer */:
                    out[name] = {
                        type: INT_TAG,
                        value: headers.getInt32(position, false),
                    };
                    position += 4;
                    break;
                case 5 /* long */:
                    out[name] = {
                        type: LONG_TAG,
                        value: new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)),
                    };
                    position += 8;
                    break;
                case 6 /* byteArray */:
                    var binaryLength = headers.getUint16(position, false);
                    position += 2;
                    out[name] = {
                        type: BINARY_TAG,
                        value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength),
                    };
                    position += binaryLength;
                    break;
                case 7 /* string */:
                    var stringLength = headers.getUint16(position, false);
                    position += 2;
                    out[name] = {
                        type: STRING_TAG,
                        value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength)),
                    };
                    position += stringLength;
                    break;
                case 8 /* timestamp */:
                    out[name] = {
                        type: TIMESTAMP_TAG,
                        value: new Date(new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf()),
                    };
                    position += 8;
                    break;
                case 9 /* uuid */:
                    var uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
                    position += 16;
                    out[name] = {
                        type: UUID_TAG,
                        value: toHex(uuidBytes.subarray(0, 4)) + "-" + toHex(uuidBytes.subarray(4, 6)) + "-" + toHex(uuidBytes.subarray(6, 8)) + "-" + toHex(uuidBytes.subarray(8, 10)) + "-" + toHex(uuidBytes.subarray(10)),
                    };
                    break;
                default:
                    throw new Error("Unrecognized header type tag");
            }
        }
        return out;
    };
    return HeaderMarshaller;
}());
var HEADER_VALUE_TYPE;
(function (HEADER_VALUE_TYPE) {
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolTrue"] = 0] = "boolTrue";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolFalse"] = 1] = "boolFalse";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byte"] = 2] = "byte";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["short"] = 3] = "short";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["integer"] = 4] = "integer";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["long"] = 5] = "long";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byteArray"] = 6] = "byteArray";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["string"] = 7] = "string";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["timestamp"] = 8] = "timestamp";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var BOOLEAN_TAG = "boolean";
var BYTE_TAG = "byte";
var SHORT_TAG = "short";
var INT_TAG = "integer";
var LONG_TAG = "long";
var BINARY_TAG = "binary";
var STRING_TAG = "string";
var TIMESTAMP_TAG = "timestamp";
var UUID_TAG = "uuid";
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

// All prelude components are unsigned, 32-bit integers
var PRELUDE_MEMBER_LENGTH = 4;
// The prelude consists of two components
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
// Checksums are always CRC32 hashes.
var CHECKSUM_LENGTH = 4;
// Messages must include a full prelude, a prelude checksum, and a message checksum
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
/**
 * @internal
 */
function splitMessage(_a) {
    var byteLength = _a.byteLength, byteOffset = _a.byteOffset, buffer = _a.buffer;
    if (byteLength < MINIMUM_MESSAGE_LENGTH) {
        throw new Error("Provided message too short to accommodate event stream message overhead");
    }
    var view = new DataView(buffer, byteOffset, byteLength);
    var messageLength = view.getUint32(0, false);
    if (byteLength !== messageLength) {
        throw new Error("Reported message length does not match received message length");
    }
    var headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
    var expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
    var expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
    var checksummer = new build.Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
    if (expectedPreludeChecksum !== checksummer.digest()) {
        throw new Error("The prelude checksum specified in the message (" + expectedPreludeChecksum + ") does not match the calculated CRC32 checksum (" + checksummer.digest() + ")");
    }
    checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
    if (expectedMessageChecksum !== checksummer.digest()) {
        throw new Error("The message checksum (" + checksummer.digest() + ") did not match the expected value of " + expectedMessageChecksum);
    }
    return {
        headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
        body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH)),
    };
}

/**
 * A marshaller that can convert binary-packed event stream messages into
 * JavaScript objects and back again into their binary format.
 */
var EventStreamMarshaller$2 = /** @class */ (function () {
    function EventStreamMarshaller(toUtf8, fromUtf8) {
        this.headerMarshaller = new HeaderMarshaller(toUtf8, fromUtf8);
    }
    /**
     * Convert a structured JavaScript object with tagged headers into a binary
     * event stream message.
     */
    EventStreamMarshaller.prototype.marshall = function (_a) {
        var rawHeaders = _a.headers, body = _a.body;
        var headers = this.headerMarshaller.format(rawHeaders);
        var length = headers.byteLength + body.byteLength + 16;
        var out = new Uint8Array(length);
        var view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        var checksum = new build.Crc32();
        // Format message
        view.setUint32(0, length, false);
        view.setUint32(4, headers.byteLength, false);
        view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
        out.set(headers, 12);
        out.set(body, headers.byteLength + 12);
        // Write trailing message checksum
        view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
        return out;
    };
    /**
     * Convert a binary event stream message into a JavaScript object with an
     * opaque, binary body and tagged, parsed headers.
     */
    EventStreamMarshaller.prototype.unmarshall = function (message) {
        var _a = splitMessage(message), headers = _a.headers, body = _a.body;
        return { headers: this.headerMarshaller.parse(headers), body: body };
    };
    /**
     * Convert a structured JavaScript object with tagged headers into a binary
     * event stream message header.
     */
    EventStreamMarshaller.prototype.formatHeaders = function (rawHeaders) {
        return this.headerMarshaller.format(rawHeaders);
    };
    return EventStreamMarshaller;
}());

function getChunkedStream(source) {
    var _a;
    var currentMessageTotalLength = 0;
    var currentMessagePendingLength = 0;
    var currentMessage = null;
    var messageLengthBuffer = null;
    var allocateMessage = function (size) {
        if (typeof size !== "number") {
            throw new Error("Attempted to allocate an event message where size was not a number: " + size);
        }
        currentMessageTotalLength = size;
        currentMessagePendingLength = 4;
        currentMessage = new Uint8Array(size);
        var currentMessageView = new DataView(currentMessage.buffer);
        currentMessageView.setUint32(0, size, false); //set big-endian Uint32 to 0~3 bytes
    };
    var iterator = function () {
        return httpRequest$1.__asyncGenerator(this, arguments, function () {
            var sourceIterator, _a, value, done, chunkLength, currentOffset, bytesRemaining, numBytesForTotal, numBytesToWrite;
            return httpRequest$1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sourceIterator = source[Symbol.asyncIterator]();
                        _b.label = 1;
                    case 1:
                        return [4 /*yield*/, httpRequest$1.__await(sourceIterator.next())];
                    case 2:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        if (!done) return [3 /*break*/, 10];
                        if (!!currentMessageTotalLength) return [3 /*break*/, 4];
                        return [4 /*yield*/, httpRequest$1.__await(void 0)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        if (!(currentMessageTotalLength === currentMessagePendingLength)) return [3 /*break*/, 7];
                        return [4 /*yield*/, httpRequest$1.__await(currentMessage)];
                    case 5: return [4 /*yield*/, _b.sent()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: throw new Error("Truncated event message received.");
                    case 8: return [4 /*yield*/, httpRequest$1.__await(void 0)];
                    case 9: return [2 /*return*/, _b.sent()];
                    case 10:
                        chunkLength = value.length;
                        currentOffset = 0;
                        _b.label = 11;
                    case 11:
                        if (!(currentOffset < chunkLength)) return [3 /*break*/, 15];
                        // create new message if necessary
                        if (!currentMessage) {
                            bytesRemaining = chunkLength - currentOffset;
                            // prevent edge case where total length spans 2 chunks
                            if (!messageLengthBuffer) {
                                messageLengthBuffer = new Uint8Array(4);
                            }
                            numBytesForTotal = Math.min(4 - currentMessagePendingLength, // remaining bytes to fill the messageLengthBuffer
                            bytesRemaining // bytes left in chunk
                            );
                            messageLengthBuffer.set(
                            // @ts-ignore error TS2532: Object is possibly 'undefined' for value
                            value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
                            currentMessagePendingLength += numBytesForTotal;
                            currentOffset += numBytesForTotal;
                            if (currentMessagePendingLength < 4) {
                                // not enough information to create the current message
                                return [3 /*break*/, 15];
                            }
                            allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
                            messageLengthBuffer = null;
                        }
                        numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, // number of bytes left to complete message
                        chunkLength - currentOffset // number of bytes left in the original chunk
                        );
                        currentMessage.set(
                        // @ts-ignore error TS2532: Object is possibly 'undefined' for value
                        value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
                        currentMessagePendingLength += numBytesToWrite;
                        currentOffset += numBytesToWrite;
                        if (!(currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength)) return [3 /*break*/, 14];
                        return [4 /*yield*/, httpRequest$1.__await(currentMessage)];
                    case 12: 
                    // push out the message
                    return [4 /*yield*/, _b.sent()];
                    case 13:
                        // push out the message
                        _b.sent();
                        // cleanup
                        currentMessage = null;
                        currentMessageTotalLength = 0;
                        currentMessagePendingLength = 0;
                        _b.label = 14;
                    case 14: return [3 /*break*/, 11];
                    case 15: return [3 /*break*/, 1];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    return _a = {},
        _a[Symbol.asyncIterator] = iterator,
        _a;
}

function getUnmarshalledStream(source, options) {
    var _a;
    return _a = {},
        _a[Symbol.asyncIterator] = function () {
            return httpRequest$1.__asyncGenerator(this, arguments, function () {
                var source_1, source_1_1, chunk, message, messageType, unmodeledError, code, exception, deserializedException, error, event, deserialized, e_1_1;
                var _a, _b;
                var e_1, _c;
                return httpRequest$1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 12, 13, 18]);
                            source_1 = httpRequest$1.__asyncValues(source);
                            _d.label = 1;
                        case 1: return [4 /*yield*/, httpRequest$1.__await(source_1.next())];
                        case 2:
                            if (!(source_1_1 = _d.sent(), !source_1_1.done)) return [3 /*break*/, 11];
                            chunk = source_1_1.value;
                            message = options.eventMarshaller.unmarshall(chunk);
                            messageType = message.headers[":message-type"].value;
                            if (!(messageType === "error")) return [3 /*break*/, 3];
                            unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
                            unmodeledError.name = message.headers[":error-code"].value;
                            throw unmodeledError;
                        case 3:
                            if (!(messageType === "exception")) return [3 /*break*/, 5];
                            code = message.headers[":exception-type"].value;
                            exception = (_a = {}, _a[code] = message, _a);
                            return [4 /*yield*/, httpRequest$1.__await(options.deserializer(exception))];
                        case 4:
                            deserializedException = _d.sent();
                            if (deserializedException.$unknown) {
                                error = new Error(options.toUtf8(message.body));
                                error.name = code;
                                throw error;
                            }
                            throw deserializedException[code];
                        case 5:
                            if (!(messageType === "event")) return [3 /*break*/, 9];
                            event = (_b = {},
                                _b[message.headers[":event-type"].value] = message,
                                _b);
                            return [4 /*yield*/, httpRequest$1.__await(options.deserializer(event))];
                        case 6:
                            deserialized = _d.sent();
                            if (deserialized.$unknown)
                                return [3 /*break*/, 10];
                            return [4 /*yield*/, httpRequest$1.__await(deserialized)];
                        case 7: return [4 /*yield*/, _d.sent()];
                        case 8:
                            _d.sent();
                            return [3 /*break*/, 10];
                        case 9: throw Error("Unrecognizable event type: " + message.headers[":event-type"].value);
                        case 10: return [3 /*break*/, 1];
                        case 11: return [3 /*break*/, 18];
                        case 12:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 18];
                        case 13:
                            _d.trys.push([13, , 16, 17]);
                            if (!(source_1_1 && !source_1_1.done && (_c = source_1.return))) return [3 /*break*/, 15];
                            return [4 /*yield*/, httpRequest$1.__await(_c.call(source_1))];
                        case 14:
                            _d.sent();
                            _d.label = 15;
                        case 15: return [3 /*break*/, 17];
                        case 16:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 17: return [7 /*endfinally*/];
                        case 18: return [2 /*return*/];
                    }
                });
            });
        },
        _a;
}

var EventStreamMarshaller$1 = /** @class */ (function () {
    function EventStreamMarshaller(_a) {
        var utf8Encoder = _a.utf8Encoder, utf8Decoder = _a.utf8Decoder;
        this.eventMarshaller = new EventStreamMarshaller$2(utf8Encoder, utf8Decoder);
        this.utfEncoder = utf8Encoder;
    }
    EventStreamMarshaller.prototype.deserialize = function (body, deserializer) {
        var chunkedStream = getChunkedStream(body);
        var unmarshalledStream = getUnmarshalledStream(chunkedStream, {
            eventMarshaller: this.eventMarshaller,
            deserializer: deserializer,
            toUtf8: this.utfEncoder,
        });
        return unmarshalledStream;
    };
    EventStreamMarshaller.prototype.serialize = function (input, serializer) {
        var _a;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        var self = this;
        var serializedIterator = function () {
            return httpRequest$1.__asyncGenerator(this, arguments, function () {
                var input_1, input_1_1, chunk, payloadBuf, e_1_1;
                var e_1, _a;
                return httpRequest$1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, 8, 13]);
                            input_1 = httpRequest$1.__asyncValues(input);
                            _b.label = 1;
                        case 1: return [4 /*yield*/, httpRequest$1.__await(input_1.next())];
                        case 2:
                            if (!(input_1_1 = _b.sent(), !input_1_1.done)) return [3 /*break*/, 6];
                            chunk = input_1_1.value;
                            payloadBuf = self.eventMarshaller.marshall(serializer(chunk));
                            return [4 /*yield*/, httpRequest$1.__await(payloadBuf)];
                        case 3: return [4 /*yield*/, _b.sent()];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5: return [3 /*break*/, 1];
                        case 6: return [3 /*break*/, 13];
                        case 7:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 13];
                        case 8:
                            _b.trys.push([8, , 11, 12]);
                            if (!(input_1_1 && !input_1_1.done && (_a = input_1.return))) return [3 /*break*/, 10];
                            return [4 /*yield*/, httpRequest$1.__await(_a.call(input_1))];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 12: return [7 /*endfinally*/];
                        case 13: return [4 /*yield*/, httpRequest$1.__await(new Uint8Array(0))];
                        case 14: 
                        // Ending frame
                        return [4 /*yield*/, _b.sent()];
                        case 15:
                            // Ending frame
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return _a = {},
            _a[Symbol.asyncIterator] = serializedIterator,
            _a;
    };
    return EventStreamMarshaller;
}());

/**
 * Convert object stream piped in into an async iterable. This
 * daptor should be deprecated when Node stream iterator is stable.
 * Caveat: this adaptor won't have backpressure to inwards stream
 *
 * Reference: https://nodejs.org/docs/latest-v11.x/api/stream.html#stream_readable_symbol_asynciterator
 */
function readabletoIterable(readStream) {
    return httpRequest$1.__asyncGenerator(this, arguments, function readabletoIterable_1() {
        var streamEnded, generationEnded, records, value;
        return httpRequest$1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    streamEnded = false;
                    generationEnded = false;
                    records = new Array();
                    readStream.on("error", function (err) {
                        if (!streamEnded) {
                            streamEnded = true;
                        }
                        if (err) {
                            throw err;
                        }
                    });
                    readStream.on("data", function (data) {
                        records.push(data);
                    });
                    readStream.on("end", function () {
                        streamEnded = true;
                    });
                    _a.label = 1;
                case 1:
                    if (!!generationEnded) return [3 /*break*/, 6];
                    return [4 /*yield*/, httpRequest$1.__await(new Promise(function (resolve) { return setTimeout(function () { return resolve(records.shift()); }, 0); }))];
                case 2:
                    value = _a.sent();
                    if (!value) return [3 /*break*/, 5];
                    return [4 /*yield*/, httpRequest$1.__await(value)];
                case 3: return [4 /*yield*/, _a.sent()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    generationEnded = streamEnded && records.length === 0;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}

var EventStreamMarshaller = /** @class */ (function () {
    function EventStreamMarshaller(_a) {
        var utf8Encoder = _a.utf8Encoder, utf8Decoder = _a.utf8Decoder;
        this.eventMarshaller = new EventStreamMarshaller$2(utf8Encoder, utf8Decoder);
        this.universalMarshaller = new EventStreamMarshaller$1({
            utf8Decoder: utf8Decoder,
            utf8Encoder: utf8Encoder,
        });
    }
    EventStreamMarshaller.prototype.deserialize = function (body, deserializer) {
        //should use stream[Symbol.asyncIterable] when the api is stable
        //reference: https://nodejs.org/docs/latest-v11.x/api/stream.html#stream_readable_symbol_asynciterator
        var bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readabletoIterable(body);
        return this.universalMarshaller.deserialize(bodyIterable, deserializer);
    };
    EventStreamMarshaller.prototype.serialize = function (input, serializer) {
        var serializedIterable = this.universalMarshaller.serialize(input, serializer);
        if (typeof Stream.Readable.from === "function") {
            //reference: https://nodejs.org/dist/latest-v13.x/docs/api/stream.html#stream_new_stream_readable_options
            return Stream.Readable.from(serializedIterable);
        }
        else {
            var iterator_1 = serializedIterable[Symbol.asyncIterator]();
            var serializedStream_1 = new Stream.Readable({
                autoDestroy: true,
                objectMode: true,
                read: function () {
                    return httpRequest$1.__awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        return httpRequest$1.__generator(this, function (_a) {
                            iterator_1
                                .next()
                                .then(function (_a) {
                                var done = _a.done, value = _a.value;
                                if (done) {
                                    _this.push(null);
                                }
                                else {
                                    _this.push(value);
                                }
                            })
                                .catch(function (err) {
                                _this.destroy(err);
                            });
                            return [2 /*return*/];
                        });
                    });
                },
            });
            //TODO: use 'autoDestroy' when targeting Node 11
            serializedStream_1.on("error", function () {
                serializedStream_1.destroy();
            });
            serializedStream_1.on("end", function () {
                serializedStream_1.destroy();
            });
            return serializedStream_1;
        }
    };
    return EventStreamMarshaller;
}());

/** NodeJS event stream utils provider */
var eventStreamSerdeProvider = function (options) { return new EventStreamMarshaller(options); };

var isArrayBuffer = function (arg) {
    return (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
        Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
};

var fromArrayBuffer = function (input, offset, length) {
    if (offset === void 0) { offset = 0; }
    if (length === void 0) { length = input.byteLength - offset; }
    if (!isArrayBuffer(input)) {
        throw new TypeError("The \"input\" argument must be ArrayBuffer. Received type " + typeof input + " (" + input + ")");
    }
    return buffer.Buffer.from(input, offset, length);
};
var fromString = function (input, encoding) {
    if (typeof input !== "string") {
        throw new TypeError("The \"input\" argument must be of type string. Received type " + typeof input + " (" + input + ")");
    }
    return encoding ? buffer.Buffer.from(input, encoding) : buffer.Buffer.from(input);
};

var Hash = /** @class */ (function () {
    function Hash(algorithmIdentifier, secret) {
        this.hash = secret ? crypto.createHmac(algorithmIdentifier, castSourceData(secret)) : crypto.createHash(algorithmIdentifier);
    }
    Hash.prototype.update = function (toHash, encoding) {
        this.hash.update(castSourceData(toHash, encoding));
    };
    Hash.prototype.digest = function () {
        return Promise.resolve(this.hash.digest());
    };
    return Hash;
}());
function castSourceData(toCast, encoding) {
    if (buffer.Buffer.isBuffer(toCast)) {
        return toCast;
    }
    if (typeof toCast === "string") {
        return fromString(toCast, encoding);
    }
    if (ArrayBuffer.isView(toCast)) {
        return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
    }
    return fromArrayBuffer(toCast);
}

var HashCalculator = /** @class */ (function (_super) {
    httpRequest$1.__extends(HashCalculator, _super);
    function HashCalculator(hash, options) {
        var _this = _super.call(this, options) || this;
        _this.hash = hash;
        return _this;
    }
    HashCalculator.prototype._write = function (chunk, encoding, callback) {
        try {
            this.hash.update(chunk);
        }
        catch (err) {
            return callback(err);
        }
        callback();
    };
    return HashCalculator;
}(Stream.Writable));

var fileStreamHasher = function fileStreamHasher(hashCtor, fileStream) {
    return new Promise(function (resolve, reject) {
        if (!isReadStream(fileStream)) {
            reject(new Error("Unable to calculate hash for non-file streams."));
            return;
        }
        var fileStreamTee = fs.createReadStream(fileStream.path, {
            start: fileStream.start,
            end: fileStream.end,
        });
        var hash = new hashCtor();
        var hashCalculator = new HashCalculator(hash);
        fileStreamTee.pipe(hashCalculator);
        fileStreamTee.on("error", function (err) {
            // if the source errors, the destination stream needs to manually end
            hashCalculator.end();
            reject(err);
        });
        hashCalculator.on("error", reject);
        hashCalculator.on("finish", function () {
            hash.digest().then(resolve).catch(reject);
        });
    });
};
function isReadStream(stream) {
    return typeof stream.path === "string";
}

function resolveBucketEndpointConfig(input) {
    var _a = input.bucketEndpoint, bucketEndpoint = _a === void 0 ? false : _a, _b = input.forcePathStyle, forcePathStyle = _b === void 0 ? false : _b, _c = input.useAccelerateEndpoint, useAccelerateEndpoint = _c === void 0 ? false : _c, _d = input.useDualstackEndpoint, useDualstackEndpoint = _d === void 0 ? false : _d, _e = input.useArnRegion, useArnRegion = _e === void 0 ? false : _e;
    return httpRequest$1.__assign(httpRequest$1.__assign({}, input), { bucketEndpoint: bucketEndpoint,
        forcePathStyle: forcePathStyle,
        useAccelerateEndpoint: useAccelerateEndpoint,
        useDualstackEndpoint: useDualstackEndpoint, useArnRegion: typeof useArnRegion === "function" ? useArnRegion : function () { return Promise.resolve(useArnRegion); } });
}
var NODE_USE_ARN_REGION_ENV_NAME = "AWS_S3_USE_ARN_REGION";
var NODE_USE_ARN_REGION_INI_NAME = "s3_use_arn_region";
/**
 * Config to load useArnRegion from environment variables and shared INI files
 *
 * @api private
 */
var NODE_USE_ARN_REGION_CONFIG_OPTIONS = {
    environmentVariableSelector: function (env) {
        if (!Object.prototype.hasOwnProperty.call(env, NODE_USE_ARN_REGION_ENV_NAME))
            return undefined;
        if (env[NODE_USE_ARN_REGION_ENV_NAME] === "true")
            return true;
        if (env[NODE_USE_ARN_REGION_ENV_NAME] === "false")
            return false;
        throw new Error("Cannot load env " + NODE_USE_ARN_REGION_ENV_NAME + ". Expected \"true\" or \"false\", got " + env[NODE_USE_ARN_REGION_ENV_NAME] + ".");
    },
    configFileSelector: function (profile) {
        if (!Object.prototype.hasOwnProperty.call(profile, NODE_USE_ARN_REGION_INI_NAME))
            return undefined;
        if (profile[NODE_USE_ARN_REGION_INI_NAME] === "true")
            return true;
        if (profile[NODE_USE_ARN_REGION_INI_NAME] === "false")
            return false;
        throw new Error("Cannot load shared config entry " + NODE_USE_ARN_REGION_INI_NAME + ". Expected \"true\" or \"false\", got " + profile[NODE_USE_ARN_REGION_INI_NAME] + ".");
    },
    default: false,
};

/**
 * Get config value given the environment variable name or getter from
 * environment variable.
 */
var fromEnv = function (envVarSelector) { return function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    var config;
    return httpRequest$1.__generator(this, function (_a) {
        try {
            config = envVarSelector(process.env);
            if (config === undefined) {
                throw new Error();
            }
            return [2 /*return*/, config];
        }
        catch (e) {
            throw new ProviderError(e.message || "Cannot load config from environment variables with getter: " + envVarSelector);
        }
        return [2 /*return*/];
    });
}); }; };

var DEFAULT_PROFILE = "default";
var ENV_PROFILE = "AWS_PROFILE";
/**
 * Get config value from the shared config files with inferred profile name.
 */
var fromSharedConfigFiles = function (configSelector, _a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.preferredFile, preferredFile = _b === void 0 ? "config" : _b, init = httpRequest$1.__rest(_a, ["preferredFile"]);
    return function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
        var _a, loadedConfig, _b, profile, _c, configFile, credentialsFile, profileFromCredentials, profileFromConfig, mergedProfile, configValue;
        return httpRequest$1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = init.loadedConfig, loadedConfig = _a === void 0 ? loadSharedConfigFiles(init) : _a, _b = init.profile, profile = _b === void 0 ? process.env[ENV_PROFILE] || DEFAULT_PROFILE : _b;
                    return [4 /*yield*/, loadedConfig];
                case 1:
                    _c = _d.sent(), configFile = _c.configFile, credentialsFile = _c.credentialsFile;
                    profileFromCredentials = credentialsFile[profile] || {};
                    profileFromConfig = configFile[profile] || {};
                    mergedProfile = preferredFile === "config"
                        ? httpRequest$1.__assign(httpRequest$1.__assign({}, profileFromCredentials), profileFromConfig) : httpRequest$1.__assign(httpRequest$1.__assign({}, profileFromConfig), profileFromCredentials);
                    try {
                        configValue = configSelector(mergedProfile);
                        if (configValue === undefined) {
                            throw new Error();
                        }
                        return [2 /*return*/, configValue];
                    }
                    catch (e) {
                        throw new ProviderError(e.message || "Cannot load config for profile " + profile + " in SDK configuration files with getter: " + configSelector);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
};

var isFunction = function (func) { return typeof func === "function"; };
var fromStatic = function (defaultValue) {
    return isFunction(defaultValue) ? function () { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () { return httpRequest$1.__generator(this, function (_a) {
        return [2 /*return*/, defaultValue()];
    }); }); } : fromStatic$1(defaultValue);
};

var loadConfig = function (_a, configuration) {
    var environmentVariableSelector = _a.environmentVariableSelector, configFileSelector = _a.configFileSelector, defaultValue = _a.default;
    if (configuration === void 0) { configuration = {}; }
    return memoize(chain(fromEnv(environmentVariableSelector), fromSharedConfigFiles(configFileSelector, configuration), fromStatic(defaultValue)));
};

var escapeUri = function (uri) {
    // AWS percent-encodes some extra non-standard characters in a URI
    return encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
};
var hexEncode = function (c) { return "%" + c.charCodeAt(0).toString(16).toUpperCase(); };

function buildQueryString(query) {
    var e_1, _a;
    var parts = [];
    try {
        for (var _b = httpRequest$1.__values(Object.keys(query).sort()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var value = query[key];
            key = escapeUri(key);
            if (Array.isArray(value)) {
                for (var i = 0, iLen = value.length; i < iLen; i++) {
                    parts.push(key + "=" + escapeUri(value[i]));
                }
            }
            else {
                var qsEntry = key;
                if (value || typeof value === "string") {
                    qsEntry += "=" + escapeUri(value);
                }
                parts.push(qsEntry);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return parts.join("&");
}

var getTransformedHeaders = function (headers) {
    var e_1, _a;
    var transformedHeaders = {};
    try {
        for (var _b = httpRequest$1.__values(Object.keys(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var name = _c.value;
            var headerValues = headers[name];
            transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return transformedHeaders;
};

function setConnectionTimeout(request, reject, timeoutInMs) {
    if (timeoutInMs === void 0) { timeoutInMs = 0; }
    if (!timeoutInMs) {
        return;
    }
    request.on("socket", function (socket) {
        var _this = this;
        if (socket.connecting) {
            // Throw a connecting timeout error unless a connection is made within x time
            var timeoutId_1 = setTimeout(function () {
                // abort the request to destroy it
                _this.abort();
                var timeoutError = new Error("Socket timed out without establishing a connection within " + timeoutInMs + " ms");
                timeoutError.name = "TimeoutError";
                reject(timeoutError);
            }, timeoutInMs);
            // if the connection was established, cancel the timeout
            socket.on("connect", function () {
                clearTimeout(timeoutId_1);
            });
        }
    });
}

function setSocketTimeout(request, reject, timeoutInMs) {
    if (timeoutInMs === void 0) { timeoutInMs = 0; }
    request.setTimeout(timeoutInMs, function () {
        // abort the request to destroy it
        this.abort();
        var timeoutError = new Error("Connection timed out after " + timeoutInMs + " ms");
        timeoutError.name = "TimeoutError";
        reject(timeoutError);
    });
}

function writeRequestBody(httpRequest, request) {
    var expect = request.headers["Expect"] || request.headers["expect"];
    if (expect === "100-continue") {
        httpRequest.on("continue", function () {
            writeBody(httpRequest, request.body);
        });
    }
    else {
        writeBody(httpRequest, request.body);
    }
}
function writeBody(httpRequest, body) {
    if (body instanceof Stream.Readable) {
        // pipe automatically handles end
        body.pipe(httpRequest);
    }
    else if (body) {
        httpRequest.end(Buffer.from(body));
    }
    else {
        httpRequest.end();
    }
}

var NodeHttpHandler = /** @class */ (function () {
    function NodeHttpHandler(_a) {
        var _b = _a === void 0 ? {} : _a, connectionTimeout = _b.connectionTimeout, socketTimeout = _b.socketTimeout, httpAgent = _b.httpAgent, httpsAgent = _b.httpsAgent;
        // Node http handler is hard-coded to http/1.1: https://github.com/nodejs/node/blob/ff5664b83b89c55e4ab5d5f60068fb457f1f5872/lib/_http_server.js#L286
        this.metadata = { handlerProtocol: "http/1.1" };
        this.connectionTimeout = connectionTimeout;
        this.socketTimeout = socketTimeout;
        var keepAlive = true;
        this.httpAgent = httpAgent || new http.Agent({ keepAlive: keepAlive });
        this.httpsAgent = httpsAgent || new https.Agent({ keepAlive: keepAlive });
    }
    NodeHttpHandler.prototype.destroy = function () {
        this.httpAgent.destroy();
        this.httpsAgent.destroy();
    };
    NodeHttpHandler.prototype.handle = function (request, _a) {
        var _this = this;
        var abortSignal = _a.abortSignal;
        return new Promise(function (resolve, reject) {
            // if the request was already aborted, prevent doing extra work
            if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                var abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                reject(abortError);
                return;
            }
            // determine which http(s) client to use
            var isSSL = request.protocol === "https:";
            var queryString = buildQueryString(request.query || {});
            var nodeHttpsOptions = {
                headers: request.headers,
                host: request.hostname,
                method: request.method,
                path: queryString ? request.path + "?" + queryString : request.path,
                port: request.port,
                agent: isSSL ? _this.httpsAgent : _this.httpAgent,
            };
            // create the http request
            var requestFunc = isSSL ? https.request : http.request;
            var req = requestFunc(nodeHttpsOptions, function (res) {
                var httpResponse = new httpRequest$1.HttpResponse({
                    statusCode: res.statusCode || -1,
                    headers: getTransformedHeaders(res.headers),
                    body: res,
                });
                resolve({ response: httpResponse });
            });
            req.on("error", reject);
            // wire-up any timeout logic
            setConnectionTimeout(req, reject, _this.connectionTimeout);
            setSocketTimeout(req, reject, _this.socketTimeout);
            // wire-up abort logic
            if (abortSignal) {
                abortSignal.onabort = function () {
                    // ensure request is destroyed
                    req.abort();
                    var abortError = new Error("Request aborted");
                    abortError.name = "AbortError";
                    reject(abortError);
                };
            }
            writeRequestBody(req, request);
        });
    };
    return NodeHttpHandler;
}());

var Collector = /** @class */ (function (_super) {
    httpRequest$1.__extends(Collector, _super);
    function Collector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bufferedBytes = [];
        return _this;
    }
    Collector.prototype._write = function (chunk, encoding, callback) {
        this.bufferedBytes.push(chunk);
        callback();
    };
    return Collector;
}(Stream.Writable));

var streamCollector = function (stream) {
    return new Promise(function (resolve, reject) {
        var collector = new Collector();
        stream.pipe(collector);
        stream.on("error", function (err) {
            // if the source errors, the destination stream needs to manually end
            collector.end();
            reject(err);
        });
        collector.on("error", reject);
        collector.on("finish", function () {
            var bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
            resolve(bytes);
        });
    });
};

function parseQueryString(querystring) {
    var e_1, _a;
    var query = {};
    querystring = querystring.replace(/^\?/, "");
    if (querystring) {
        try {
            for (var _b = httpRequest$1.__values(querystring.split("&")), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pair = _c.value;
                var _d = httpRequest$1.__read(pair.split("="), 2), key = _d[0], _e = _d[1], value = _e === void 0 ? null : _e;
                key = decodeURIComponent(key);
                if (value) {
                    value = decodeURIComponent(value);
                }
                if (!(key in query)) {
                    query[key] = value;
                }
                else if (Array.isArray(query[key])) {
                    query[key].push(value);
                }
                else {
                    query[key] = [query[key], value];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return query;
}

var parseUrl = function (url) {
    var _a = Url.parse(url), _b = _a.hostname, hostname = _b === void 0 ? "localhost" : _b, _c = _a.pathname, pathname = _c === void 0 ? "/" : _c, port = _a.port, _d = _a.protocol, protocol = _d === void 0 ? "https:" : _d, search = _a.search;
    var query;
    if (search) {
        query = parseQueryString(search);
    }
    return {
        hostname: hostname,
        port: port ? parseInt(port) : undefined,
        protocol: protocol,
        path: pathname,
        query: query,
    };
};

/**
 * Converts a base-64 encoded string to a Uint8Array of bytes using Node.JS's
 * `buffer` module.
 *
 * @param input The base-64 encoded string
 */
function fromBase64(input) {
    var buffer = fromString(input, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
/**
 * Converts a Uint8Array of binary data to a base-64 encoded string using
 * Node.JS's `buffer` module.
 *
 * @param input The binary data to encode
 */
function toBase64(input) {
    return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
}

function calculateBodyLength(body) {
    if (!body) {
        return 0;
    }
    if (typeof body === "string") {
        return Buffer.from(body).length;
    }
    else if (typeof body.byteLength === "number") {
        // handles Uint8Array, ArrayBuffer, Buffer, and ArrayBufferView
        return body.byteLength;
    }
    else if (typeof body.size === "number") {
        return body.size;
    }
    else if (typeof body.path === "string") {
        // handles fs readable streams
        return fs.lstatSync(body.path).size;
    }
}

function defaultUserAgent(packageName, packageVersion) {
    var engine = process__default['default'].platform + "/" + process__default['default'].version;
    if (process__default['default'].env.AWS_EXECUTION_ENV) {
        engine += " exec-env/" + process__default['default'].env.AWS_EXECUTION_ENV;
    }
    return "aws-sdk-nodejs-v3-" + packageName + "/" + packageVersion + " " + engine;
}

var fromUtf8 = function (input) {
    var buf = fromString(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
var toUtf8 = function (input) {
    return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};

// Partition default templates
const AWS_TEMPLATE = "s3.{region}.amazonaws.com";
const AWS_CN_TEMPLATE = "s3.{region}.amazonaws.com.cn";
const AWS_ISO_TEMPLATE = "s3.{region}.c2s.ic.gov";
const AWS_ISO_B_TEMPLATE = "s3.{region}.sc2s.sgov.gov";
const AWS_US_GOV_TEMPLATE = "s3.{region}.amazonaws.com";
// Partition regions
const AWS_REGIONS = new Set([
    "ap-east-1",
    "ap-northeast-1",
    "ap-northeast-2",
    "ap-south-1",
    "ap-southeast-1",
    "ap-southeast-2",
    "ca-central-1",
    "eu-central-1",
    "eu-north-1",
    "eu-west-1",
    "eu-west-2",
    "eu-west-3",
    "me-south-1",
    "sa-east-1",
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
]);
const AWS_CN_REGIONS = new Set(["cn-north-1", "cn-northwest-1"]);
const AWS_ISO_REGIONS = new Set(["us-iso-east-1"]);
const AWS_ISO_B_REGIONS = new Set(["us-isob-east-1"]);
const AWS_US_GOV_REGIONS = new Set(["us-gov-east-1", "us-gov-west-1"]);
const defaultRegionInfoProvider = (region, options) => {
    let regionInfo = undefined;
    switch (region) {
        // First, try to match exact region names.
        case "ap-east-1":
            regionInfo = {
                hostname: "s3.ap-east-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "ap-northeast-1":
            regionInfo = {
                hostname: "s3.ap-northeast-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "ap-northeast-2":
            regionInfo = {
                hostname: "s3.ap-northeast-2.amazonaws.com",
                partition: "aws",
            };
            break;
        case "ap-south-1":
            regionInfo = {
                hostname: "s3.ap-south-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "ap-southeast-1":
            regionInfo = {
                hostname: "s3.ap-southeast-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "ap-southeast-2":
            regionInfo = {
                hostname: "s3.ap-southeast-2.amazonaws.com",
                partition: "aws",
            };
            break;
        case "ca-central-1":
            regionInfo = {
                hostname: "s3.ca-central-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "cn-north-1":
            regionInfo = {
                hostname: "s3.cn-north-1.amazonaws.com.cn",
                partition: "aws-cn",
            };
            break;
        case "cn-northwest-1":
            regionInfo = {
                hostname: "s3.cn-northwest-1.amazonaws.com.cn",
                partition: "aws-cn",
            };
            break;
        case "eu-central-1":
            regionInfo = {
                hostname: "s3.eu-central-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "eu-north-1":
            regionInfo = {
                hostname: "s3.eu-north-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "eu-west-1":
            regionInfo = {
                hostname: "s3.eu-west-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "eu-west-2":
            regionInfo = {
                hostname: "s3.eu-west-2.amazonaws.com",
                partition: "aws",
            };
            break;
        case "eu-west-3":
            regionInfo = {
                hostname: "s3.eu-west-3.amazonaws.com",
                partition: "aws",
            };
            break;
        case "fips-us-gov-west-1":
            regionInfo = {
                hostname: "s3-fips-us-gov-west-1.amazonaws.com",
                partition: "aws-us-gov",
                signingRegion: "us-gov-west-1",
            };
            break;
        case "me-south-1":
            regionInfo = {
                hostname: "s3.me-south-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "s3-external-1":
            regionInfo = {
                hostname: "s3-external-1.amazonaws.com",
                partition: "aws",
                signingRegion: "us-east-1",
            };
            break;
        case "sa-east-1":
            regionInfo = {
                hostname: "s3.sa-east-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "us-east-1":
            regionInfo = {
                hostname: "s3.amazonaws.com",
                partition: "aws",
            };
            break;
        case "us-east-2":
            regionInfo = {
                hostname: "s3.us-east-2.amazonaws.com",
                partition: "aws",
            };
            break;
        case "us-gov-east-1":
            regionInfo = {
                hostname: "s3.us-gov-east-1.amazonaws.com",
                partition: "aws-us-gov",
            };
            break;
        case "us-gov-west-1":
            regionInfo = {
                hostname: "s3.us-gov-west-1.amazonaws.com",
                partition: "aws-us-gov",
            };
            break;
        case "us-iso-east-1":
            regionInfo = {
                hostname: "s3.us-iso-east-1.c2s.ic.gov",
                partition: "aws-iso",
            };
            break;
        case "us-isob-east-1":
            regionInfo = {
                hostname: "s3.us-isob-east-1.sc2s.sgov.gov",
                partition: "aws-iso-b",
            };
            break;
        case "us-west-1":
            regionInfo = {
                hostname: "s3.us-west-1.amazonaws.com",
                partition: "aws",
            };
            break;
        case "us-west-2":
            regionInfo = {
                hostname: "s3.us-west-2.amazonaws.com",
                partition: "aws",
            };
            break;
        // Next, try to match partition endpoints.
        default:
            if (AWS_REGIONS.has(region)) {
                regionInfo = {
                    hostname: AWS_TEMPLATE.replace("{region}", region),
                    partition: "aws",
                };
            }
            if (AWS_CN_REGIONS.has(region)) {
                regionInfo = {
                    hostname: AWS_CN_TEMPLATE.replace("{region}", region),
                    partition: "aws-cn",
                };
            }
            if (AWS_ISO_REGIONS.has(region)) {
                regionInfo = {
                    hostname: AWS_ISO_TEMPLATE.replace("{region}", region),
                    partition: "aws-iso",
                };
            }
            if (AWS_ISO_B_REGIONS.has(region)) {
                regionInfo = {
                    hostname: AWS_ISO_B_TEMPLATE.replace("{region}", region),
                    partition: "aws-iso-b",
                };
            }
            if (AWS_US_GOV_REGIONS.has(region)) {
                regionInfo = {
                    hostname: AWS_US_GOV_TEMPLATE.replace("{region}", region),
                    partition: "aws-us-gov",
                };
            }
            // Finally, assume it's an AWS partition endpoint.
            if (regionInfo === undefined) {
                regionInfo = {
                    hostname: AWS_TEMPLATE.replace("{region}", region),
                    partition: "aws",
                };
            }
    }
    return Promise.resolve(regionInfo);
};

const ClientSharedValues = {
    apiVersion: "2006-03-01",
    disableHostPrefix: false,
    logger: {},
    regionInfoProvider: defaultRegionInfoProvider,
    signingEscapePath: false,
    signingName: "s3",
    useArnRegion: false,
};

const ClientDefaultValues = {
    ...ClientSharedValues,
    runtime: "node",
    base64Decoder: fromBase64,
    base64Encoder: toBase64,
    bodyLengthChecker: calculateBodyLength,
    credentialDefaultProvider: defaultProvider,
    defaultUserAgent: defaultUserAgent(packageInfo.name, packageInfo.version),
    eventStreamSerdeProvider,
    maxAttempts: loadConfig(configurations.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    md5: Hash.bind(null, "md5"),
    region: loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: new NodeHttpHandler(),
    sha256: Hash.bind(null, "sha256"),
    streamCollector,
    streamHasher: fileStreamHasher,
    urlParser: parseUrl,
    useArnRegion: loadConfig(NODE_USE_ARN_REGION_CONFIG_OPTIONS),
    utf8Decoder: fromUtf8,
    utf8Encoder: toUtf8,
};

var resolveEventStreamSerdeConfig = function (input) { return (httpRequest$1.__assign(httpRequest$1.__assign({}, input), { eventStreamMarshaller: input.eventStreamSerdeProvider(input) })); };

var CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
    var _this = this;
    return function (next) { return function (args) { return httpRequest$1.__awaiter(_this, void 0, void 0, function () {
        var request, body, headers, length;
        var _a;
        return httpRequest$1.__generator(this, function (_b) {
            request = args.request;
            if (httpRequest$1.HttpRequest.isInstance(request)) {
                body = request.body, headers = request.headers;
                if (body &&
                    Object.keys(headers)
                        .map(function (str) { return str.toLowerCase(); })
                        .indexOf(CONTENT_LENGTH_HEADER) === -1) {
                    length = bodyLengthChecker(body);
                    if (length !== undefined) {
                        request.headers = httpRequest$1.__assign(httpRequest$1.__assign({}, request.headers), (_a = {}, _a[CONTENT_LENGTH_HEADER] = String(length), _a));
                    }
                }
            }
            return [2 /*return*/, next(httpRequest$1.__assign(httpRequest$1.__assign({}, args), { request: request }))];
        });
    }); }; };
}
var contentLengthMiddlewareOptions = {
    step: "build",
    tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
    name: "contentLengthMiddleware",
};
var getContentLengthPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
    },
}); };

function addExpectContinueMiddleware(options) {
    var _this = this;
    return function (next) { return function (args) { return httpRequest$1.__awaiter(_this, void 0, void 0, function () {
        var request;
        return httpRequest$1.__generator(this, function (_a) {
            request = args.request;
            if (httpRequest$1.HttpRequest.isInstance(request) && request.body && options.runtime === "node") {
                request.headers = httpRequest$1.__assign(httpRequest$1.__assign({}, request.headers), { Expect: "100-continue" });
            }
            return [2 /*return*/, next(httpRequest$1.__assign(httpRequest$1.__assign({}, args), { request: request }))];
        });
    }); }; };
}
var addExpectContinueMiddlewareOptions = {
    step: "build",
    tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
    name: "addExpectContinueMiddleware",
};
var getAddExpectContinuePlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(addExpectContinueMiddleware(options), addExpectContinueMiddlewareOptions);
    },
}); };

function resolveHostHeaderConfig(input) {
    return input;
}
var hostHeaderMiddleware = function (options) { return function (next) { return function (args) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    var request, _a, handlerProtocol;
    return httpRequest$1.__generator(this, function (_b) {
        if (!httpRequest$1.HttpRequest.isInstance(args.request))
            return [2 /*return*/, next(args)];
        request = args.request;
        _a = (options.requestHandler.metadata || {}).handlerProtocol, handlerProtocol = _a === void 0 ? "" : _a;
        //For H2 request, remove 'host' header and use ':authority' header instead
        //reference: https://nodejs.org/dist/latest-v13.x/docs/api/errors.html#ERR_HTTP2_INVALID_CONNECTION_HEADERS
        if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
            delete request.headers["host"];
            request.headers[":authority"] = "";
            //non-H2 request and 'host' header is not set, set the 'host' header to request's hostname.
        }
        else if (!request.headers["host"]) {
            request.headers["host"] = request.hostname;
        }
        return [2 /*return*/, next(args)];
    });
}); }; }; };
var hostHeaderMiddlewareOptions = {
    name: "hostHeaderMiddleware",
    step: "build",
    priority: "low",
    tags: ["HOST"],
};
var getHostHeaderPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
    },
}); };

var loggerMiddleware = function () { return function (next, context) { return function (args) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    var logger, response, $metadata;
    return httpRequest$1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = context.logger;
                return [4 /*yield*/, next(args)];
            case 1:
                response = _a.sent();
                if (!logger) {
                    return [2 /*return*/, response];
                }
                $metadata = response.output.$metadata;
                // TODO: Populate custom metadata in https://github.com/aws/aws-sdk-js-v3/issues/1491#issuecomment-692174256
                // $metadata will be removed in https://github.com/aws/aws-sdk-js-v3/issues/1490
                if (typeof logger.info === "function") {
                    logger.info({
                        $metadata: $metadata,
                    });
                }
                return [2 /*return*/, response];
        }
    });
}); }; }; };
var loggerMiddlewareOptions = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "build",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var getLoggerPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
    },
}); };

function validateBucketNameMiddleware() {
    var _this = this;
    return function (next) { return function (args) { return httpRequest$1.__awaiter(_this, void 0, void 0, function () {
        var Bucket, err;
        return httpRequest$1.__generator(this, function (_a) {
            Bucket = args.input.Bucket;
            if (typeof Bucket === "string" && !lazyJson.validate(Bucket) && Bucket.indexOf("/") >= 0) {
                err = new Error("Bucket name shouldn't contain '/', received '" + Bucket + "'");
                err.name = "InvalidBucketName";
                throw err;
            }
            return [2 /*return*/, next(httpRequest$1.__assign({}, args))];
        });
    }); }; };
}
var validateBucketNameMiddlewareOptions = {
    step: "initialize",
    tags: ["VALIDATE_BUCKET_NAME"],
    name: "validateBucketNameMiddleware",
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var getValidateBucketNamePlugin = function (unused) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(validateBucketNameMiddleware(), validateBucketNameMiddlewareOptions);
    },
}); };

var useRegionalEndpointMiddleware = function (config) { return function (next) { return function (args) { return httpRequest$1.__awaiter(void 0, void 0, void 0, function () {
    var request, _a;
    return httpRequest$1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                request = args.request;
                if (!httpRequest$1.HttpRequest.isInstance(request) || config.isCustomEndpoint)
                    return [2 /*return*/, next(httpRequest$1.__assign({}, args))];
                if (!(request.hostname === "s3.amazonaws.com")) return [3 /*break*/, 1];
                request.hostname = "s3.us-east-1.amazonaws.com";
                return [3 /*break*/, 3];
            case 1:
                _a = "aws-global";
                return [4 /*yield*/, config.region()];
            case 2:
                if (_a === (_b.sent())) {
                    request.hostname = "s3.amazonaws.com";
                }
                _b.label = 3;
            case 3: return [2 /*return*/, next(httpRequest$1.__assign({}, args))];
        }
    });
}); }; }; };
var useRegionalEndpointMiddlewareOptions = {
    step: "build",
    tags: ["USE_REGIONAL_ENDPOINT", "S3"],
    name: "useRegionalEndpointMiddleware",
};
var getUseRegionalEndpointPlugin = function (config) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(useRegionalEndpointMiddleware(config), useRegionalEndpointMiddlewareOptions);
    },
}); };

var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
    authorization: true,
    "cache-control": true,
    connection: true,
    expect: true,
    from: true,
    "keep-alive": true,
    "max-forwards": true,
    pragma: true,
    referer: true,
    te: true,
    trailer: true,
    "transfer-encoding": true,
    upgrade: true,
    "user-agent": true,
    "x-amzn-trace-id": true,
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

var signingKeyCache = {};
var cacheQueue = [];
/**
 * Create a string describing the scope of credentials used to sign a request.
 *
 * @param shortDate The current calendar date in the form YYYYMMDD.
 * @param region    The AWS region in which the service resides.
 * @param service   The service to which the signed request is being sent.
 */
function createScope(shortDate, region, service) {
    return shortDate + "/" + region + "/" + service + "/" + KEY_TYPE_IDENTIFIER;
}
/**
 * Derive a signing key from its composite parts
 *
 * @param sha256Constructor A constructor function that can instantiate SHA-256
 *                          hash objects.
 * @param credentials       The credentials with which the request will be
 *                          signed.
 * @param shortDate         The current calendar date in the form YYYYMMDD.
 * @param region            The AWS region in which the service resides.
 * @param service           The service to which the signed request is being
 *                          sent.
 */
function getSigningKey(sha256Constructor, credentials, shortDate, region, service) {
    var cacheKey = shortDate + ":" + region + ":" + service + ":" + (credentials.accessKeyId + ":" + credentials.sessionToken);
    if (cacheKey in signingKeyCache) {
        return signingKeyCache[cacheKey];
    }
    cacheQueue.push(cacheKey);
    while (cacheQueue.length > MAX_CACHE_SIZE) {
        delete signingKeyCache[cacheQueue.shift()];
    }
    return (signingKeyCache[cacheKey] = new Promise(function (resolve, reject) {
        var e_1, _a;
        var keyPromise = Promise.resolve("AWS4" + credentials.secretAccessKey);
        var _loop_1 = function (signable) {
            keyPromise = keyPromise.then(function (intermediateKey) { return hmac(sha256Constructor, intermediateKey, signable); });
            keyPromise.catch(function () { });
        };
        try {
            for (var _b = httpRequest$1.__values([shortDate, region, service, KEY_TYPE_IDENTIFIER]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var signable = _c.value;
                _loop_1(signable);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        keyPromise.then(resolve, function (reason) {
            delete signingKeyCache[cacheKey];
            reject(reason);
        });
    }));
}
function hmac(ctor, secret, data) {
    var hash = new ctor(secret);
    hash.update(data);
    return hash.digest();
}

/**
 * @internal
 */
function getCanonicalHeaders(_a, unsignableHeaders, signableHeaders) {
    var e_1, _b;
    var headers = _a.headers;
    var canonical = {};
    try {
        for (var _c = httpRequest$1.__values(Object.keys(headers).sort()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var headerName = _d.value;
            var canonicalHeaderName = headerName.toLowerCase();
            if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || (unsignableHeaders === null || unsignableHeaders === void 0 ? void 0 : unsignableHeaders.has(canonicalHeaderName)) ||
                PROXY_HEADER_PATTERN.test(canonicalHeaderName) ||
                SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
                if (!signableHeaders || (signableHeaders && !signableHeaders.has(canonicalHeaderName))) {
                    continue;
                }
            }
            canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return canonical;
}

/**
 * @internal
 */
function getCanonicalQuery(_a) {
    var e_1, _b;
    var _c = _a.query, query = _c === void 0 ? {} : _c;
    var keys = [];
    var serialized = {};
    var _loop_1 = function (key) {
        if (key.toLowerCase() === SIGNATURE_HEADER) {
            return "continue";
        }
        keys.push(key);
        var value = query[key];
        if (typeof value === "string") {
            serialized[key] = escapeUri(key) + "=" + escapeUri(value);
        }
        else if (Array.isArray(value)) {
            serialized[key] = value
                .slice(0)
                .sort()
                .reduce(function (encoded, value) { return encoded.concat([escapeUri(key) + "=" + escapeUri(value)]); }, [])
                .join("&");
        }
    };
    try {
        for (var _d = httpRequest$1.__values(Object.keys(query).sort()), _e = _d.next(); !_e.done; _e = _d.next()) {
            var key = _e.value;
            _loop_1(key);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return keys
        .map(function (key) { return serialized[key]; })
        .filter(function (serialized) { return serialized; }) // omit any falsy values
        .join("&");
}

/**
 * @internal
 */
function getPayloadHash(_a, hashConstructor) {
    var headers = _a.headers, body = _a.body;
    return httpRequest$1.__awaiter(this, void 0, void 0, function () {
        var _b, _c, headerName, hashCtor, _d;
        var e_1, _e;
        return httpRequest$1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    try {
                        for (_b = httpRequest$1.__values(Object.keys(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            headerName = _c.value;
                            if (headerName.toLowerCase() === SHA256_HEADER) {
                                return [2 /*return*/, headers[headerName]];
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_e = _b.return)) _e.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (!(body == undefined)) return [3 /*break*/, 1];
                    return [2 /*return*/, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"];
                case 1:
                    if (!(typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body))) return [3 /*break*/, 3];
                    hashCtor = new hashConstructor();
                    hashCtor.update(body);
                    _d = toHex;
                    return [4 /*yield*/, hashCtor.digest()];
                case 2: return [2 /*return*/, _d.apply(void 0, [_f.sent()])];
                case 3: 
                // As any defined body that is not a string or binary data is a stream, this
                // body is unsignable. Attempt to send the request with an unsigned payload,
                // which may or may not be accepted by the service.
                return [2 /*return*/, UNSIGNED_PAYLOAD];
            }
        });
    });
}

function hasHeader(soughtHeader, headers) {
    var e_1, _a;
    soughtHeader = soughtHeader.toLowerCase();
    try {
        for (var _b = httpRequest$1.__values(Object.keys(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var headerName = _c.value;
            if (soughtHeader === headerName.toLowerCase()) {
                return true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return false;
}

/**
 * @internal
 */
function cloneRequest(_a) {
    var headers = _a.headers, query = _a.query, rest = httpRequest$1.__rest(_a, ["headers", "query"]);
    return httpRequest$1.__assign(httpRequest$1.__assign({}, rest), { headers: httpRequest$1.__assign({}, headers), query: query ? cloneQuery(query) : undefined });
}
function cloneQuery(query) {
    return Object.keys(query).reduce(function (carry, paramName) {
        var _a;
        var param = query[paramName];
        return httpRequest$1.__assign(httpRequest$1.__assign({}, carry), (_a = {}, _a[paramName] = Array.isArray(param) ? httpRequest$1.__spread(param) : param, _a));
    }, {});
}

/**
 * @internal
 */
function moveHeadersToQuery(request) {
    var e_1, _a;
    var _b = typeof request.clone === "function" ? request.clone() : cloneRequest(request), headers = _b.headers, _c = _b.query, query = _c === void 0 ? {} : _c;
    try {
        for (var _d = httpRequest$1.__values(Object.keys(headers)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var name = _e.value;
            var lname = name.toLowerCase();
            if (lname.substr(0, 6) === "x-amz-") {
                query[name] = headers[name];
                delete headers[name];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return httpRequest$1.__assign(httpRequest$1.__assign({}, request), { headers: headers,
        query: query });
}

/**
 * @internal
 */
function prepareRequest(request) {
    var e_1, _a;
    // Create a clone of the request object that does not clone the body
    request = typeof request.clone === "function" ? request.clone() : cloneRequest(request);
    try {
        for (var _b = httpRequest$1.__values(Object.keys(request.headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var headerName = _c.value;
            if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
                delete request.headers[headerName];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return request;
}

function iso8601(time) {
    return toDate(time)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z");
}
function toDate(time) {
    if (typeof time === "number") {
        return new Date(time * 1000);
    }
    if (typeof time === "string") {
        if (Number(time)) {
            return new Date(Number(time) * 1000);
        }
        return new Date(time);
    }
    return time;
}

var SignatureV4 = /** @class */ (function () {
    function SignatureV4(_a) {
        var applyChecksum = _a.applyChecksum, credentials = _a.credentials, region = _a.region, service = _a.service, sha256 = _a.sha256, _b = _a.uriEscapePath, uriEscapePath = _b === void 0 ? true : _b;
        this.service = service;
        this.sha256 = sha256;
        this.uriEscapePath = uriEscapePath;
        // default to true if applyChecksum isn't set
        this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
        this.regionProvider = normalizeRegionProvider(region);
        this.credentialProvider = normalizeCredentialsProvider(credentials);
    }
    SignatureV4.prototype.presign = function (originalRequest, options) {
        if (options === void 0) { options = {}; }
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            var _a, signingDate, _b, expiresIn, unsignableHeaders, signableHeaders, signingRegion, signingService, credentials, region, _c, _d, longDate, shortDate, scope, request, canonicalHeaders, _e, _f, _g, _h, _j, _k;
            return httpRequest$1.__generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _a = options.signingDate, signingDate = _a === void 0 ? new Date() : _a, _b = options.expiresIn, expiresIn = _b === void 0 ? 3600 : _b, unsignableHeaders = options.unsignableHeaders, signableHeaders = options.signableHeaders, signingRegion = options.signingRegion, signingService = options.signingService;
                        return [4 /*yield*/, this.credentialProvider()];
                    case 1:
                        credentials = _l.sent();
                        if (!(signingRegion !== null && signingRegion !== void 0)) return [3 /*break*/, 2];
                        _c = signingRegion;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.regionProvider()];
                    case 3:
                        _c = (_l.sent());
                        _l.label = 4;
                    case 4:
                        region = _c;
                        _d = formatDate(signingDate), longDate = _d.longDate, shortDate = _d.shortDate;
                        if (expiresIn > MAX_PRESIGNED_TTL) {
                            return [2 /*return*/, Promise.reject("Signature version 4 presigned URLs" + " must have an expiration date less than one week in" + " the future")];
                        }
                        scope = createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
                        request = moveHeadersToQuery(prepareRequest(originalRequest));
                        if (credentials.sessionToken) {
                            request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
                        }
                        request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
                        request.query[CREDENTIAL_QUERY_PARAM] = credentials.accessKeyId + "/" + scope;
                        request.query[AMZ_DATE_QUERY_PARAM] = longDate;
                        request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
                        canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
                        request.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
                        _e = request.query;
                        _f = SIGNATURE_QUERY_PARAM;
                        _g = this.getSignature;
                        _h = [longDate,
                            scope,
                            this.getSigningKey(credentials, region, shortDate, signingService)];
                        _j = this.createCanonicalRequest;
                        _k = [request, canonicalHeaders];
                        return [4 /*yield*/, getPayloadHash(originalRequest, this.sha256)];
                    case 5: return [4 /*yield*/, _g.apply(this, _h.concat([_j.apply(this, _k.concat([_l.sent()]))]))];
                    case 6:
                        _e[_f] = _l.sent();
                        return [2 /*return*/, request];
                }
            });
        });
    };
    SignatureV4.prototype.sign = function (toSign, options) {
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            return httpRequest$1.__generator(this, function (_a) {
                if (typeof toSign === "string") {
                    return [2 /*return*/, this.signString(toSign, options)];
                }
                else if (toSign.headers && toSign.payload) {
                    return [2 /*return*/, this.signEvent(toSign, options)];
                }
                else {
                    return [2 /*return*/, this.signRequest(toSign, options)];
                }
            });
        });
    };
    SignatureV4.prototype.signEvent = function (_a, _b) {
        var headers = _a.headers, payload = _a.payload;
        var _c = _b.signingDate, signingDate = _c === void 0 ? new Date() : _c, priorSignature = _b.priorSignature, signingRegion = _b.signingRegion, signingService = _b.signingService;
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            var region, _d, _e, shortDate, longDate, scope, hashedPayload, hash, hashedHeaders, _f, stringToSign;
            return httpRequest$1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!(signingRegion !== null && signingRegion !== void 0)) return [3 /*break*/, 1];
                        _d = signingRegion;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.regionProvider()];
                    case 2:
                        _d = (_g.sent());
                        _g.label = 3;
                    case 3:
                        region = _d;
                        _e = formatDate(signingDate), shortDate = _e.shortDate, longDate = _e.longDate;
                        scope = createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
                        return [4 /*yield*/, getPayloadHash({ headers: {}, body: payload }, this.sha256)];
                    case 4:
                        hashedPayload = _g.sent();
                        hash = new this.sha256();
                        hash.update(headers);
                        _f = toHex;
                        return [4 /*yield*/, hash.digest()];
                    case 5:
                        hashedHeaders = _f.apply(void 0, [_g.sent()]);
                        stringToSign = [
                            EVENT_ALGORITHM_IDENTIFIER,
                            longDate,
                            scope,
                            priorSignature,
                            hashedHeaders,
                            hashedPayload,
                        ].join("\n");
                        return [2 /*return*/, this.signString(stringToSign, { signingDate: signingDate, signingRegion: region, signingService: signingService })];
                }
            });
        });
    };
    SignatureV4.prototype.signString = function (stringToSign, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.signingDate, signingDate = _c === void 0 ? new Date() : _c, signingRegion = _b.signingRegion, signingService = _b.signingService;
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            var credentials, region, _d, shortDate, hash, _e, _f, _g;
            return httpRequest$1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, this.credentialProvider()];
                    case 1:
                        credentials = _h.sent();
                        if (!(signingRegion !== null && signingRegion !== void 0)) return [3 /*break*/, 2];
                        _d = signingRegion;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.regionProvider()];
                    case 3:
                        _d = (_h.sent());
                        _h.label = 4;
                    case 4:
                        region = _d;
                        shortDate = formatDate(signingDate).shortDate;
                        _f = (_e = this.sha256).bind;
                        return [4 /*yield*/, this.getSigningKey(credentials, region, shortDate, signingService)];
                    case 5:
                        hash = new (_f.apply(_e, [void 0, _h.sent()]))();
                        hash.update(stringToSign);
                        _g = toHex;
                        return [4 /*yield*/, hash.digest()];
                    case 6: return [2 /*return*/, _g.apply(void 0, [_h.sent()])];
                }
            });
        });
    };
    SignatureV4.prototype.signRequest = function (requestToSign, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.signingDate, signingDate = _c === void 0 ? new Date() : _c, signableHeaders = _b.signableHeaders, unsignableHeaders = _b.unsignableHeaders, signingRegion = _b.signingRegion, signingService = _b.signingService;
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            var credentials, region, _d, request, _e, longDate, shortDate, scope, payloadHash, canonicalHeaders, signature;
            return httpRequest$1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.credentialProvider()];
                    case 1:
                        credentials = _f.sent();
                        if (!(signingRegion !== null && signingRegion !== void 0)) return [3 /*break*/, 2];
                        _d = signingRegion;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.regionProvider()];
                    case 3:
                        _d = (_f.sent());
                        _f.label = 4;
                    case 4:
                        region = _d;
                        request = prepareRequest(requestToSign);
                        _e = formatDate(signingDate), longDate = _e.longDate, shortDate = _e.shortDate;
                        scope = createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
                        request.headers[AMZ_DATE_HEADER] = longDate;
                        if (credentials.sessionToken) {
                            request.headers[TOKEN_HEADER] = credentials.sessionToken;
                        }
                        return [4 /*yield*/, getPayloadHash(request, this.sha256)];
                    case 5:
                        payloadHash = _f.sent();
                        if (!hasHeader(SHA256_HEADER, request.headers) && this.applyChecksum) {
                            request.headers[SHA256_HEADER] = payloadHash;
                        }
                        canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
                        return [4 /*yield*/, this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash))];
                    case 6:
                        signature = _f.sent();
                        request.headers[AUTH_HEADER] =
                            ALGORITHM_IDENTIFIER + " " +
                                ("Credential=" + credentials.accessKeyId + "/" + scope + ", ") +
                                ("SignedHeaders=" + getCanonicalHeaderList(canonicalHeaders) + ", ") +
                                ("Signature=" + signature);
                        return [2 /*return*/, request];
                }
            });
        });
    };
    SignatureV4.prototype.createCanonicalRequest = function (request, canonicalHeaders, payloadHash) {
        var sortedHeaders = Object.keys(canonicalHeaders).sort();
        return request.method + "\n" + this.getCanonicalPath(request) + "\n" + getCanonicalQuery(request) + "\n" + sortedHeaders.map(function (name) { return name + ":" + canonicalHeaders[name]; }).join("\n") + "\n\n" + sortedHeaders.join(";") + "\n" + payloadHash;
    };
    SignatureV4.prototype.createStringToSign = function (longDate, credentialScope, canonicalRequest) {
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            var hash, hashedRequest;
            return httpRequest$1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = new this.sha256();
                        hash.update(canonicalRequest);
                        return [4 /*yield*/, hash.digest()];
                    case 1:
                        hashedRequest = _a.sent();
                        return [2 /*return*/, ALGORITHM_IDENTIFIER + "\n" + longDate + "\n" + credentialScope + "\n" + toHex(hashedRequest)];
                }
            });
        });
    };
    SignatureV4.prototype.getCanonicalPath = function (_a) {
        var path = _a.path;
        if (this.uriEscapePath) {
            var doubleEncoded = encodeURIComponent(path.replace(/^\//, ""));
            return "/" + doubleEncoded.replace(/%2F/g, "/");
        }
        return path;
    };
    SignatureV4.prototype.getSignature = function (longDate, credentialScope, keyPromise, canonicalRequest) {
        return httpRequest$1.__awaiter(this, void 0, void 0, function () {
            var stringToSign, hash, _a, _b, _c;
            return httpRequest$1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.createStringToSign(longDate, credentialScope, canonicalRequest)];
                    case 1:
                        stringToSign = _d.sent();
                        _b = (_a = this.sha256).bind;
                        return [4 /*yield*/, keyPromise];
                    case 2:
                        hash = new (_b.apply(_a, [void 0, _d.sent()]))();
                        hash.update(stringToSign);
                        _c = toHex;
                        return [4 /*yield*/, hash.digest()];
                    case 3: return [2 /*return*/, _c.apply(void 0, [_d.sent()])];
                }
            });
        });
    };
    SignatureV4.prototype.getSigningKey = function (credentials, region, shortDate, service) {
        return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
    };
    return SignatureV4;
}());
var formatDate = function (now) {
    var longDate = iso8601(now).replace(/[\-:]/g, "");
    return {
        longDate: longDate,
        shortDate: longDate.substr(0, 8),
    };
};
var getCanonicalHeaderList = function (headers) { return Object.keys(headers).sort().join(";"); };
var normalizeRegionProvider = function (region) {
    if (typeof region === "string") {
        var promisified_1 = Promise.resolve(region);
        return function () { return promisified_1; };
    }
    else {
        return region;
    }
};
var normalizeCredentialsProvider = function (credentials) {
    if (typeof credentials === "object") {
        var promisified_2 = Promise.resolve(credentials);
        return function () { return promisified_2; };
    }
    else {
        return credentials;
    }
};

function resolveAwsAuthConfig(input) {
    var _this = this;
    var credentials = input.credentials || input.credentialDefaultProvider(input);
    var normalizedCreds = normalizeProvider(credentials);
    var _a = input.signingEscapePath, signingEscapePath = _a === void 0 ? true : _a, _b = input.systemClockOffset, systemClockOffset = _b === void 0 ? input.systemClockOffset || 0 : _b, sha256 = input.sha256;
    var signer;
    if (input.signer) {
        //if signer is supplied by user, normalize it to a function returning a promise for signer.
        signer = normalizeProvider(input.signer);
    }
    else {
        //construct a provider inferring signing from region.
        signer = function () {
            return normalizeProvider(input.region)()
                .then(function (region) { return httpRequest$1.__awaiter(_this, void 0, void 0, function () { return httpRequest$1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, input.regionInfoProvider(region)];
                    case 1: return [2 /*return*/, [(_a.sent()) || {}, region]];
                }
            }); }); })
                .then(function (_a) {
                var _b = httpRequest$1.__read(_a, 2), regionInfo = _b[0], region = _b[1];
                var _c = regionInfo.signingRegion, signingRegion = _c === void 0 ? input.signingRegion : _c, _d = regionInfo.signingService, signingService = _d === void 0 ? input.signingName : _d;
                //update client's singing region and signing service config if they are resolved.
                //signing region resolving order: user supplied signingRegion -> endpoints.json inferred region -> client region
                input.signingRegion = input.signingRegion || signingRegion || region;
                input.signingName = input.signingName || signingService;
                return new SignatureV4({
                    credentials: normalizedCreds,
                    region: input.signingRegion,
                    service: input.signingName,
                    sha256: sha256,
                    uriEscapePath: signingEscapePath,
                });
            });
        };
    }
    return httpRequest$1.__assign(httpRequest$1.__assign({}, input), { systemClockOffset: systemClockOffset,
        signingEscapePath: signingEscapePath, credentials: normalizedCreds, signer: signer });
}
function normalizeProvider(input) {
    if (typeof input === "object") {
        var promisified_1 = Promise.resolve(input);
        return function () { return promisified_1; };
    }
    return input;
}

var isClockSkewed = function (newServerTime, systemClockOffset) {
    return Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - newServerTime) >= 300000;
};
var getSkewCorrectedDate = function (systemClockOffset) { return new Date(Date.now() + systemClockOffset); };
function awsAuthMiddleware(options) {
    return function (next, context) {
        return function (args) {
            return httpRequest$1.__awaiter(this, void 0, void 0, function () {
                var signer, _a, output, _b, _c, headers, dateHeader, serverTime;
                var _d;
                return httpRequest$1.__generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!httpRequest$1.HttpRequest.isInstance(args.request))
                                return [2 /*return*/, next(args)];
                            if (!(typeof options.signer === "function")) return [3 /*break*/, 2];
                            return [4 /*yield*/, options.signer()];
                        case 1:
                            _a = _e.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = options.signer;
                            _e.label = 3;
                        case 3:
                            signer = _a;
                            _b = next;
                            _c = [httpRequest$1.__assign({}, args)];
                            _d = {};
                            return [4 /*yield*/, signer.sign(args.request, {
                                    signingDate: new Date(Date.now() + options.systemClockOffset),
                                    signingRegion: context["signing_region"],
                                    signingService: context["signing_service"],
                                })];
                        case 4: return [4 /*yield*/, _b.apply(void 0, [httpRequest$1.__assign.apply(void 0, _c.concat([(_d.request = _e.sent(), _d)]))])];
                        case 5:
                            output = _e.sent();
                            headers = output.response.headers;
                            dateHeader = headers && (headers.date || headers.Date);
                            if (dateHeader) {
                                serverTime = Date.parse(dateHeader);
                                if (isClockSkewed(serverTime, options.systemClockOffset)) {
                                    options.systemClockOffset = serverTime - Date.now();
                                }
                            }
                            return [2 /*return*/, output];
                    }
                });
            });
        };
    };
}
var awsAuthMiddlewareOptions = {
    name: "awsAuthMiddleware",
    tags: ["SIGNATURE", "AWSAUTH"],
    relation: "after",
    toMiddleware: "retryMiddleware",
};
var getAwsAuthPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.addRelativeTo(awsAuthMiddleware(options), awsAuthMiddlewareOptions);
    },
}); };

function resolveUserAgentConfig(input) {
    return input;
}

function userAgentMiddleware(options) {
    return function (next) { return function (args) {
        var request = args.request;
        if (!httpRequest$1.HttpRequest.isInstance(request))
            return next(args);
        var headers = request.headers;
        var userAgentHeader = options.runtime === "node" ? "user-agent" : "x-amz-user-agent";
        if (!headers[userAgentHeader]) {
            headers[userAgentHeader] = "" + options.defaultUserAgent;
        }
        else {
            headers[userAgentHeader] += " " + options.defaultUserAgent;
        }
        if (options.customUserAgent) {
            headers[userAgentHeader] += " " + options.customUserAgent;
        }
        return next(httpRequest$1.__assign(httpRequest$1.__assign({}, args), { request: request }));
    }; };
}
var getUserAgentMiddlewareOptions = {
    name: "getUserAgentMiddleware",
    step: "build",
    tags: ["SET_USER_AGENT", "USER_AGENT"],
};
var getUserAgentPlugin = function (config) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
    },
}); };

/**
 * <p></p>
 */
class S3Client extends lazyJson.Client {
    constructor(configuration) {
        let _config_0 = {
            ...ClientDefaultValues,
            ...configuration,
        };
        let _config_1 = resolveRegionConfig(_config_0);
        let _config_2 = resolveEndpointsConfig(_config_1);
        let _config_3 = resolveAwsAuthConfig(_config_2);
        let _config_4 = configurations.resolveRetryConfig(_config_3);
        let _config_5 = resolveUserAgentConfig(_config_4);
        let _config_6 = resolveBucketEndpointConfig(_config_5);
        let _config_7 = resolveHostHeaderConfig(_config_6);
        let _config_8 = resolveEventStreamSerdeConfig(_config_7);
        super(_config_8);
        this.config = _config_8;
        this.middlewareStack.use(getAwsAuthPlugin(this.config));
        this.middlewareStack.use(configurations.getRetryPlugin(this.config));
        this.middlewareStack.use(getUserAgentPlugin(this.config));
        this.middlewareStack.use(getContentLengthPlugin(this.config));
        this.middlewareStack.use(getValidateBucketNamePlugin(this.config));
        this.middlewareStack.use(getUseRegionalEndpointPlugin(this.config));
        this.middlewareStack.use(getAddExpectContinuePlugin(this.config));
        this.middlewareStack.use(getHostHeaderPlugin(this.config));
        this.middlewareStack.use(getLoggerPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}

exports.S3Client = S3Client;
