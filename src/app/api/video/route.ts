import { NextRequest, NextResponse } from 'next/server';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Initialize gRPC client
let videoClient: any = null;

const initializeGrpcClient = () => {
  if (videoClient) return videoClient;

  const protoPath = path.join(process.cwd(), 'grpc-server', 'video.proto');
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition).video;
  videoClient = new proto.VideoService(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );

  return videoClient;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');
  const quality = parseInt(searchParams.get('quality') || '2');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  try {
    const client = initializeGrpcClient();
    const stream = client.streamVideo({ video_id: videoId, quality });

    // Create a TransformStream to handle the video chunks
    const { readable, writable } = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    // Pipe the gRPC stream to the TransformStream
    stream.on('data', (chunk: any) => {
      const writer = writable.getWriter();
      writer.write(chunk.data);
      writer.releaseLock();
    });

    stream.on('end', () => {
      const writer = writable.getWriter();
      writer.close();
    });

    stream.on('error', (error: any) => {
      console.error('Stream error:', error);
      const writer = writable.getWriter();
      writer.abort(error);
    });

    // Return the stream with appropriate headers
    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'video/mp4',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error streaming video:', error);
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    );
  }
} 