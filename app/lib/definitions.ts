export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Menu = {
  id: string;
  nama_menu: string;
  harga_menu: number;
};

export type MenuTable = {
  id: string;
  nama_menu: string;
  harga_menu: number;
  jumlah:number;
};

export type Member = {
  id: string;
  nama_member: string;
  nohp_member: string;
};

export type MemberTable = {
  id: string;
  nama_member: string;
  nohp_member: string;
};

export type Transaksi = {
  id: string;
  member_nama:string;
  tanggal_transaksi: string;
  total_harga: number;
  pembayaran:number;
  kembalian:number;
};

export type TransaksiTable = {
  id: string;
  member_nama:string;
  tanggal_transaksi: string;
  total_harga: number;
  pembayaran:number;
  kembalian:number;
};
