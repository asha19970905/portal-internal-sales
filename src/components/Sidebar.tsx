'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, ClipboardList, HelpCircle, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import styles from './Sidebar.module.css'

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'PO & POP', path: '/po-pop', icon: FileText },
    { name: 'Claim Memo', path: '/claim-memo', icon: ClipboardList },
    { name: 'Informasi & Bantuan', path: '/bantuan', icon: HelpCircle },
  ]

  if (session?.user?.role === 'ADMIN') {
    links.push({ name: 'Kelola Pengguna', path: '/admin/users', icon: Users })
  }

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>Portal Sales</div>
      </div>
      <nav className={styles.nav}>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.path || pathname.startsWith(link.path + '/')
          return (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} className={styles.icon} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
