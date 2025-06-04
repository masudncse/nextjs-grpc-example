'use client';

import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-blue-500 shadow-sm p-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <ul className="flex items-center gap-6">
          <li>
            <Link 
              href="/" 
              className="text-white hover:text-blue-100 font-medium transition-colors"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/video" 
              className="text-white hover:text-blue-100 font-medium transition-colors"
            >
              Video
            </Link>
          </li>
          <li>
            <Link 
              href="/posts" 
              className="text-white hover:text-blue-100 font-medium transition-colors"
            >
              Posts
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
