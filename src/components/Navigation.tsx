import React from 'react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <div>
      <h3>Navigation:</h3>
      <ul className="flex flex-col gap-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/video">Video</Link></li>
      </ul>
    </div>
  )
}
