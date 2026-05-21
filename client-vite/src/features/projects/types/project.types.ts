export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  access: "private" | "public";
  columns?: string[];
  workspace: string;
  coverImgUrl: string | null;
  createdAt: string;
}
