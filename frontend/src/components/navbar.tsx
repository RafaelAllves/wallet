'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useAuth } from '@/services/authContext';

const Navbar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  if (pathname === '/auth') return null;

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };


  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 text-white">
      <div className="max-w-screen-xl container mx-auto flex justify-between items-center">
        <Link href="/">
          Home
        </Link>

        <div className="space-x-4">
          <Link href="/orders">Boletas</Link>
          <Link href="/tickers">Tickers</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
