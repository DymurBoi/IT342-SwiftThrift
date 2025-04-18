import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SwiftThrift</h3>
            <p className="text-muted-foreground text-sm">
              Discover unique, sustainable fashion at affordable prices. Give pre-loved clothing a second life.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=shirts" className="text-muted-foreground hover:text-foreground">
                  Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=jackets" className="text-muted-foreground hover:text-foreground">
                  Jackets
                </Link>
              </li>
              <li>
                <Link href="/products?category=hoodies" className="text-muted-foreground hover:text-foreground">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/products?category=shoes" className="text-muted-foreground hover:text-foreground">
                  Shoes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates on new arrivals and special offers.
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SwiftThrift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
