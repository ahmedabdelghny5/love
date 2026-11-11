export interface Photo {
  id: string;
  src: string;
  fullSrc?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  objectPosition: string;
}

export interface EngagementContent {
  names: {
    first: string;
    second: string;
  };
  /** Calendar date YYYY-MM-DD; never convert through a timezone. */
  date?: string;
  dateLabel?: string;
  title: string;
  dedication: string;
  supportingMessage: string;
  galleryTitle: string;
  closingMessage: string;
  albumUrl: string;
  coverPhotoId: string;
  photos: readonly Photo[];
}
