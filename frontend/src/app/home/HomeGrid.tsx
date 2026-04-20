import React from 'react';
import Link from 'next/link';
import './HomeGrid.css';

// Данные с упором на мастерство (Skills)
const COSPLAY_DATA = [
  { 
    id: 1, 
    character: "2B", 
    fandom: "NieR: Automata", 
    author: "Valkyrie", 
    img: 'https://media.istockphoto.com/id/1529176639/photo/portrait-of-cosplay-woman-in-a-black-costume-and-a-white-wig-in-studio-on-a-white-background.jpg?s=1024x1024&w=is&k=20&c=yi-s_1T9EnmozHYjdXBSknKY7r9gURfycS_4m-djy60=', // Путь от корня public
    focus: "Пошив и вышивка",
    description: "Сложная работа с бархатом и ручная вышивка подола платья."
  },
  { 
    id: 2, 
    character: "Кратос", 
    fandom: "God of War", 
    author: "ButcherCos", 
    img: "https://media.istockphoto.com/id/1393201785/photo/cosplay-session-portrait-of-the-warrior.jpg?s=1024x1024&w=is&k=20&c=NU2Uq3NEyaduY1amsRaBS0UnBo04vuD2l6ZR4QUMJFs=", 
    focus: "Работа с кожей",
    description: "Натуральная кожа с эффектом состаривания и кованые элементы брони."
  },
  { 
    id: 3, 
    character: "Cyber Girl", 
    fandom: "Original", 
    author: "NeonMist", 
    img: "https://plus.unsplash.com/premium_photo-1678937611277-25401c00db38?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    focus: "LED и Крафт",
    description: "Интеграция адресной светодиодной ленты в детали из EVA-foam."
  },
  { 
    id: 4, 
    character: "Jinx", 
    fandom: "League of Legends", 
    author: "Powder_C", 
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420", 
    focus: "Бутафория",
    description: "Создание пушки 'Пыщ-Пыщ' весом всего 2кг при длине в метр."
  },
];

const HomeGrid = () => {
  return (
    <section className="cos-section">
      <div className="cos-info">
        <h2 className="cos-title">Мастерство перевоплощения</h2>
        <p className="cos-desc">
          Косплей — это не только костюм. Это инженерная мысль, знание материалов 
          и тысячи часов ручного труда. Разберись, как создаются легенды.
        </p>
      </div>

      <div className="cos-grid">
        {COSPLAY_DATA.map((item) => (
          <article key={item.id} className="cos-card">
            <div className="cos-card-media">
              <img src={item.img} alt={item.character} loading="lazy" />
              <div className="cos-card-tag">{item.fandom}</div>
              <div className="cos-card-hover-info">
                 <span className="skill-label">Сложность: {item.focus}</span>
                 <p>{item.description}</p>
              </div>
            </div>

            <div className="cos-card-body">
              <div className="cos-card-main">
                <h3 className="cos-card-name">{item.character}</h3>
                <Link href={`/authors/${item.author}`} className="cos-card-author">
                  @{item.author}
                </Link>
              </div>
              <button className="cos-action-btn" aria-label="Like">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomeGrid;