
import Navbar from '@/components/Navbar';
import './globals.css';
export const metadata = {
  title: 'JobTrackr',
  description: 'Track your job applications effortlessly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        </body>
    </html>
  );
}
