
import './globals.css';

export const metadata = {
  title: 'JobTracker',
  description: 'Track your job applications effortlessly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        </body>
    </html>
  );
}
