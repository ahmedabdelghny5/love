import manifest from "../../photos.manifest.json";
import type { EngagementContent, Photo } from "@/types/engagement";

// Edit personalization here. Edit photo URLs/order/captions in photos.manifest.json.
// Audit fields stay in the manifest and are not passed to page components.
const photos: Photo[] = manifest.photos.map(
  ({ id, src, fullSrc, width, height, alt, caption, objectPosition }) => ({
    id,
    src,
    fullSrc,
    width,
    height,
    alt,
    caption,
    objectPosition,
  }),
);

export const engagement: EngagementContent = {
  names: { first: "أحمد", second: "سارة" },
  date: "2026-11-11",
  dateLabel: "11 نوفمبر 2026",
  title: "11:11 أمنية اتحققت.. ومن هنا ابتدت حكايتنا",
  dedication: "في يوم مميز جمعنا، آنس بك وتأنس بي ونكمل سوا",
  supportingMessage:
    "11/11 مكنش مجرد تاريخ في السنة، ده كان اليوم اللي اتفقنا فيه نبدأ مشوار العمر إيد في إيد.",
  galleryTitle: "لحظات اليوم اللي اتمنّيناه",
  closingMessage: "كل صورة شيلنا فيها ذكرى لليوم اللي جمعنا.. ولسه أحلى حكاياتنا جاية.",
  albumUrl: manifest.albumUrl,
  coverPhotoId: manifest.coverPhotoId,
  photos,
};

export const displayNames = `${engagement.names.first} و${engagement.names.second}`;
