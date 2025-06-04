import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = join(__dirname, 'hello.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}!` });
}

function main() {
  const grpcServer = new grpc.Server();
  grpcServer.addService(helloProto.HelloService.service, { SayHello: sayHello });
  const grpcPort = '0.0.0.0:50051';
  grpcServer.bindAsync(grpcPort, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${grpcPort}`);
    grpcServer.start();
  });
}

main(); 