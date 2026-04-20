export default function NotFound() {
  return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "sans-serif",
          }}
        >
          <h1>404 — Страница не найдена</h1>
          <p>Похоже, вы заблудились</p>
          <a href="/" style={{ color: "#6a198f", marginTop: "10px" }}>
            Вернуться на главную
          </a>
        </div>
  );
}
