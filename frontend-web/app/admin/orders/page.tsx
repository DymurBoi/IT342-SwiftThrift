"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { fetchOrders, updateOrderStatus } from "@/lib/admin-api"
import { Search, MoreHorizontal, Eye, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface Order {
  orderId: number
  totalPrice: number
  status: string
  createdAt: string
  user?: {
    userId: number
    username: string
    email: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const { toast } = useToast()

  const pageSize = 10

  useEffect(() => {
    loadOrders()
  }, [currentPage, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchOrders(currentPage, pageSize, statusFilter)
      setOrders(Array.isArray(data) ? data : [])

      // Calculate total pages - in a real app, this would come from the API
      setTotalPages(Math.ceil((Array.isArray(data) ? data.length : 0) / pageSize))
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadOrders()
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setUpdateStatusDialogOpen(true)
  }

  const handleUpdateStatusConfirm = async () => {
    if (!selectedOrder || !newStatus) return

    setSubmitting(true)

    try {
      await updateOrderStatus(selectedOrder.orderId, newStatus)

      // Update order in the list
      setOrders(orders.map((o) => (o.orderId === selectedOrder.orderId ? { ...o, status: newStatus } : o)))

      toast({
        title: "Order status updated",
        description: `Order #${selectedOrder.orderId} status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setUpdateStatusDialogOpen(false)
      setSelectedOrder(null)
      setSubmitting(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "secondary" as const
      case "PENDING":
        return "outline" as const
      case "CANCELLED":
        return "destructive" as const
      default:
        return "default" as const
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>#{order.orderId}</TableCell>
                      <TableCell>
                        {order.user ? (
                          <div>
                            <div className="font-medium">{order.user.username}</div>
                            <div className="text-sm text-muted-foreground">{order.user.email}</div>
                          </div>
                        ) : (
                          "Unknown"
                        )}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => (window.location.href = `/admin/orders/${order.orderId}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatusClick(order)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for order #{selectedOrder?.orderId}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatusConfirm}
              disabled={submitting || !newStatus || newStatus === selectedOrder?.status}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
