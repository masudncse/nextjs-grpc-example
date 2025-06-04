'use client';

import { useState } from 'react';
import EnhancedVideoPlayer from '@/components/VideoPlayer';
import Navigation from '@/components/Navigation';

export default function VideoPage() {
  const [videoId, setVideoId] = useState('video1');
  const [quality, setQuality] = useState(2);
  const [autoPlay, setAutoPlay] = useState(false);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <Navigation />
        
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Video Streaming Demo</h1>
      
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video ID
              </label>
              <input
                type="text"
                value={videoId}
                onChange={(e) => setVideoId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter video ID"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={1}>Low (480p)</option>
                  <option value={2}>Medium (720p)</option>
                  <option value={3}>High (1080p)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Play
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Start playing automatically
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <EnhancedVideoPlayer
            videoId={videoId}
            quality={quality}
            autoPlay={autoPlay}
          />
        </div>
      </div>
    </main>
  );
} 