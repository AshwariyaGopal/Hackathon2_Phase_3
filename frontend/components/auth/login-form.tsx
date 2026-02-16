"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
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

export function LoginForm({ className, ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const target = event.target as typeof event.target & {
      email: { value: string }
      password: { value: string }
    }

    const email = target.email.value
    const password = target.password.value

    const { error } = await signIn.email({
      email,
      password,
    })

    if (error) {
      toast.error(error.message || "Something went wrong")
      setIsLoading(false)
      return
    }

    toast.success("Signed in successfully")
    router.push("/tasks")
    router.refresh()
  }

  return (
    <Card className={cn("w-full max-w-[400px] border-none shadow-2xl bg-card/60 backdrop-blur-xl animate-in fade-in zoom-in duration-500", className)} {...props}>
      <CardHeader className="space-y-1 pb-8 text-center">
        <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-base">
          Enter your credentials to access your workspace
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={onSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" discouraged-property="" className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/70">
                Password
              </Label>
              <Link href="#" className="text-xs text-primary hover:underline underline-offset-4">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              autoComplete="current-password"
              className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all duration-300"
            />
          </div>
          <Button className="w-full h-12 text-lg font-bold mt-6 shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 hover:-translate-y-0.5" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pb-8">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
           New to TaskZen? <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4">Create account</Link>
        </p>
      </CardFooter>
    </Card>
  )
}
