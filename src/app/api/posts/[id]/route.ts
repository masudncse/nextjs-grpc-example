import { NextRequest, NextResponse } from "next/server";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

interface GrpcError extends Error {
  code?: number;
  details?: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface PostsServiceClient extends grpc.Client {
  getPost: (
    request: { id: number },
    callback: (error: GrpcError | null, response: Post) => void
  ) => void;
}

// Initialize gRPC client
let postsClient: PostsServiceClient | null = null;

const initializeGrpcClient = () => {
  if (postsClient) return postsClient;

  const protoPath = path.join(process.cwd(), "grpc-server", "posts.proto");
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const proto = grpc.loadPackageDefinition(packageDefinition)
    .posts as unknown as {
    PostsService: {
      new (
        address: string,
        credentials: grpc.ChannelCredentials
      ): PostsServiceClient;
    };
  };

  postsClient = new proto.PostsService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  return postsClient;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate params object
    if (!params || typeof params !== 'object') {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Validate id parameter exists
    if (!params.id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Validate the ID parameter
    const postId = parseInt(params.id);
    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const client = initializeGrpcClient();
    if (!client) {
      throw new Error("Failed to initialize gRPC client");
    }

    return new Promise((resolve) => {
      client.getPost(
        { id: postId },
        (error: GrpcError | null, response: Post) => {
          if (error) {
            const status = error.code === grpc.status.NOT_FOUND ? 404 : 500;
            const message = error.details || 
              (error.code === grpc.status.NOT_FOUND ? "Post not found" : "Error fetching post");
            
            resolve(NextResponse.json({ error: message }, { status }));
          } else {
            resolve(NextResponse.json(response));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in posts API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
