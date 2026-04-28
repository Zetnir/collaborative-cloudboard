export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string; // Assuming owner is represented by their ID
  members: string[]; // Assuming members are represented by their IDs
  createdAt: string;
}
