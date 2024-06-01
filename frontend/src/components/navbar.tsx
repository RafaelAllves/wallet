import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 text-white">
      <div className="max-w-screen-xl container mx-auto flex justify-between items-center">
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
