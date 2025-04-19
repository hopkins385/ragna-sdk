import { PaginateMeta } from "../../../../interfaces";

export interface Team {
  id: string;
  name: string;
}

export interface TeamsPaginated {
  teams: Team[];
  meta: PaginateMeta;
}

export interface TeamResponse {
  team: Team;
}
