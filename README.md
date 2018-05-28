# gRPC + NodeJS + protobufJS + TypeScript

There are [2 common approaches](https://grpc.io/docs/tutorials/basic/node.html) to using gRPC with Node.js, the static codegen and the dynamic codegen approaches.

The static codegen using the `protoc` tool, and requires importing the `google-protobuf` npm module. The `google-protobuf` api mimics the java protobuf api closely and is more verbose (and somewhat error prone in javascript land although one can try `ts-protoc-gen`).

The dynamic codegen loads `.proto` files at run time. Internally the grpc project usings `protobufjs` which boast faster serialization and deserialization performance. However, it seems to be often times `grpc.load()` does not work with protofiles that has more complex imports (eg. importing google wrappers).

There's a 3rd approach. You can run the protobufjs command line tools `pbjs` and `pbts` to generate js modules for use with `protobufjs`. Nice thing about using pbts is that also generate nice typescript interfaces. However, it creates only service stubs and require to you to supply a transport implementation.

This is where this experiment comes in. It takes transformed `protobufjs` modules from `.proto` files, build up the nessary stubs to build a gRPC Client class, while also using it's reflection properties to generate Typescript bindings if necessary.

## Futher readings
[https://github.com/grpc-ecosystem/awesome-grpc#other-tools](https://github.com/grpc-ecosystem/awesome-grpc#other-tools)

[https://github.com/improbable-eng/grpc-web/](https://github.com/improbable-eng/grpc-web/)