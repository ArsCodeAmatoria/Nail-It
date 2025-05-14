import Link from 'next/link'
import { motion } from 'framer-motion'

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-nail-gold">
          Nail It
        </Link>
        <div className="space-x-6">
          <Link
            href="/practice"
            className="text-muted hover:text-foreground transition-colors"
          >
            Practice
          </Link>
          <Link
            href="/exam"
            className="text-muted hover:text-foreground transition-colors"
          >
            Exam Simulation
          </Link>
        </div>
      </div>
    </nav>
  )
} 