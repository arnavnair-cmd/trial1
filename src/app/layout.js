import { AuthProvider } from "@/components/AuthProvider";
import { AnimatePresence } from "framer-motion";

export const metadata = {
  title: "Linguistics Society",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AnimatePresence mode="wait">
          <AuthProvider>
            {children}
          </AuthProvider>
        </AnimatePresence>
      </body>
    </html>
  );
}


