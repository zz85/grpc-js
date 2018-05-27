/*

pbjs -t json-module -w commonjs -o proto-descriptors.js service.proto
pbjs -t static-module -w commonjs -o proto-static.js service.proto
pbts -o proto-static.d.ts proto-static.js

pb {
    Namespace | Type | Service | Method
}

*/

const protobuf = require('protobufjs');

function walkTypes(node, ns) {
    console.log(`> ${ns.join('.')}`)
    if (node instanceof protobuf.Service) {
        console.log('service');
    } else if (node instanceof protobuf.Type) {
        console.log('type');
    } else if (node instanceof protobuf.Namespace) {
        console.log('namespace');
    }
    const nested = node.nested;
    if (nested) {
        const keys = Object.keys(nested)
        keys.forEach(key => walkTypes(nested[key], [...ns, key]))
    }
}

const root = require('./proto/proto-descriptors')

walkTypes(root, []);