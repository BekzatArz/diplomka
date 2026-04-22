"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/404") return null;

  return (
    <header className={styles.header}>
      <nav className={styles.header__nav}>
        <Link href="/" className={styles.header__nav_links}>Главная</Link>
        <Link href="/cosplay" className={styles.header__nav_links}>Косплей</Link>
        <Link href="/market" className={styles.header__nav_links}>Магазин</Link>
        <Link href="/articles" className={styles.header__nav_links}>Статьи</Link>
        <Link href="/events" className={styles.header__nav_links}>Фесты</Link>
        
        {/* Добавил контейнер профиля, чтобы он был частью флекс-системы */}
        <div className={styles.profile_container}>
             <div className={styles.profile_icon}>
                {/* Твое изображение профиля */}
             </div>
        </div>
      </nav>
    </header>
  );
}