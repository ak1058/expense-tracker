import "./globals.css";

export const metadata = {
  title: "Expense Tracer",
  description: "Minimal monthly expense tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}