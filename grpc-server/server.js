import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

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
  // Start gRPC server
  const grpcServer = new grpc.Server();
  grpcServer.addService(helloProto.HelloService.service, { SayHello: sayHello });
  const grpcPort = '0.0.0.0:50051';
  grpcServer.bindAsync(grpcPort, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${grpcPort}`);
    grpcServer.start();
  });

  // Start Express server
  const app = express();
  app.use(express.json());
  // Enable CORS so that the Next.js app (on a different port) can call /api/fetch-data
  app.use(cors());

  app.get('/api/fetch-data', async (req, res) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // New Express route: GET /api/fetch-data/:id (fetch a single post by id)
  app.get('/api/fetch-data/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      if (!response.ok) {
         res.status(response.status).json({ error: "Post not found" });
         return;
      }
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  const expressPort = 3001;
  app.listen(expressPort, () => {
    console.log(`Express server running at http://localhost:${expressPort}`);
  });
}

main(); 