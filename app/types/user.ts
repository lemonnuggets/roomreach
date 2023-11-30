import { ROLE } from "@/constants/roles";

export type Customer = {
  id: string;
  userId: string;
  name: string;
  gender: string;
  phone: string;
  block: string;
  room: number;
};
export type Deliverer = {
  id: string;
  userId: string;
  name: string;
  gender: string;
  phone: string;
};
export type UserAccount = {
  id: string;
  username: string;
  role: ROLE;
};
