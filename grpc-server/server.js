import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = join(__dirname, 'hello.proto');
const VIDEO_PROTO_PATH = join(__dirname, 'video.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const videoPackageDefinition = protoLoader.loadSync(VIDEO_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;
const videoProto = grpc.loadPackageDefinition(videoPackageDefinition).video;

// Sample video data (in a real application, this would come from a database or file system)
const sampleVideos = {
  'video1': {
    path: join(__dirname, 'sample-video.mp4'),
    mimeType: 'video/mp4'
  }
};

function sayHello(call, callback) {
  callback(null, { message: `Hello, ${call.request.name}!` });
}

function streamVideo(call) {
  const { video_id, quality } = call.request;
  const video = sampleVideos[video_id];

  if (!video) {
    call.emit('error', {
      code: grpc.status.NOT_FOUND,
      details: 'Video not found'
    });
    return;
  }

  try {
    const videoStream = fs.createReadStream(video.path, { highWaterMark: 64 * 1024 }); // 64KB chunks
    let sequenceNumber = 0;

    videoStream.on('data', (chunk) => {
      call.write({
        data: chunk,
        sequence_number: sequenceNumber++,
        is_last_chunk: false,
        mime_type: video.mimeType
      });
    });

    videoStream.on('end', () => {
      call.write({
        data: Buffer.alloc(0),
        sequence_number: sequenceNumber,
        is_last_chunk: true,
        mime_type: video.mimeType
      });
      call.end();
    });

    videoStream.on('error', (error) => {
      call.emit('error', {
        code: grpc.status.INTERNAL,
        details: 'Error streaming video'
      });
    });

    call.on('cancelled', () => {
      videoStream.destroy();
    });
  } catch (error) {
    call.emit('error', {
      code: grpc.status.INTERNAL,
      details: 'Error processing video stream'
    });
  }
}

function main() {
  const grpcServer = new grpc.Server();
  grpcServer.addService(helloProto.HelloService.service, { SayHello: sayHello });
  grpcServer.addService(videoProto.VideoService.service, { streamVideo: streamVideo });
  
  const grpcPort = '0.0.0.0:50051';
  grpcServer.bindAsync(grpcPort, grpc.ServerCredentials.createInsecure(), () => {
    console.log(`gRPC server running at ${grpcPort}`);
    grpcServer.start();
  });
}

main(); 