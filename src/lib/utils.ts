import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM d");
}

export function formatMonthYear(date: Date): string {
  return format(date, "MMMM yyyy");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

type TipTapNode = { type?: string; text?: string; content?: TipTapNode[] };

export function extractTextFromTipTap(contentJson: string): string {
  try {
    const doc = JSON.parse(contentJson) as TipTapNode;
    const texts: string[] = [];
    function walk(node: TipTapNode) {
      if (node.type === "text" && node.text) texts.push(node.text);
      if (node.content) node.content.forEach(walk);
    }
    walk(doc);
    return texts.join(" ");
  } catch {
    return "";
  }
}

export function getWordCount(contentJson: string): number {
  const text = extractTextFromTipTap(contentJson);
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
