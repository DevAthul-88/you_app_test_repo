import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouApp',
  description: 'Connect and share with YouApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} >
          {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#162329',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}