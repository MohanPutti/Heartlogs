export type Mood = "great" | "good" | "okay" | "low" | "rough";

export interface MoodOption {
  key: Mood;
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: MoodOption[] = [
  { key: "great", emoji: "😄", label: "Great",  color: "#4ade80" },
  { key: "good",  emoji: "🙂", label: "Good",   color: "#a3e635" },
  { key: "okay",  emoji: "😐", label: "Okay",   color: "#facc15" },
  { key: "low",   emoji: "😔", label: "Low",    color: "#fb923c" },
  { key: "rough", emoji: "😢", label: "Rough",  color: "#f87171" },
];

export interface TagType {
  id: string;
  name: string;
  color: string | null;
}

export interface EntryType {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  tags: TagType[];
}

export interface UserType {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}
