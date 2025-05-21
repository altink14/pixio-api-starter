// src/components/shared/navbar.tsx
// NO CHANGES NEEDED HERE if you want all GradientButtons to be Pink/Purple/Orange
// It should look like the version from the previous step where all GradientButtons
// were already using the default variant.

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button'; 
import { GradientButton } from '@/components/ui/gradient-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/db_types';
import { LogOut, Settings, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import { CreditsDisplay } from '@/components/shared/credits-display';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const isMarketingPage = pathname === '/' || pathname === '/pricing';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
    }
  }, []);
  
  useEffect(() => {
    async function getUserData() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        setUser(userData as User | null);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    getUserData();
  }, []);

  const navbarButtonStyles = "text-sm px-5 !py-2 min-w-[100px] sm:px-6 sm:!py-2.5 sm:min-w-[120px] !gap-1.5";
  const dropdownButtonStyles = "w-full text-sm !py-2 !px-3 min-w-0 !gap-1.5";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] py-3 transition-all duration-300",
      scrolled || !isMarketingPage 
        ? "bg-background/80 backdrop-blur-md border-b border-border"
        : "bg-transparent"
    )}>
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-2">
  <div className="relative flex items-center justify-center h-16"> {/* Added flex alignment */}
    <Image 
      src="/metadata/logo.png" 
      alt="Logo" 
      width={280}
      height={64}
      className="w-auto max-h-16" 
      style={{ 
        objectFit: "contain",
        transform: "translateY(2px)" // Fine-tune vertical position
      }}
      priority
    />
  </div>
</Link>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {isMarketingPage ? (
            <>
              {loading ? (
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`h-9 bg-muted/30 rounded-md animate-pulse ${navbarButtonStyles.split(' ')[2]}`}></div>
                  <div className={`h-9 bg-muted/30 rounded-md animate-pulse ${navbarButtonStyles.split(' ')[4]}`}></div>
                </div>
              ) : user ? (
                <Link href="/dashboard">
                  <GradientButton className={navbarButtonStyles}> {/* Uses default (Pink/Purple/Orange) */}
                    <LayoutDashboard className="size-4" /> Dashboard
                  </GradientButton>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <GradientButton className={navbarButtonStyles}> {/* Uses default (Pink/Purple/Orange) */}
                      <LogIn className="size-4" /> Login
                    </GradientButton> 
                  </Link>
                  <Link href="/signup">
                    <GradientButton className={navbarButtonStyles}> {/* Uses default (Pink/Purple/Orange) */}
                      <UserPlus className="size-4" /> Sign up
                    </GradientButton>
                  </Link>
                </>
              )}
            </>
          ) : (
            // Authenticated (in-app) navigation
            <>
              <Link href="/dashboard">
                <GradientButton className={navbarButtonStyles}> {/* Uses default (Pink/Purple/Orange) */}
                  <LayoutDashboard className="size-4" /> Dashboard
                </GradientButton>
              </Link>
              
              {loading ? (
                 <div className="h-9 w-9 bg-muted/30 rounded-full animate-pulse"></div>
              ) : user && (
                <>
                  <CreditsDisplay />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-primary/10 p-0">
                        <Avatar className="h-9 w-9 border border-primary/20">
                          <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                          <AvatarFallback className="bg-primary/10 text-sm">{user.full_name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <Avatar className="h-9 w-9 border border-primary/20">
                           <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                           <AvatarFallback className="bg-primary/10 text-sm">{user.full_name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5 leading-none">
                          {user.full_name && <p className="font-medium text-sm">{user.full_name}</p>}
                          {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer !p-0">
                        <Link href="/account" className="w-full flex justify-between items-center px-2 py-1.5 hover:bg-accent/10 rounded-md">
                          Account Settings <Settings className="h-4 w-4 ml-2 text-muted-foreground" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="!p-0 mt-1">
                        <form action={logout} className="w-full">
                          <GradientButton /* Uses default (Pink/Purple/Orange) */
                            type="submit"
                            className={cn(dropdownButtonStyles, "justify-between rounded-md")} 
                          >
                            Logout <LogOut className="h-4 w-4 text-muted-foreground" />
                          </GradientButton>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              {!loading && !user && !isMarketingPage && (
                <>
                  <Link href="/login">
                    <GradientButton className={navbarButtonStyles}> {/* Uses default (Pink/Purple/Orange) */}
                      <LogIn className="size-4" /> Login
                    </GradientButton>
                  </Link>
                  <Link href="/signup">
                     <GradientButton className={navbarButtonStyles}> {/* Uses default (Pink/Purple/Orange) */}
                       <UserPlus className="size-4" /> Sign up
                     </GradientButton>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}