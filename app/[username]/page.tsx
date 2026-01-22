import { 
  getProfileByUsername, 
  getSkillsByProfileId, 
  getExperiencesByProfileId, 
  getProjectsByProfileId 
} from "@/lib/profile";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicProfile from "./PublicProfile";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  const pageTitle = profile.role 
    ? `${profile.full_name} – ${profile.role}` 
    : profile.full_name;
  
  const pageDescription = profile.summary || `Professional profile of ${profile.full_name}`;

  return {
    title: `${pageTitle} | Profolio`,
    description: pageDescription.slice(0, 160),
    openGraph: {
      title: pageTitle,
      description: pageDescription.slice(0, 160),
      type: "profile",
    }
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const [skills, experiences, projects] = await Promise.all([
    getSkillsByProfileId(profile.id.toString()),
    getExperiencesByProfileId(profile.id.toString()),
    getProjectsByProfileId(profile.id.toString()),
  ]);

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  return (
    <PublicProfile 
      profile={profile} 
      skills={skills} 
      experiences={experiences} 
      projects={projects}
      baseUrl={baseUrl}
    />
  );
}
