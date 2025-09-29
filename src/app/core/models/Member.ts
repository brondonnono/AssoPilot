import { MemberStatus } from "../enums/MemberStatus.enum";

export interface Member {
  id: string;
  name: string;
  phone: string;
  cni: string;
  status: MemberStatus;
  joined_date: string;
  created_at: string;
  updated_at: string;
}
