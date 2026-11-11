import { OurStoryTimeline } from "@/components/our-story-timeline";
import { PhotoCache } from "@/components/photo-cache";
import { ScrollReveals } from "@/components/scroll-reveals";
import { EngagementIntro } from "@/components/engagement-intro";
import { MemoryDedication } from "@/components/memory-dedication";
import { MemoryFooter } from "@/components/memory-footer";
import { MemoryPhoto } from "@/components/memory-photo";
import { PhotoGallery } from "@/components/photo-gallery";
import { engagement } from "@/content/engagement";

export default function HomePage() {
  const cover = engagement.photos.find((photo) => photo.id === engagement.coverPhotoId);

  return (
    <>
      <a href="#main-content" className="memory-skip-link">روح للمحتوى</a>
      <main id="main-content">
        <EngagementIntro
          content={engagement}
          cover={cover && <MemoryPhoto key={cover.src} photo={cover} albumUrl={engagement.albumUrl} priority frame="hero" />}
        />
        <MemoryDedication message={engagement.dedication} />
        <OurStoryTimeline />
        <PhotoGallery photos={engagement.photos} title={engagement.galleryTitle} albumUrl={engagement.albumUrl} />
      </main>
      <MemoryFooter content={engagement} />
      <ScrollReveals />
      <PhotoCache />
    </>
  );
}
