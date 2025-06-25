// import NavLinks from './NavLinks'; 
// Header.tsx (Server Component)
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenuTrigger from './UserMenuTrigger';

interface HeaderProps {
  logo: string;
  logoAlt: string;
  user: any; // Using 'any' for now to match layout, will be properly typed in child components
}

export default function Header({ user, logo, logoAlt }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 border-b border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20'>
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />

      {/* Main Header Bar */}
      <div className='relative'>
        <nav
          className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'
          aria-label='Main header'
        >
          {/* Logo with enhanced styling */}
          <div className='flex flex-shrink-0 items-center ml-2 md:ml-0 group'>
            <div className="p-1 rounded-lg hover:bg-accent/50 transition-colors duration-300">
              <Logo logo={logo} logoAlt={logoAlt} />
            </div>
          </div>

          {/* Search Bar - enhanced with better container */}
          <div className='flex flex-1 items-center justify-center px-2 md:px-6'>
            <div className='w-full max-w-xl relative'>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <SearchBar />
            </div>
          </div>

          {/* Actions: Enhanced user menu */}
          <div className='flex items-center gap-2 md:gap-3'>
            <div className="relative">
              <UserMenuTrigger user={user} />
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-feature-users/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-sm" />
            </div>
          </div>
        </nav>
      </div>

      {/* Navigation Bar for Categories (Desktop) - Enhanced for future use */}
      {/* <div className='hidden border-b border-border/30 bg-gradient-to-r from-background via-accent/5 to-background shadow-sm md:block'>
        <nav
          className='mx-auto flex max-w-7xl items-center justify-center px-4 py-3 sm:px-6 lg:px-8'
          aria-label='Product categories'
        >
          <div className="relative">
            <CategoryNav />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </nav>
      </div> */}

      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
