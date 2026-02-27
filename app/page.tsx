export default function HomePage() {
  return (
    <div 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9"
      }}
    >
      <div 
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a", marginBottom: "1rem" }}>
          MAT Pad
        </h1>
        <p style={{ color: "#475569", marginBottom: "1.5rem" }}>
          Forms and Reports Management System
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <a 
            href="/forms" 
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#9333ea",
              color: "white",
              borderRadius: "0.5rem",
              textDecoration: "none"
            }}
          >
            Go to Forms
          </a>
          <a 
            href="/reports" 
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#475569",
              color: "white",
              borderRadius: "0.5rem",
              textDecoration: "none"
            }}
          >
            Go to Reports
          </a>
        </div>
      </div>
    </div>
  )
}
