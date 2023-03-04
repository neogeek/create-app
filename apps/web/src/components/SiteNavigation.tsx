import Link from 'next/link';

export default function SiteNavigation({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <nav className="my-10 text-center">
      <ul className="flex justify-center">
        <li>
          <Link href="/" className="px-1">
            Home
          </Link>
        </li>
        {!isLoggedIn ? (
          <li>
            <Link href="/login" className="px-1">
              Login
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link href="/profile" className="px-1">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/logout" className="px-1">
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
