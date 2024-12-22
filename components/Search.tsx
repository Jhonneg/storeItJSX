import Image from "next/image";
import Link from "next/link";

export default function Search() {
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          className="hidden h-auto lg:block"
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
        <nav className="sidebar-nav">
                  <ul className="flex flex-1 flex-col gap-6">
                      
          </ul>
        </nav>
      </Link>
    </aside>
  );
}
