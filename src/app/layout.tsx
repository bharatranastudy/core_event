import type { Metadata } from "next";
import { Anton, Poppins } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getPublicSettings } from "@/lib/settings";
import { siteConfig } from "@/config/site";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} — Corporate Event Management`,
    template: `%s · ${siteConfig.companyName}`,
  },
  description:
    "Seminars, annual office events, team offsites, and corporate conferences planned and run end to end.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html lang="en" className={`${anton.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-black text-white antialiased selection:bg-[#ff5a14] selection:text-white">
        <MotionProvider>
          <ScrollProgressBar />
          <div className="flex min-h-screen flex-col">
            <SiteHeader companyName={settings.company_name} />
            <main className="flex-1">{children}</main>
            <SiteFooter settings={settings} />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
