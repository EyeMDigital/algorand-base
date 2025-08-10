// components/Layout.js
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import styles from '../styles/Layout.module.css'

// Dynamically load the wallet button on the client only
const ConnectButton = dynamic(
  () => import('../components/ConnectButton'),
  { ssr: false }
)

// Top-level modules
const APPS = [
  { name: 'Home',       href: '/' },
  { name: 'Memes',      href: '/generators' },
  { name: 'Autotrader', href: '/autotrader' },
  // …etc
]

export default function Layout({ children }) {
  const { pathname } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img
          src="/Website_Banner.png"
          alt="Site Banner"
          className={styles.banner}
        />
      </header>

      <div className={styles.topBar}>
        <div className={styles.spacer} />

        <div className={styles.wallet}>
          <ConnectButton />
        </div>

        <button
          className={styles.hamburger}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          ☰
        </button>

        {menuOpen && (
          <nav className={styles.dropdown}>
            {APPS.map(({ name, href }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.dropdownLink} ${active ? styles.active : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {name}
                </Link>
              )
            })}
          </nav>
        )}
      </div>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} EyeMDigital. All rights reserved.
      </footer>
    </div>
  )
}
