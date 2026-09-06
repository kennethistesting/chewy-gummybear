import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Yummy Gummy — a little squish of joy', description: 'Poke, stretch, and bounce your very own 3D gummy bear.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
