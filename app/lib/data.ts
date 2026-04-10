import raw from "@/app/data/user.json"


export interface Account {
  account_id: string;
  bank: string;
  type: string;
  card_last4: string;
  product: string;
}

export interface Transaction {
  txn_id: string;
  account_id: string;
  bank: string;
  card_last4: string;
  date: string;
  merchant: string;
  category: string;
  subcategory?: string;
  amount: number;
  type: string;
}

export const accounts = raw.accounts as Account[];
export const transactions = raw.transactions as Transaction[];