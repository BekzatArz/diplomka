const types = [
  { title: "Craft", desc: "Создание доспехов и оружия из пластика и пенки.", icon: "🛠️" },
  { title: "Sewing", desc: "Сложный пошив исторических и фэнтези костюмов.", icon: "🪡" },
  { title: "Wig Styling", desc: "Укладка париков в невозможные архитектурные формы.", icon: "💇" },
  { title: "Make-up", desc: "Изменение черт лица и создание спецэффектов (SFX).", icon: "🎨" }
];

export const CosplayTypes = () => {
  return (
    <section className="cos-types">
      <div className="cos-container">
        <h2 className="cos-center-title">Из чего состоит Косплей?</h2>
        <div className="cos-types-grid">
          {types.map((t, i) => (
            <div key={i} className="cos-type-card">
              <div className="type-icon">{t.icon}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};