"use client";

import { useEffect, useState } from "react";
import seedCustomers from "@/app/data/customers.json";
import seedInventory from "@/app/data/inventory.json";
import seedStaff from "@/app/data/staff.json";
import {
  type InventoryItem,
  type UrgencyLevel,
  isInventoryItem,
} from "@/app/lib/inventory-types";

// ==================== cuhs ====================

export type Customer = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
};

const isValidCustomer = (value: unknown): value is Customer => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const customer = value as Record<string, unknown>;

  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.contactNumber === "string" &&
    typeof customer.createdAt === "string"
  );
};

export const useCustomerStorage = () => {
  const STORAGE_KEY = "barracks.customers.records";
  // Initialize with seed data to avoid SSR hydration mismatch
  const [customers, setCustomers] = useState<Customer[]>(() =>
    (seedCustomers as Customer[]).map((customer) => ({ ...customer }))
  );

  // Load from localStorage after mount (client-only)
  useEffect(() => {
    const storedRecords = window.localStorage.getItem(STORAGE_KEY);
    if (storedRecords) {
      try {
        const parsed = JSON.parse(storedRecords) as unknown;
        if (Array.isArray(parsed) && parsed.every(isValidCustomer)) {
          setCustomers(parsed);
        }
      } catch {
        // ignore, keep seed data
      }
    }
  }, []);

  // autosave to localstorage whenever customer change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const createCustomer = (formData: {
    name: string;
    email: string;
    contactNumber: string;
  }): Customer => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      createdAt: new Date().toISOString(),
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (
    customerId: string,
    formData: { name: string; email: string; contactNumber: string },
  ) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              name: formData.name,
              email: formData.email,
              contactNumber: formData.contactNumber,
            }
          : customer,
      ),
    );
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
  };

  return {
    customers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};

// ==================== stah ====================

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  contactNumber: string;
  monthlySalary: number;
  createdAt: string;
};

const defaultAdminStaff: StaffMember[] = [
  {
    id: "admin-0001",
    name: "System Admin",
    role: "admin",
    email: "admin@barracks.local",
    contactNumber: "N/A",
    monthlySalary: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const isAdminStaff = (member: StaffMember) =>
  member.role.trim().toLowerCase() === "admin" || member.id.startsWith("admin-");

const ensureAdminInStaff = (staffList: StaffMember[]): StaffMember[] => {
  const hasAdmin = staffList.some(isAdminStaff);

  if (hasAdmin) {
    return staffList;
  }

  return [...defaultAdminStaff.map((admin) => ({ ...admin })), ...staffList];
};

const isValidStaff = (value: unknown): value is StaffMember => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const member = value as Record<string, unknown>;

  return (
    typeof member.id === "string" &&
    typeof member.name === "string" &&
    typeof member.role === "string" &&
    typeof member.email === "string" &&
    typeof member.contactNumber === "string" &&
    typeof member.monthlySalary === "number" &&
    typeof member.createdAt === "string"
  );
};

export const useStaffStorage = () => {
  const STORAGE_KEY = "barracks.staff.records";
  // Initialize with seed data to avoid SSR hydration mismatch
  const [staff, setStaff] = useState<StaffMember[]>(() =>
    ensureAdminInStaff((seedStaff as StaffMember[]).map((s) => ({ ...s })))
  );

  // Load from localStorage after mount (client-only)
  useEffect(() => {
    const storedRecords = window.localStorage.getItem(STORAGE_KEY);
    if (storedRecords) {
      try {
        const parsed = JSON.parse(storedRecords) as unknown;
        if (Array.isArray(parsed) && parsed.every(isValidStaff)) {
          setStaff(ensureAdminInStaff(parsed));
        }
      } catch {
        // ignore, keep seed data
      }
    }
  }, []);

  // autosave to localstorage whenever staff change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  }, [staff]);

  const createStaff = (formData: {
    name: string;
    role: string;
    email: string;
    contactNumber: string;
    monthlySalary: number;
  }): StaffMember => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      contactNumber: formData.contactNumber,
      monthlySalary: formData.monthlySalary,
      createdAt: new Date().toISOString(),
    };

    setStaff((prev) => [newStaff, ...prev]);
    return newStaff;
  };

  const updateStaff = (
    staffId: string,
    formData: {
      name: string;
      role: string;
      email: string;
      contactNumber: string;
      monthlySalary: number;
    },
  ) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === staffId
          ? {
              ...member,
              name: formData.name,
              role: formData.role,
              email: formData.email,
              contactNumber: formData.contactNumber,
              monthlySalary: formData.monthlySalary,
            }
          : member,
      ),
    );
  };

  const deleteStaff = (staffId: string) => {
    setStaff((prev) => prev.filter((member) => member.id !== staffId));
  };

  return {
    staff,
    createStaff,
    updateStaff,
    deleteStaff,
  };
};

// ==================== inventory ====================

export type { InventoryItem };

export const useInventoryStorage = () => {
  const STORAGE_KEY = "barracks.inventory.records";
  // Initialize with seed data to avoid SSR hydration mismatch
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() =>
    (seedInventory as InventoryItem[]).map((item) => ({ ...item }))
  );

  // Load from localStorage after mount (client-only)
  useEffect(() => {
    const storedRecords = window.localStorage.getItem(STORAGE_KEY);
    if (storedRecords) {
      try {
        const parsed = JSON.parse(storedRecords) as unknown;
        if (Array.isArray(parsed) && parsed.every(isInventoryItem)) {
          setInventoryItems(parsed);
        }
      } catch {
        // ignore, keep seed data
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  const createInventoryItem = (formData: {
    itemName: string;
    category: string;
    unitPrice: number;
    quantity: number;
    urgencyLevel: UrgencyLevel;
  }): InventoryItem => {
    const now = new Date().toISOString();
    const newItem: InventoryItem = {
      itemID: `item-${Date.now()}`,
      itemName: formData.itemName,
      category: formData.category,
      unitPrice: formData.unitPrice,
      quantity: formData.quantity,
      urgencyLevel: formData.urgencyLevel,
      createdAt: now,
      updatedAt: now,
    };

    setInventoryItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateInventoryItem = (
    itemID: string,
    formData: {
      itemName: string;
      category: string;
      unitPrice: number;
      quantity: number;
      urgencyLevel: UrgencyLevel;
    },
  ) => {
    const now = new Date().toISOString();
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.itemID === itemID
          ? {
              ...item,
              itemName: formData.itemName,
              category: formData.category,
              unitPrice: formData.unitPrice,
              quantity: formData.quantity,
              urgencyLevel: formData.urgencyLevel,
              updatedAt: now,
            }
          : item,
      ),
    );
  };

  const deleteInventoryItem = (itemID: string) => {
    setInventoryItems((prev) => prev.filter((item) => item.itemID !== itemID));
  };

  return {
    inventoryItems,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  };
};

// Time Formatting

export function formatRelativeTime(isoDateString: string): string {
  const date = new Date(isoDateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Updated: Just now";
  } else if (diffMinutes < 60) {
    return `Updated: ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `Updated: ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `Updated: ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else { return `Updated: ${date.toLocaleDateString()}`; }
}
