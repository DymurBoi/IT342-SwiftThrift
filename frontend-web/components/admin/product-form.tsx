"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { fetchProductById, createProduct, updateProduct, fetchCategories, uploadProductImages } from "@/lib/admin-api"
import type { Product, Category } from "@/types"
import { X, Upload, Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.coerce.number().positive("Category is required"),
  condition: z.coerce.number(),
  isSold: z.boolean().default(false),
})

export function ProductForm({ productId }: { productId?: number }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(productId ? true : false)
  const [submitting, setSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: 0,
      condition: 0,
      isSold: false,
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
      }
    }

    const loadProduct = async () => {
      if (!productId) return

      try {
        const data = await fetchProductById(productId)
        setProduct(data)
        setImageUrls(data.imageUrls || [])

        // Set form values
        form.reset({
          name: data.name,
          description: data.description || "",
          price: data.price,
          categoryId: data.category?.categoryID || 0,
          condition: data.condition || 0,
          isSold: data.isSold || false,
        })
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
    if (productId) {
      loadProduct()
    }
  }, [productId, form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true)

    try {
      const productData: Partial<Product> = {
        name: values.name,
        description: values.description,
        price: values.price,
        condition: values.condition,
        isSold: values.isSold,
        category: { categoryID: values.categoryId } as Category,
      }

      let savedProduct: Product

      if (productId) {
        // Update existing product
        savedProduct = await updateProduct(productId, productData)
      } else {
        // Create new product
        savedProduct = await createProduct(productData)
      }

      // Upload images if there are any
      if (images.length > 0) {
        setUploadingImages(true)
        try {
          const uploadedImageUrls = await uploadProductImages(savedProduct.productId, images)
          savedProduct.imageUrls = uploadedImageUrls
        } catch (error) {
          console.error("Failed to upload images:", error)
          toast({
            title: "Warning",
            description: "Product saved but failed to upload images",
            variant: "destructive",
          })
        } finally {
          setUploadingImages(false)
        }
      }

      toast({
        title: productId ? "Product updated" : "Product created",
        description: `${values.name} has been ${productId ? "updated" : "created"} successfully`,
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to save product:", error)
      toast({
        title: "Error",
        description: `Failed to ${productId ? "update" : "create"} product`,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setImages((prev) => [...prev, ...fileArray])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return <div>Loading product details...</div>
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vintage Denim Jacket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product in detail..." className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.categoryID} value={category.categoryID.toString()}>
                            {category.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="0" />
                        </FormControl>
                        <FormLabel className="font-normal">New</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="1" />
                        </FormControl>
                        <FormLabel className="font-normal">Used</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSold"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as Sold</FormLabel>
                    <FormDescription>Check this if the product is already sold</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Product Images</FormLabel>

              {/* Existing images */}
              {imageUrls.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images to upload */}
              {images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">New Images to Upload</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`New image ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                disabled={submitting || uploadingImages}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || uploadingImages}>
                {(submitting || uploadingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {productId ? "Update" : "Create"} Product
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
