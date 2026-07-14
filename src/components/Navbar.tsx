'use client'

import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useSession, signOut } from 'next-auth/react'
import styles from './Navbar.module.css'

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const { data: session } = useSession()

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button onClick={toggleSidebar} className={styles.toggleBtn}>
          <Menu size={20} />
        </button>
      </div>
      
      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        {session?.user && (
          <div className={styles.userInfo}>
            <span className={styles.name}>{session.user.name}</span>
            <span className={styles.role}>{session.user.role}</span>
          </div>
        )}

        <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  )
}
