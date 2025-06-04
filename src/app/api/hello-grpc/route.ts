import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = path.join(process.cwd(), 'grpc-server', 'hello.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello as any;

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  return new Promise((resolve) => {
    const client = new helloProto.HelloService(
      'localhost:50051',
      grpc.credentials.createInsecure()
    );

    client.SayHello({ name }, (err: any, response: any) => {
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ message: response.message }));
      }
    });
  });
} 