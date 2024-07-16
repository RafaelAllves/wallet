'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useAuth } from '@/services/authContext';

const Navbar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  if (pathname === '/auth' || pathname === '/auth/register') return null;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/auth';
  };

  const getLinkClassName = (path: string): string => {
    return pathname === path ? "underline" : "";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-20">
      <div className="max-w-screen-xl container mx-auto flex justify-between items-center">
        <Link href="/" className={getLinkClassName("/")}>
          Home
        </Link>

        <div className="space-x-4">
          <Link href="/orders" className={getLinkClassName("/orders")}>
            Boletas
          </Link>
          <Link href="/tickers" className={getLinkClassName("/tickers")}>
            Tickers
          </Link>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
