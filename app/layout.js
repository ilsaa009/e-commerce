import "./globals.css";
import Header from "./components/Header";
import ReduxProvider from "./redux/ReduxProvider";

// export const metadata = {
//   title: "My E-Commerce Store",
//   description: "Explore a wide variety of products at the best prices. Find your favorite items today",
//   robots: "index, follow",
//   author: "Ilsa",
//   og: {
//     title: "My E-Commerce Store",
//     description: "Explore a wide variety of products at the best prices. Find your favorite items today",
//     image: "https://www.freeiconspng.com/img/23656",
//   },
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ReduxProvider>
          <Header />
          <main className="container mx-auto mt-8">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
