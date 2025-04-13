import { PaginateMeta } from "../../../../interfaces";

interface Organisation {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface DetailedUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  roles: Role[];
  teams: Team[];
  organisation: Organisation;
  lastLoginAt: Date;
  onboardedAt: Date;
  emailVerifiedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersPaginated {
  users: DetailedUser[];
  meta: PaginateMeta;
}

export interface CreateUserData extends Omit<User, "id"> {
  password: string;
}

export interface InviteUserData extends Omit<User, "id"> {
  role?: string;
  isAdmin?: boolean;
}

export interface InviteUserResponse {
  inviteToken: string;
}

export interface FetchUserResponse {
  user: User;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface UpdateUserResponse {
  user: User;
}
