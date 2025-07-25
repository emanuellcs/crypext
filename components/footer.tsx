"use client"

import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-zinc-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400">© Emanuel Lázaro</p>
          <Button variant="outline" size="sm" asChild className="hover:bg-zinc-800/50 border-zinc-700 bg-transparent">
            <a
              href="https://github.com/emanuellcs/crypext"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
