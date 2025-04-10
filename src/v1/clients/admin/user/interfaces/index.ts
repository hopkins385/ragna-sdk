import { PaginateMeta } from "../../../../interfaces";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersPaginated {
  users: User[];
  meta: PaginateMeta;
}

export interface UserCreate extends Omit<User, "id"> {
  password: string;
}

export interface InviteUserData extends Omit<User, "id"> {
  role?: string;
  isAdmin?: boolean;
}

export interface InviteUserResponse {
  inviteToken: string;
}
