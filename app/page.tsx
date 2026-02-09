'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Link as LinkIcon, Shield, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground max-w-3xl mx-auto leading-tight text-balance">
            Your professional story, one simple link
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create a clean, recruiter-friendly profile page. Share your experience, skills, and projects with a single URL.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="text-base">
              <Link href="/auth">
                Create your profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {/* <Button size="lg" variant="outline" asChild className="text-base">
              <Link href="/sarah-chen">See an example</Link>
            </Button> */}
          </div>
        </div>

        <div className="mt-20 w-full overflow-hidden border-y border-border/50 bg-background/50 backdrop-blur-sm group">
          <Image
            src="/profolio.webp"
            alt="Profolio Platform Preview"
            width={1920}
            height={1080}
            priority
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Built for professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={<LinkIcon className="h-6 w-6" />}
              title="One shareable link"
              description="Claim your username and get a clean, memorable URL to share with recruiters and hiring managers."
            />
            <FeatureCard
              icon={<User className="h-6 w-6" />}
              title="Recruiter-optimized"
              description="Designed for fast scanning. Clear sections for experience, skills, and projects that hiring teams actually read."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="ATS-friendly"
              description="Structured data and clean HTML that plays nicely with applicant tracking systems."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Ready to stand out?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join professionals who use Profolio to present their career story clearly and confidently.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
