"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? [searchParams.get("category") as string] : [],
  )
  const [selectedConditions, setSelectedConditions] = useState<number[]>([])

  const categories = [
    { id: "shirts", label: "Shirts" },
    { id: "jackets", label: "Jackets" },
    { id: "hoodies", label: "Hoodies" },
    { id: "shoes", label: "Shoes" },
  ]

  const conditions = [
    { id: 0, label: "New" },
    { id: 1, label: "Used" },
  ]

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleConditionChange = (condition: number) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0])
    }

    if (selectedConditions.length > 0) {
      params.set("condition", selectedConditions.join(","))
    }

    if (priceRange[0] > 0 || priceRange[1] < 200) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }

    router.push(`/products?${params.toString()}`)
  }

  const resetFilters = () => {
    setPriceRange([0, 200])
    setSelectedCategories([])
    setSelectedConditions([])
    router.push("/products")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-${condition.id}`}
                    checked={selectedConditions.includes(condition.id)}
                    onCheckedChange={() => handleConditionChange(condition.id)}
                  />
                  <Label htmlFor={`condition-${condition.id}`}>{condition.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <Slider
              defaultValue={priceRange}
              max={200}
              step={5}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
