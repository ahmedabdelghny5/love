import { GalleryViewer } from "@/components/gallery-viewer";
import { MemoryPhoto } from "@/components/memory-photo";
import { MemorySection, SectionHeading } from "@/components/ui/memory-section";
import { PhotoCard } from "@/components/ui/photo-card";
import type { Photo } from "@/types/engagement";

type PhotoGalleryProps = {
  photos: readonly Photo[];
  title: string;
  albumUrl: string;
};

export function PhotoGallery({ photos, title, albumUrl }: PhotoGalleryProps) {
  return (
    <MemorySection id="gallery" aria-labelledby="gallery-title" className="memory-gallery-section scroll-mt-6">
      <SectionHeading
        id="gallery-title" title={title} eyebrow="ذكرياتنا"
        description="كل صورة ليها حكاية، وكل لحظة ليها مكان في قلبنا."
      />
      <GalleryViewer photos={photos} albumUrl={albumUrl}>
        <div className="memory-gallery-shell">
          <div className="memory-gallery">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id} caption={photo.caption}
                style={{ "--reveal-delay": `${(index % 3) * 65}ms` }}
                data-reveal
              >
                <MemoryPhoto key={photo.src} photo={photo} albumUrl={albumUrl} frame="natural" />
                <a
                  href={photo.src} target="_blank" rel="noopener noreferrer"
                  className="memory-photo-open" data-viewer-photo={photo.id}
                  aria-label={`كبّر الصورة: ${photo.alt}`} aria-haspopup="dialog"
                >
                  <span className="memory-photo-open-label">كبّر الصورة <span aria-hidden="true">↗</span></span>
                </a>
              </PhotoCard>
            ))}
          </div>
        </div>
      </GalleryViewer>
    </MemorySection>
  );
}
