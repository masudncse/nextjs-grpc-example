# Next.js gRPC Example

A modern web application demonstrating gRPC integration with Next.js, featuring video streaming and JSONPlaceholder posts API.

## Features

- 🎥 Video streaming with custom player controls
- 📝 Posts service with pagination and search
- 🎨 Modern UI with Tailwind CSS components
- 🔄 Real-time data streaming
- 🚀 Next.js 13+ App Router

## Quick Start

```bash
# Install dependencies
npm install
cd grpc-server && npm install

# Start servers
cd grpc-server && npm start  # gRPC server (port 50051)
npm run dev                  # Next.js (port 3000)
```

## Components

### Video Player
- Custom controls with play/pause, volume, and fullscreen
- Real-time streaming using gRPC
- Responsive design with Tailwind CSS

### Posts Service
- List posts with pagination
- View individual posts
- Search and filter capabilities

### UI Components
- Navigation bar with responsive design
- Card layouts for content display
- Custom button and input styles
- Dark mode support

## Project Structure

```
├── src/
│   ├── app/                # Next.js app directory
│   │   ├── api/           # gRPC client routes
│   │   ├── video/         # Video streaming
│   │   └── posts/         # Posts listing & details
│   └── components/        # React components
├── grpc-server/           # gRPC server
│   ├── server.js         # Server implementation
│   ├── video.proto       # Video service
│   └── posts.proto       # Posts service
└── public/               # Static assets
```

## Development

- **Ports**: 
  - Next.js: 3000
  - gRPC: 50051
- **API Routes**: `/api/*`
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks

## License

MIT
