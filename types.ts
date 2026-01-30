
/**
 * Types for the application domain model.
 */

export interface User {
  id: string;
  cnic: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  password?: string;
}

export interface Transaction {
  seq: number;
  transid: number;
  line_id: number;
  shortname: string;
  duedate: string;
  receivable: number;
  u_intno: number;
  u_intname: string;
  transtype: string;
  itemcode: string;
  plottype: string;
  currency: string;
  description: string;
  doctotal: number;
  status: string;
  balance: number;
  amount_paid: number;
  receipt_date: string;
  mode: string;
  surcharge: number;
  balduedeb: number;
  paysrc: any;
  instrument_no?: string;
}

export interface PropertyFile {
  fileNo: string;
  currencyNo: string;
  plotSize: string;
  plotValue: number;
  balance: number;
  receivable: number;
  totalReceivable: number;
  paymentReceived: number;
  surcharge: number;
  overdue: number;
  ownerName: string;
  ownerCNIC: string;
  fatherName: string;
  cellNo: string;
  regDate: string;
  address: string;
  plotNo: string;
  block: string;
  park: string;
  corner: string;
  mainBoulevard: string;
  transactions: Transaction[];
  lastNotified?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  type: string;
}

export const Roles = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN'
};
