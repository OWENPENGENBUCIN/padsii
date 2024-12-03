const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const members = [
  {
    nama_member: 'Evil Rabbit',
    nohp_member: '081234567890',
  },
  {
    nama_member: 'Delba de Oliveira',
    nohp_member: '082345678901',
  },
  {
    nama_member: 'Lee Robinson',
    nohp_member: '083456789012',
  },
  {
    nama_member: 'Michael Novotny',
    nohp_member: '084567890123',
  },
  {
    nama_member: 'Amy Burns',
    nohp_member: '085678901234',
  },
  {
    nama_member: 'Balazs Orban',
    nohp_member: '086789012345',
  },
  {
    nama_member: 'Rina Sari',
    nohp_member: '087890123456',
  },
  {
    nama_member: 'Toni Setiawan',
    nohp_member: '088901234567',
  },
  {
    nama_member: 'Siti Aminah',
    nohp_member: '089012345678',
  },
  {
    nama_member: 'Budi Santoso',
    nohp_member: '081098765432',
  },
];

const menus = [
  {
    nama_menu: 'Chicken Fillet Nashville',
    harga_menu: 30000,
  },
  {
    nama_menu: 'Nashville Rice Box Original',
    harga_menu: 30000,
  },
  {
    nama_menu: 'Bento Set Nashville',
    harga_menu: 25000,
  },
  {
    nama_menu: 'Air Mineral',
    harga_menu: 6000,
  },
  {
    nama_menu: 'Extra Salad',
    harga_menu: 3000,
  },
  {
    nama_menu: 'Nashville Chicken Spicy',
    harga_menu: 35000,
  },
  {
    nama_menu: 'Nashville Shrimp Roll',
    harga_menu: 45000,
  },
  {
    nama_menu: 'Egg Chicken Roll',
    harga_menu: 20000,
  },
  {
    nama_menu: 'Nashville Baby Katsu',
    harga_menu: 32000,
  },
];

const transaksis = [
  {
    member_nama:members[0].nama_member,
    tanggal_transaksi: '2024-11-01',
    total_harga: 30000,
    pembayaran:40000,
    kembalian:10000,
  },
  { 
    member_nama:members[1].nama_member,
    tanggal_transaksi: '2024-11-02',
    total_harga: 60000,
    pembayaran:80000,
    kembalian:20000,
  },
  {
    member_nama:members[2].nama_member,
    tanggal_transaksi: '2024-11-03',
    total_harga: 75000,
    pembayaran:50000,
    kembalian:25000,
  },
];



export { users, members, menus, transaksis};