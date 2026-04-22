"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/404") return null;

  return (
    <header className={styles.header}>
      <nav className={styles.header__nav}>
        
        {/* 🔥 ЛОГО */}
        <Link href="/" className={styles.logo}>
          <img src="/siteicon.png" alt="logo" />
        </Link>

        {/* 🔥 МЕНЮ */}
        <div className={`${styles.nav_links} ${menuOpen ? styles.active : ""}`}>
          <Link href="/" className={styles.header__nav_links}>Главная</Link>
          <Link href="/cosplay" className={styles.header__nav_links}>Косплей</Link>
          <Link href="/market" className={styles.header__nav_links}>Магазин</Link>
          <Link href="/articles" className={styles.header__nav_links}>Статьи</Link>
          <Link href="/events" className={styles.header__nav_links}>Фесты</Link>
        </div>

        {/* 🔥 БУРГЕР */}
        <div 
          className={`${styles.burger} ${menuOpen ? styles.open : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </nav>
    </header>
  );
}