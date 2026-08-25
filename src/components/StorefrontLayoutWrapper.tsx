"use client";
import { usePathname } from 'next/navigation';

export default function StorefrontLayoutWrapper({
  topNavBar,
  footer,
  children
}: {
  topNavBar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {topNavBar}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
