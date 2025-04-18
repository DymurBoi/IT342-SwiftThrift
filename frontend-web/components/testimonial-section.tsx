import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Regular Customer",
      content:
        "I've been shopping at SwiftThrift for over a year now. The quality of the items is amazing, and I love that I'm helping reduce fashion waste.",
    },
    {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Fashion Blogger",
      content:
        "SwiftThrift has become my go-to for unique pieces that stand out in my content. The prices are unbeatable, and the selection is always fresh.",
    },
    {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sustainable Living Advocate",
      content:
        "As someone who cares deeply about sustainability, I appreciate SwiftThrift's mission. They're making second-hand shopping accessible and trendy.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground flex-1">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
