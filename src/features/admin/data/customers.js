// Tier ditentukan berdasarkan total belanja:
// Platinum >= 4.000.000 | Gold >= 2.000.000 | Silver >= 500.000 | Bronze < 500.000

export const customers = [
    {
        id: "CUST001",
        name: "Budi Santoso",
        email: "budi@email.com",
        city: "Jakarta Barat",
        joinDate: "Jan 2025",
        totalOrders: 12,
        totalSpending: 4250000,
        tier: "platinum",
    },
    {
        id: "CUST002",
        name: "Siti Rahayu",
        email: "siti@email.com",
        city: "Bandung",
        joinDate: "Mar 2025",
        totalOrders: 8,
        totalSpending: 2680000,
        tier: "gold",
    },
    {
        id: "CUST003",
        name: "Andi Wijaya",
        email: "andi.wijaya@email.com",
        city: "Surabaya",
        joinDate: "Feb 2025",
        totalOrders: 3,
        totalSpending: 650000,
        tier: "silver",
    },
    {
        id: "CUST004",
        name: "Dewi Lestari",
        email: "dewi.lestari@email.com",
        city: "Jakarta Selatan",
        joinDate: "Apr 2025",
        totalOrders: 5,
        totalSpending: 1820000,
        tier: "silver",
    },
    {
        id: "CUST005",
        name: "Rina Marlina",
        email: "rina.marlina@email.com",
        city: "Yogyakarta",
        joinDate: "Mei 2025",
        totalOrders: 1,
        totalSpending: 320000,
        tier: "bronze",
    },
    {
        id: "CUST006",
        name: "Joko Prasetyo",
        email: "joko.prasetyo@email.com",
        city: "Semarang",
        joinDate: "Jan 2026",
        totalOrders: 9,
        totalSpending: 3100000,
        tier: "gold",
    },
    {
        id: "CUST007",
        name: "Maya Putri",
        email: "maya.putri@email.com",
        city: "Medan",
        joinDate: "Feb 2026",
        totalOrders: 2,
        totalSpending: 480000,
        tier: "bronze",
    },
    {
        id: "CUST008",
        name: "Agus Setiawan",
        email: "agus.setiawan@email.com",
        city: "Depok",
        joinDate: "Mar 2026",
        totalOrders: 15,
        totalSpending: 5400000,
        tier: "platinum",
    },
];

export const customerStats = {
    totalCustomers: 3284,
    newThisMonth: 89,
    avgOrders: 4.2,
    satisfaction: 4.7,
};

// Data dummy untuk chart pertumbuhan pelanggan baru per bulan (2026)
export const customerGrowth = [
    { month: "Jan", value: 180 },
    { month: "Feb", value: 220 },
    { month: "Mar", value: 260 },
    { month: "Apr", value: 240 },
    { month: "Mei", value: 300 },
    { month: "Jun", value: 89 },
];