'use strict';

var index = require('./index-4d1c10fe.js');
require('./lazy-json-37175b28.js');
require('./httpRequest-79d7914f.js');
require('./default-handler-1d169422.js');
require('./prerender-manifest.json');
require('./manifest.json');
require('./routes-manifest.json');
require('stream');
require('zlib');
require('http');
require('perf_hooks');
require('buffer');
require('util');
require('crypto');

class PutObjectCommand extends index.Command {
    // Start section: command_properties
    // End section: command_properties
    constructor(input) {
        // Start section: command_constructor
        super();
        this.input = input;
        // End section: command_constructor
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(index.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(index.getSsecPlugin(configuration));
        this.middlewareStack.use(index.getBucketEndpointPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const handlerExecutionContext = {
            logger,
            clientName: "S3Client",
            commandName: "PutObjectCommand",
            inputFilterSensitiveLog: index.PutObjectRequest.filterSensitiveLog,
            outputFilterSensitiveLog: index.PutObjectOutput.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return index.serializeAws_restXmlPutObjectCommand(input, context);
    }
    deserialize(output, context) {
        return index.deserializeAws_restXmlPutObjectCommand(output, context);
    }
}

exports.PutObjectCommand = PutObjectCommand;
