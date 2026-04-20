"use client";
import styles from "./ui/AdWrapper.module.css";

export default function AdWrapper() {
  // Пример внутренней логики — данные баннеров
  const banners = {
    centerImage: "/elcard.jpg",
    leftImage: "/elcard2.jpeg",
    rightImage: "/elcard2.jpeg",
    mobileImage: "/elcardmob.jpg",
    href: "#",
  };

  // Если нет центрального баннера — не показываем блок
  if (!banners.centerImage) return null;

  return (
    <a href={banners.href} className={styles.adWrapper}>
      <div className={styles.adContainer}>
        {/* Мобильный баннер */}
        {banners.mobileImage && (
          <img
            src={banners.mobileImage}
            alt="Мобильная реклама"
            className={`${styles.adImage} ${styles.mobileImage}`}
          />
        )}

        {/* Десктоп/планшет */}
        <div className={styles.desktopBanner}>
          {banners.leftImage && (
            <img
              src={banners.leftImage}
              alt="Реклама слева"
              className={`${styles.adImage} ${styles.sideImage}`}
            />
          )}

          <img
            src={banners.centerImage}
            alt="Центральная реклама"
            className={`${styles.adImage} ${styles.centerImage}`}
          />

          {banners.rightImage && (
            <img
              src={banners.rightImage}
              alt="Реклама справа"
              className={`${styles.adImage} ${styles.sideImage}`}
            />
          )}
        </div>
      </div>
    </a>
  );
}
