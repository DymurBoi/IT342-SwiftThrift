'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, fetchCategories } from "@/lib/admin-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  condition: z.coerce.number().int().min(0).max(5),
  isSold: z.boolean(),
  categoryId: z.coerce.number().int(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AddProductPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const router = useRouter();

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: 0, // Ensure default value for categoryId is a valid number
    },
  });

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(
        data.map((cat: any) => ({
          id: cat.categoryID,
          name: cat.categoryName,
        }))
      );
    }
    loadCategories();
  }, []);

  const onSubmit: SubmitHandler<FormSchemaType> = async (values: FormSchemaType) => {
    const productData = {
      name: values.name,
      description: values.description,
      price: values.price,
      condition: values.condition,
      isSold: values.isSold,
      categoryId: values.categoryId,
    };

    try {
      await createProduct(productData);
      router.push('/admin/products');
    } catch (error) {
      console.error("Failed to create product", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Description</Label>
          <Textarea {...register("description")} />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label>Price</Label>
          <Input type="number" {...register("price")} />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <Label>Condition (0-5)</Label>
          <Input type="number" {...register("condition")} />
          {errors.condition && <p className="text-red-500">{errors.condition.message}</p>}
        </div>

        <div>
          <Label>Is Sold</Label>
          <Select onValueChange={(value) => setValue("isSold", value === 'true')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Available</SelectItem>
              <SelectItem value="true">Sold</SelectItem>
            </SelectContent>
          </Select>
          {errors.isSold && <p className="text-red-500">{errors.isSold.message}</p>}
        </div>

        <div>
          <Label>Category</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={String(field.value)}  // Ensure value is passed as string
                onValueChange={(value) => {
                  field.onChange(Number(value) || 0);  // Convert value to number and set it, fallback to 0 if empty
                }} 
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat, index) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
        </div>

        <Button type="submit">Create Product</Button>
      </form>
    </div>
  );
}
