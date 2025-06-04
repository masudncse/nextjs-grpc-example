'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default function SinglePostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${params.id}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setPost(data);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-8">
        <Navigation />
        
        <div className="card">
          <Link href="/posts" className="btn mb-6 inline-block">
            ← Back to Posts
          </Link>

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Loading post...</div>
          ) : post ? (
            <article className="space-y-4">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <div className="text-sm text-gray-500">
                Post ID: {post.id} • User ID: {post.userId}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>
              </div>
            </article>
          ) : (
            <div className="text-center py-8">Post not found</div>
          )}
        </div>
      </div>
    </main>
  );
} 