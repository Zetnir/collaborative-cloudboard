export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  access: "private" | "public";
  workspace: string;
  coverImg: File | null;
  createdAt: string;
}
