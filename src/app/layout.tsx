import type { Metadata } from "next";
import { Amiri, Cairo } from "next/font/google";
import { displayNames, engagement } from "@/content/engagement";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
});

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

const siteUrl = "https://ahmed-sara-memory.vercel.app";
const title = `${displayNames} | حكايتنا الحلوة`;
const description = "ومن هنا ابتدت حكايتنا... صور من يوم خطوبتنا، وذكريات حلوة هتفضل في قلوبنا دايمًا.";
const cover = engagement.photos.find((photo) => photo.id === engagement.coverPhotoId);
const previewImages = cover ? [{
  url: cover.src,
  width: Math.min(1200, cover.width),
  height: Math.round(cover.height * Math.min(1, 1200 / cover.width)),
  alt: cover.alt,
}] : [];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website", url: siteUrl, siteName: displayNames,
    title, description, locale: "ar_EG", images: previewImages,
  },
  twitter: {
    card: "summary_large_image", title, description,
    images: cover ? [{ url: cover.src, alt: cover.alt }] : [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={[amiri.variable, cairo.variable].join(" ")}>
      {/* Extensions can annotate body before React loads. Ignore attributes on
          this host element only; descendants still receive hydration checks. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
