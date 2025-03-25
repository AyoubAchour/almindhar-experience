import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expériences | Almindhar Experience",
  description: "Découvrez nos expériences touristiques authentiques en Tunisie",
};

export default function ExperiencesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {children}
    </div>
  );
}
