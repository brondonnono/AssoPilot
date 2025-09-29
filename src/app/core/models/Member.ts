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

export class MemberStore {
  name: string;
  phone: string;
  cni: string;
  status: MemberStatus;
  joined_date: string;

  constructor(name: string, cni: string, phone: string, joined_date: string) {
    this.name = name;
    this.phone = phone;
    this.joined_date = joined_date;
    this.cni = cni;
    this.status = MemberStatus.IN_REVIEW;
  }
}