export interface ManualItem {
  slug: string;
  id: string;
  title: string;
  icon: string;
  description: string;
  order: number;
  fileName: string;
  contentHtml?: string;
  rawContent?: string;
}
