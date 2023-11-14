import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          Home
        </Link>

        <div className="space-x-4">
          <Link href="/orders">Boletas</Link>
          <Link href="/tickers">Tickers</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
