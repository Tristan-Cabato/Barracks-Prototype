"use client";

import { User, Network, Package, TrendingUp } from 'lucide-react';
import LandingPage from "./LandingPageClient";
import { getAllCustomers, getAllStaff, getAllInventory } from "@/app/lib/records-api";
import { formatRelativeTime } from "@/app/Records/DataPersistence/Storage";

export default function DashboardWrapper() {
    const customers = getAllCustomers();
    const staff = getAllStaff();
    const inventoryItems = getAllInventory();

    const customerCount = customers.length.toLocaleString();
    const staffCount = staff.length.toString();
    const inventoryCount = inventoryItems.length.toString();

    const cardsData = [
        {
            title: "Customer Records",
            totalLabel: "Total Records",
            total: customerCount,
            recentLabel: "Recent:",
            recent: customers[0] ? `#${customers[0].id.slice(-4)} - ${customers[0].name}` : "No records",
            updated: formatRelativeTime(customers[0]?.createdAt || new Date().toISOString()),
            href: "/Records/CustomerRecords",
            icon: <User size={20} />,
            color: "yellow"
        },
        {
            title: "Staff Records",
            totalLabel: "Total Staff:",
            total: staffCount,
            recentLabel: "Recent:",
            recent: staff[0] ? `#${staff[0].id.slice(-4)} - ${staff[0].name} (${staff[0].role})` : "No records",
            updated: formatRelativeTime(staff[0]?.createdAt || new Date().toISOString()),
            href: "/Records/StaffRecords",
            icon: <Network size={20} />,
            color: "green"
        },
        {
            title: "Inventory",
            totalLabel: "Total Items:",
            total: inventoryCount,
            recentLabel: "Recent:",
            recent: inventoryItems[0] ? `#${inventoryItems[0].itemID.slice(-4)} - ${inventoryItems[0].itemName}` : "No records",
            updated: formatRelativeTime(inventoryItems[0]?.updatedAt || new Date().toISOString()),
            href: "/Records/InventoryPage",
            icon: <Package size={20} />,
            color: "pink"
        }
    ];

    const smallCardsData = [
        { title: "CUSTOMERS", icon: <User size={16} />, value: customerCount, color: "yellow" },
        { title: "STAFF", icon: <Network size={16} />, value: staffCount, color: "green" },
        { title: "PRODUCTS", icon: <Package size={16} />, value: inventoryCount, color: "pink" },
        { title: "LATEST ENTRY", icon: <Package size={16} />, value: customers[0] ? `#${customers[0].id.slice(-4)}` : "—", color: "blue" },
        { title: "SYNC", icon: <TrendingUp size={16} />, value: "LIVE", color: "purple" }
    ];

    return <LandingPage cardsData={cardsData} smallCardsData={smallCardsData} />;
}