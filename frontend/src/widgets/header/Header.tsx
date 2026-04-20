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

        <Link href="/" className={styles.header__nav_links}>
          Главная
        </Link>

        <Link href="/cosplay" className={styles.header__nav_links}>
          Косплей
        </Link>

        <Link href="/market" className={styles.header__nav_links}>
          Магазин
        </Link>

        <Link href="/articles" className={styles.header__nav_links}>
          Статьи
        </Link>

        <Link href="/events" className={styles.header__nav_links}>
          Косплей-фесты
        </Link>

      </nav>
    </header>
  );
}