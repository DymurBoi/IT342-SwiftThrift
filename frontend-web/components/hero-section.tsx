import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/20" />
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt="Thrifted clothing collection"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Sustainable Fashion at Your Fingertips
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground">
            Discover unique, pre-loved clothing items that are good for your wallet and the planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto">
                Shop Now
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
