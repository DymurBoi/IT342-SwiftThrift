"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MobileNavProps {
  routes: {
    href: string
    label: string
    active: boolean
  }[]
}

export function MobileNav({ routes }: MobileNavProps) {
  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <div className="flex flex-col space-y-3 text-sm">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="w-full pl-8" />
          </div>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex py-2 text-sm font-medium ${
                route.active ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              {route.label}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t">
            <Link href="/login">
              <Button className="w-full" variant="outline">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
