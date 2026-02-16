import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { CalendarCheck, CheckCircle, Layout } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b border-gray-100 bg-[#FAF9F6] px-4 backdrop-blur-md md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="rounded-full px-6 font-semibold shadow-sm">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-white pt-24 pb-24 md:pt-32 md:pb-32">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-blue-50/50 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-4 space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              Simple. Focused. Productive.
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:leading-tight">
              Stay Organized. <br className="hidden sm:block" />
              <span className="text-gray-400">Stay Calm.</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed">
              TaskZen helps you plan, track, and complete your tasks without distractions — so you can focus on what truly matters.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
              <Link href="/signup">
                <Button className="h-12 px-8 rounded-full bg-gray-900 text-white hover:bg-gray-800 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="h-12 px-8 rounded-full border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 text-base font-medium">
                  Try AI Chat
                </Button>
              </Link>
            </div>

          </div>
        </section>

        <section className="w-full py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {/* Item 1 */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="mb-2 p-3 rounded-2xl bg-gray-50 text-gray-600">
                  <CalendarCheck className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Plan Your Day</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Organize tasks clearly with priorities and due dates, so you always know what to do next.
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="mb-2 p-3 rounded-2xl bg-gray-50 text-gray-600">
                  <CheckCircle className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Track Progress</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Mark tasks as complete and watch your productivity grow step by step.
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="mb-2 p-3 rounded-2xl bg-gray-50 text-gray-600">
                  <Layout className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Stay in Control</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  A clean, distraction-free workspace that keeps your focus exactly where it belongs.
                </p>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="mb-2 p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-sparkles"
                  >
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063A2 2 0 0 0 14.063 15.5l-1.582 6.135a.5.5 0 0 1-.962 0z" />
                    <path d="M20 3v4" />
                    <path d="M18 5h4" />
                    <path d="M4 20v4" />
                    <path d="M2 22h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Natural language interface to create, manage and organize your tasks instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2026 TaskZen Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}