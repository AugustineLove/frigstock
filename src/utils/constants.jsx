export const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  items: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  suppliers: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  customers: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",
  purchases: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  sales: "M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  movements: "M17 1l4 4-4 4 M3 11V9a4 4 0 014-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 01-4 4H3",
  reports: "M18 20V10 M12 20V4 M6 20v-6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  plus: "M12 5v14 M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  close: "M18 6L6 18 M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  location: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a1 1 0 100-2 1 1 0 000 2",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  logo: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
};

export const seed = {
  categories: [
    { id: 1, name: "Electronics", parent: null },
    { id: 2, name: "Office Supplies", parent: null },
    { id: 3, name: "Furniture", parent: null },
    { id: 4, name: "Peripherals", parent: 1 },
  ],
  items: [
    { id: 1, name: "Laptop Pro 15", sku: "LP-001", categoryId: 1, type: "physical", costPrice: 800, sellingPrice: 1199, quantity: 24, threshold: 5, description: "High-performance laptop" },
    { id: 2, name: "Wireless Mouse", sku: "WM-002", categoryId: 4, type: "physical", costPrice: 12, sellingPrice: 29, quantity: 3, threshold: 10, description: "Ergonomic wireless mouse" },
    { id: 3, name: "Standing Desk", sku: "SD-003", categoryId: 3, type: "physical", costPrice: 300, sellingPrice: 499, quantity: 8, threshold: 2, description: "Adjustable standing desk" },
    { id: 4, name: "Printer Ink", sku: "PI-004", categoryId: 2, type: "physical", costPrice: 8, sellingPrice: 18, quantity: 2, threshold: 15, description: "Black ink cartridge" },
    { id: 5, name: "USB-C Hub", sku: "UH-005", categoryId: 4, type: "physical", costPrice: 20, sellingPrice: 45, quantity: 17, threshold: 8, description: "7-port USB-C hub" },
    { id: 6, name: "Cloud Storage Plan", sku: "CS-006", categoryId: 1, type: "digital", costPrice: 5, sellingPrice: 15, quantity: 999, threshold: 0, description: "Annual cloud storage" },
  ],
  suppliers: [
    { id: 1, name: "TechDistrib Inc.", email: "orders@techdistrib.com", phone: "+1 800 555 0101", address: "123 Warehouse Blvd, CA" },
    { id: 2, name: "OfficeWorld Co.", email: "supply@officeworld.com", phone: "+1 800 555 0202", address: "456 Commerce St, NY" },
  ],
  customers: [
    { id: 1, name: "Acme Corp", email: "procurement@acme.com", phone: "+1 555 100 2000" },
    { id: 2, name: "Nova Agency", email: "orders@nova.agency", phone: "+1 555 300 4000" },
  ],
  purchases: [
    { id: 1, supplierId: 1, totalAmount: 9600, purchaseDate: "2025-03-01", status: "Paid", items: [{ itemId: 1, qty: 12, unitCost: 800 }] },
    { id: 2, supplierId: 2, totalAmount: 240, purchaseDate: "2025-03-05", status: "Unpaid", items: [{ itemId: 4, qty: 30, unitCost: 8 }] },
  ],
  sales: [
    { id: 1, customerId: 1, totalAmount: 2398, saleDate: "2025-03-08", status: "Paid", items: [{ itemId: 1, qty: 2, unitPrice: 1199 }] },
    { id: 2, customerId: 2, totalAmount: 87, saleDate: "2025-03-09", status: "Paid", items: [{ itemId: 2, qty: 3, unitPrice: 29 }] },
  ],
  movements: [
    { id: 1, itemId: 1, type: "IN", quantity: 12, date: "2025-03-01", notes: "Purchase from TechDistrib", location: "Warehouse A" },
    { id: 2, itemId: 1, type: "OUT", quantity: 2, date: "2025-03-08", notes: "Sale to Acme Corp", location: "Warehouse A" },
    { id: 3, itemId: 2, type: "OUT", quantity: 3, date: "2025-03-09", notes: "Sale to Nova Agency", location: "Main Store" },
    { id: 4, itemId: 4, type: "ADJUSTMENT", quantity: -5, date: "2025-03-07", notes: "Damaged goods write-off", location: "Warehouse A" },
  ],
  users: [
    { id: 1, name: "Alex Rivera", email: "alex@frigstock.com", role: "Admin" },
    { id: 2, name: "Sam Chen", email: "sam@frigstock.com", role: "Manager" },
    { id: 3, name: "Jordan Lee", email: "jordan@frigstock.com", role: "Staff" },
  ],
};
