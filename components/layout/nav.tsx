"use client";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, LayoutDashboard } from "lucide-react";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  const { user, signOut } = useAuth();
  const { data: profile } = useCurrentProfile();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
      aria-label="Main Navigation"
    >
      <div
        id="nav-container"
        className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
          aria-label={`${siteConfig.site_name} home`}
        >
          <Image
            src={Logo}
            alt={`${siteConfig.site_name} Logo`}
            loading="eager"
            className="dark:invert"
            width={42}
            height={26.44}
          />
          <h2 className="text-sm">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                {profile && (
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link href={`/${profile.username}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link href="/pages/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">Get started</Link>
                </Button>
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
