import { AuthProvider } from "@/components/AuthProvider";
import { AnimatePresence } from "framer-motion";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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




