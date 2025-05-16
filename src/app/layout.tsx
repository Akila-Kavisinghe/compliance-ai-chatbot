import "./globals.css";
import { MessageProvider } from "@/context/MessageContext";
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MessageProvider>
          {children}
        </MessageProvider>
      </body>
    </html>
  );
}
