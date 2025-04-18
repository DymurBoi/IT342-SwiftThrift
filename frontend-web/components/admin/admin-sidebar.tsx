"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, Users, ShoppingCart, Star, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAdminAuth()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      active: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: <Package className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/products"),
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <Tag className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/categories"),
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/users"),
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/orders"),
    },
    {
      href: "/admin/reviews",
      label: "Reviews",
      icon: <Star className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/reviews"),
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      active: pathname.includes("/admin/settings"),
    },
  ]

  return (
    <div className="w-64 bg-slate-900 text-white p-6 flex flex-col h-screen">
      <div className="text-xl font-bold mb-8">SwiftThrift Admin</div>
      <nav className="space-y-1 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              route.active ? "bg-slate-800 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="mt-auto w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        onClick={logout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}
