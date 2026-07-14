'use client'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import styles from './layout.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={styles.main}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
