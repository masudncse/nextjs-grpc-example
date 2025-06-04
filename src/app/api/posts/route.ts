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

interface PostsResponse {
  posts: Post[];
}

interface PostsServiceClient extends grpc.Client {
  getPosts: (
    request: { limit: number },
    callback: (error: GrpcError | null, response: PostsResponse) => void
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "0");

  try {
    const client = initializeGrpcClient();
    if (!client) {
      throw new Error("Failed to initialize gRPC client");
    }

    return new Promise((resolve) => {
      client.getPosts(
        { limit },
        (error: GrpcError | null, response: PostsResponse) => {
          if (error) {
            resolve(
              NextResponse.json(
                { error: error.details || "Error fetching posts" },
                { status: 500 }
              )
            );
          } else {
            resolve(NextResponse.json(response.posts));
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in posts API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
