import "./globals.css";
import NavBar from "./components/NavBar";
import SiteFooter from "./components/SiteFooter";

export const metadata = {
  title: "onebigHUB — Discover • Connect • Earn (Prototype)",
  description: "onebigHUB — Discover • Connect • Earn. Internal prototype, not the live product",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Castoro:ital@0;1&family=Poppins:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
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
