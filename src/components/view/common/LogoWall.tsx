import { cn } from '@/lib/utils'

interface LogoWallProps {
  className?: string
}

const logos = [
  { name: 'Brand 1', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 2', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 3', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 4', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 5', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 6', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 7', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
  { name: 'Brand 8', src: 'https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp' },
]

export function LogoWall({ className }: LogoWallProps) {
  return (
    <section className={cn('relative overflow-hidden bg-black/10 py-8 sm+:py-12', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-slate-100-30 [mask-image:radial-gradient(ellipse_at_center,white_50%,transparent)] dark:bg-grid-slate-700-20" />
      
      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-80 h-80 bg-primary/12 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob z-0" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/12 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 z-0" />

      <div className="container mx-auto px-4 sm+:px-6 relative z-10">
        <div className="relative">
          {/* Logo wall image from topview.ai */}
          <div className="flex items-center justify-center">
            <img
              src="https://d1735p3aqhycef.cloudfront.net/official-website/public/tools/logo_wall_2.webp"
              alt="Logo wall"
              className="w-full h-auto max-w-6xl mx-auto opacity-80 hover:opacity-100 transition-opacity"
              onError={(e) => {
                // Fallback to animated logo strip if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div class="flex gap-8 sm+:gap-12 animate-scroll">
                      ${logos
                        .map(
                          (logo, index) => `
                        <div key="first-${index}" class="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                          <span class="text-xs sm+:text-sm text-foreground/40 font-medium">${logo.name}</span>
                        </div>
                      `
                        )
                        .join('')}
                      ${logos
                        .map(
                          (logo, index) => `
                        <div key="second-${index}" class="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                          <span class="text-xs sm+:text-sm text-foreground/40 font-medium">${logo.name}</span>
                        </div>
                      `
                        )
                        .join('')}
                    </div>
                  `
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

