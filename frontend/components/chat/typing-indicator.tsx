import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-4 py-3 bg-muted rounded-2xl rounded-tl-none w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
