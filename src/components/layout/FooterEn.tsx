import Link from 'next/link';

interface FooterEnProps {
  focusMode?: boolean;
}

export function FooterEn({ focusMode = false }: FooterEnProps) {
  if (focusMode) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Project Info */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-6">
          JSSpace is an independent web utility project.
          Not affiliated with any company, agency, or organization.
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} JSSpace
          </p>

          {/* Links */}
          <nav className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <FooterLink href="/en/about">About</FooterLink>
            <FooterLink href="/en/contact">Contact</FooterLink>
            <FooterLink href="/en/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/en/terms">Terms of Service</FooterLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      {children}
    </Link>
  );
}
