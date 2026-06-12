export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#0c0c0e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}
