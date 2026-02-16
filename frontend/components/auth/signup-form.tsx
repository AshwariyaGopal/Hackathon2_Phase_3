"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SignupForm({ className, ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const target = event.target as typeof event.target & {
      name: { value: string }
      email: { value: string }
      password: { value: string }
    }

    const name = target.name.value
    const email = target.email.value
    const password = target.password.value

    const { error } = await signUp.email({
      email,
      password,
      name,
    })

    if (error) {
      toast.error(error.message || "Something went wrong")
      setIsLoading(false)
      return
    }

    toast.success("Account created successfully")
    router.push("/tasks")
    router.refresh()
  }

  return (
    <Card className={cn("w-full max-w-[400px] border-none shadow-2xl bg-card/60 backdrop-blur-xl animate-in fade-in zoom-in duration-500", className)} {...props}>
      <CardHeader className="space-y-1 pb-8 text-center">
                  <CardTitle className="text-3xl font-extrabold tracking-tight">Join TaskZen</CardTitle>        <CardDescription className="text-base">
          Start your journey towards peak productivity
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">
              Full Name
            </Label>
            <Input 
              id="name" 
              placeholder="John Doe" 
              type="text" 
              required 
              autoComplete="name"
              className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">
              Email Address
            </Label>
            <Input 
              id="email" 
              placeholder="name@example.com" 
              type="email" 
              required 
              autoComplete="email"
              className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" discouraged-property="" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">
              Password
            </Label>
            <Input 
              id="password" 
              type="password" 
              required 
              autoComplete="new-password"
              className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300"
            />
          </div>
          <Button className="w-full h-12 text-lg font-bold mt-6 shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pb-8 text-center">
        <p className="text-xs text-muted-foreground px-6 leading-relaxed">
          By clicking continue, you agree to our <Link href="#" className="underline underline-offset-4">Terms of Service</Link> and <Link href="#" className="underline underline-offset-4">Privacy Policy</Link>.
        </p>
        <div className="relative w-full mt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/20" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
           Already have an account? <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
