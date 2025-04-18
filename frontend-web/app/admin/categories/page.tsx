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
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/admin-api"

const formSchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
})

type FormValues = z.infer<typeof formSchema>

interface Category {
  categoryID: number
  categoryName: string
  products?: any[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { toast } = useToast()

  const addForm = useForm<FormValues>({
    defaultValues: {
      categoryName: "",
    },
  })

  const editForm = useForm<FormValues>({
    defaultValues: {
      categoryName: "",
    },
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(Array.isArray(data) ? data : [])
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

  const handleAddSubmit = async (values: FormValues) => {
    setSubmitting(true)

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
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    editForm.reset({ categoryName: category.categoryName })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (values: FormValues) => {
    if (!selectedCategory) return

    setSubmitting(true)

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
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return

    setSubmitting(true)

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
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
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
                  control={addForm.control as any}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Category
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
      )}

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
                control={editForm.control as any}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Category
                </Button>
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
