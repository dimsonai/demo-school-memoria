export type MemoryType = "photo" | "video";

export interface MemoryDTO {
  id: number;
  type: MemoryType;
  filePath: string;
  fileName: string | null;
  size: number | null;
  caption: string | null;
  author: string | null;
  albumId: number | null;
  albumTitle: string | null;
  takenAt: string | null;
  createdAt: string;
  commentCount: number;
}

export interface CommentDTO {
  id: number;
  memoryId: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface AlbumDTO {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  count: number;
  coverPath: string | null;
  coverType: MemoryType | null;
}

export interface WishDTO {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface StatsDTO {
  photos: number;
  videos: number;
  albums: number;
  wishes: number;
}
