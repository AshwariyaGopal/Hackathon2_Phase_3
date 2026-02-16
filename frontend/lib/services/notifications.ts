"use client"

import { Task } from "../services/tasks"

export function setupNotifications() {
  if (typeof window === "undefined") return
  
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification")
    return
  }

  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission()
  }
}

export function checkTaskReminders(tasks: Task[]) {
  if (typeof window === "undefined" || Notification.permission !== "granted") return

  const now = new Date()
  
  tasks.forEach(task => {
    if (task.due_date && !task.is_completed) {
      const dueDate = new Date(task.due_date)
      const timeDiff = dueDate.getTime() - now.getTime()
      
      // Notify if due in the next 5 minutes and we haven't notified recently
      // Using a simple localStorage check to avoid duplicate notifications
      const lastNotified = localStorage.getItem(`notify-${task.id}`)
      
      if (timeDiff > 0 && timeDiff < 5 * 60 * 1000 && !lastNotified) {
        new Notification("Task Reminder", {
          body: `Task "${task.title}" is due soon!`,
          icon: "/favicon.ico"
        })
        localStorage.setItem(`notify-${task.id}`, now.toISOString())
      }
    }
  })
}
