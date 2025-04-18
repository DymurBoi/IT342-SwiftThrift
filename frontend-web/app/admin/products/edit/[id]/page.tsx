"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { fetchProductById, updateProduct, fetchCategories, uploadProductImages } from "@/lib/admin-api"
import { Loader2, Upload, X } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  categoryId: z.coerce.number().positive("Category is required"),
  condition: z.coerce.number(),
  isSold: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const router = useRouter()
  const { toast } = useToast()
  const [invalidId, setInvalidId] = useState(false)

  useEffect(() => {
    if (isNaN(productId)) {
      setInvalidId(true)
      toast({
        title: "Invalid product ID",
        description: "The product ID is invalid or missing",
        variant: "destructive",
      })
      router.push("/admin/products")
    }
  }, [productId, router, toast])

  const [product, setProduct] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const form = useForm<FormValues>({
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
    const loadData = async () => {
      try {
        setLoading(true)

        const productData = await fetchProductById(productId)
        setProduct(productData)
        setExistingImages(productData.imageUrls || [])

        const categoriesData = await fetchCategories()
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])

        form.reset({
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          categoryId: productData.category?.categoryID || 0,
          condition: productData.condition || 0,
          isSold: productData.isSold || false,
        })
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [productId, form, toast])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setSubmitting(true)

    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        condition: values.condition,
        isSold: values.isSold,
        category: { categoryID: values.categoryId },
        imageUrls: existingImages,
      }

      await updateProduct(productId, productData)

      if (images.length > 0) {
        setUploadingImages(true)
        try {
          await uploadProductImages(productId, images)
        } catch (error) {
          console.error("Failed to upload images:", error)
          toast({
            title: "Warning",
            description: "Product updated but failed to upload new images",
            variant: "destructive",
          })
        } finally {
          setUploadingImages(false)
        }
      }

      toast({
        title: "Product updated",
        description: `${values.name} has been updated successfully`,
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to update product:", error)
      toast({
        title: "Error",
        description: "Failed to update product",
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
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (invalidId) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div>Invalid product ID. Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Back to Products
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <Select
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                        value={field.value ? field.value.toString() : ""}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={loading ? "Loading categories..." : "Select a category"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loading ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category.categoryID} value={category.categoryID.toString()}>
                                {category.categoryName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No categories available
                            </SelectItem>
                          )}
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
                        value={field.value ? field.value.toString() : "0"}
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

                {existingImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {existingImages.map((url, index) => (
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

                {images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">New Images to Upload</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`New product image ${index + 1}`}
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

                <label htmlFor="image-upload" className="cursor-pointer text-sm text-blue-600">
                  <Upload className="inline h-5 w-5 mr-2" />
                  Upload New Images
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full mt-6">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
