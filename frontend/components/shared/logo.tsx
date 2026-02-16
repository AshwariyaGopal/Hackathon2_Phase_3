import Image from "next/image"

export function Logo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="flex items-center justify-center transition-transform group-hover:scale-105">
        <Image 
          src="/logo.png" 
          alt="TaskZen Logo" 
          width={32} 
          height={32} 
          className="object-contain"
        />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
        TaskZen
      </span>
    </div>
  )
}
