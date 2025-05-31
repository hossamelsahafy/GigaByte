import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_component/home/header";
import Footer from "./_component/home/footer";
import SessionProviderWrapper from "./ClientProvider";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { CategoriesProvider } from "./context/categoriesContext";
import { CartProvider } from "./context/CartContext";
import { OrdersProvider } from "./context/OrderContext";
import { UserProvider } from "./context/UserContext.js";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GigaByte Damietta | لابتوبات واكسسوارات في دمياط",
  description:
    "متجر GigaByte Damietta يقدم لابتوبات استعمال خارج، كي بورد، ماوس، وشاشات بأفضل الأسعار. تسوق الآن أحدث الأجهزة والإكسسوارات في دمياط.",
  keywords: [
    "GigaByte Damietta",
    "جيجابايت دمياط",
    "لابتوبات",
    "لابتوب استعمال خارج",
    "استعمال خارج",
    "كي بورد",
    "ماوس",
    "اكسسوارات كمبيوتر",
    "شاشات",
    "كمبيوتر",
    "لابتوب مستعمل",
  ],
  openGraph: {
    title: "GigaByte Damietta - لابتوبات واكسسوارات كمبيوتر",
    description:
      "استعرض مجموعة واسعة من اللابتوبات المستعملة، الاكسسوارات، والشاشات من GigaByte Damietta.",
    url: "https://gb-d.vercel.app",
    siteName: "GigaByte Damietta",
    images: [
      {
        url: "https://gb-d.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GigaByte Damietta - لابتوبات واكسسوارات",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GigaByte Damietta | Tech Store in Damietta",
    description:
      "Laptops, accessories, and refurbished tech devices in Damietta. Visit GigaByte Damietta today!",
    images: ["https://gb-d.vercel.app/og-image.jpg"], // Same image as OG
  },
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
          <AuthProvider>
            <CategoriesProvider>
              <ProductsProvider>
                <CartProvider>
                  <OrdersProvider>
                    <UserProvider>
                      <Header />
                      {children}
                      <Footer />
                    </UserProvider>
                  </OrdersProvider>
                </CartProvider>
              </ProductsProvider>
            </CategoriesProvider>
          </AuthProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
