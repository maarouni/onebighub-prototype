import "./globals.css";
import NavBar from "./components/NavBar";
import SiteFooter from "./components/SiteFooter";

export const metadata = {
  title: "onebigHUB — Curate Calendar, Connections, ... (Prototype)",
  description: "Bay Area event calendar — internal prototype, not the live product",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Alata&family=Lexend:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        <NavBar />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}
