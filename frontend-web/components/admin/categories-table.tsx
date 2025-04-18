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
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/admin-api"
import type { Category } from "@/types"

const formSchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
})

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const { toast } = useToast()

  const addForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
    },
  })

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
    },
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [toast])

  const handleAddSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newCategory = await createCategory({ categoryName: values.categoryName })
      setCategories([...categories, newCategory])

      toast({
        title: "Category created",
        description: `${values.categoryName} has been created successfully`,
      })

      addForm.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to create category:", error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    editForm.reset({ categoryName: category.categoryName })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedCategory) return

    try {
      const updatedCategory = await updateCategory(selectedCategory.categoryID, {
        categoryName: values.categoryName,
      })

      setCategories(categories.map((c) => (c.categoryID === selectedCategory.categoryID ? updatedCategory : c)))

      toast({
        title: "Category updated",
        description: `Category has been updated to ${values.categoryName}`,
      })

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Failed to update category:", error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return

    try {
      await deleteCategory(selectedCategory.categoryID)

      setCategories(categories.filter((c) => c.categoryID !== selectedCategory.categoryID))

      toast({
        title: "Category deleted",
        description: `${selectedCategory.categoryName} has been deleted successfully`,
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading categories...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">All Categories</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category for your products.</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shirts, Jackets, Shoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Category</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.categoryID}>
                  <TableCell>{category.categoryID}</TableCell>
                  <TableCell className="font-medium">{category.categoryName}</TableCell>
                  <TableCell>{category.products?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(category)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.categoryName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
