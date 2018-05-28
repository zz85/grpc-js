/*

pbjs -t json-module -w commonjs -o proto-descriptors.js service.proto
pbjs -t static-module -w commonjs -o proto-static.js service.proto
pbts -o proto-static.d.ts proto-static.js

pb {
    Namespace | Type | Service | Method
}

*/

const grpc = require('grpc');
const protobuf = require('protobufjs');

function walkTypes(node, ns, handler) {
    const fqName = ns.join('.');
    /*
    console.log(`> ${fqName}`)
    if (node instanceof protobuf.Service) {
        console.log('service');
    } else if (node instanceof protobuf.Type) {
        console.log('type');
    } else if (node instanceof protobuf.Namespace) {
        console.log('namespace');
    }*/

    handler && handler(node, fqName);
    const nested = node.nested;
    if (nested) {
        const keys = Object.keys(nested)
        keys.forEach(key => walkTypes(nested[key], [...ns, key], handler))
    }
}

const root = require('./proto/proto-descriptors')

function findServices() {
    const services = [];

    walkTypes(root, [], (node, name) => {
        if (node instanceof protobuf.Service) {
            node.fqName = name;
            services.push(node);
        }
    });

    console.log('services', services);
    services.forEach(handleService);
}

function handleService(service) {
    const methods = service.methods;
    const templates = {};

    Object.keys(methods).forEach(name => {
        const props = methods[name];
        const path = service.fqName + '/' + name;
        console.log(path, props);
        // responseType

        const requestStream = !!props.requestStream;
        const responseStream = !!props.responseStream;
        const requestType = root.lookupType(props.requestType);
        const responseType = root.lookupType(props.responseType);
        const passThrough = input => input;
        templates[name] = {
            path,
            requestStream,
            responseStream,
            requestType,
            responseType,
            requestSerialize: passThrough,
            requestDeserialize: passThrough,
            responseSerialize: passThrough,
            responseDeserialize: passThrough
        };
    });

    // TODO generate typescript interfaces

    const Client = grpc.makeGenericClientConstructor(templates);
    serviceClients[service.name] = Client;
}

const serviceClients = {};
findServices();

console.log('serviceClients', serviceClients);

let repl = require('repl');

let replOpts = {
    prompt: '>',
    ignoreUndefined: true,
    replMode: repl.REPL_MODE_MAGIC,
};

let rs = repl.start(replOpts);
rs.context.serviceClients = serviceClients;

// connect
client = new serviceClients.SimpleService('localhost:50052', grpc.credentials.createInsecure());

client.SimpleCall(client.SimpleCall.requestType.create().finish(), (err, result) => {
    const results = client.SimpleCall.responseType.decode(result);
})

const static = require('./proto/proto-static');
// const moo = new static.zz85.SimpleService()
const x = static.SimpleRequest.create();