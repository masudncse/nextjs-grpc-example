# Next.js gRPC & Express Example

This project demonstrates a Next.js app (using the App Router) that integrates a gRPC server (written in Node.js) and an Express server (also in Node.js) to fetch data from jsonplaceholder.

## Overview

- **gRPC Server (grpc-server):**  
  – Runs on port 50051 (using "npm run dev" (or "npm start" in grpc‑server).  
  – Exposes a HelloService (with a SayHello method) (see hello.proto).  
  – Also runs an Express server (on port 3001) with two endpoints:  
  – GET /api/fetch‑data (returns a list of posts from jsonplaceholder).  
  – GET /api/fetch‑data/:id (returns a single post (by id) from jsonplaceholder).

- **Next.js App (root):**  
  – Uses "npm run dev" (in the root) to start the Next.js app (for example, at http://localhost:3000).  
  – Includes a Next.js API route (src/app/api/hello‑grpc/route.ts) that acts as a gRPC client (calling the gRPC server).  
  – A simple page (src/app/page.tsx) (using "use client") has two buttons:  
  – "Call gRPC Hello" (calls the Next.js API route and displays the reply).  
  – "Fetch Posts" (calls the Express endpoint (http://localhost:3001/api/fetch‑data) and displays a list of post titles).  
  – "Fetch Post (ID 1)" (calls the Express endpoint (http://localhost:3001/api/fetch‑data/1) and displays a single post's details).

## Getting Started

1. In the grpc‑server folder, run:  
  npm install  
  npm run dev (or npm start)  
  (You should see "gRPC server running at 0.0.0.0:50051" and "Express server running at http://localhost:3001" in the console.)

2. In the root folder (nextjs‑grpc‑example), run:  
  npm install  
  npm run dev  
  (Your Next.js app (for example, at http://localhost:3000) should now be running.)

3. Open your browser (or use a tool like Postman) and navigate to your Next.js page (e.g. http://localhost:3000).  
  – Click "Call gRPC Hello" to see the gRPC reply.  
  – Click "Fetch Posts" to see a list of posts (from jsonplaceholder) fetched via the Express API.  
  – Click "Fetch Post (ID 1)" to see a single post's details.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
