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

const getInitialCustomers = (storageKey: string): Customer[] => {
  if (typeof window === "undefined") {
    return (seedCustomers as Customer[]).map((customer) => ({ ...customer }));
  }

  const storedRecords = window.localStorage.getItem(storageKey);

  if (!storedRecords) {
    return (seedCustomers as Customer[]).map((customer) => ({ ...customer }));
  }

  try {
    const parsed = JSON.parse(storedRecords) as unknown;

    if (Array.isArray(parsed) && parsed.every(isValidCustomer)) {
      return parsed;
    }

    const fallback = (seedCustomers as Customer[]).map((customer) => ({ ...customer }));
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  } catch {
    const fallback = (seedCustomers as Customer[]).map((customer) => ({ ...customer }));
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  }
};

export const useCustomerStorage = () => {
  const STORAGE_KEY = "barracks.customers.records";
  const [customers, setCustomers] = useState<Customer[]>(() =>
    getInitialCustomers(STORAGE_KEY),
  );

  // autosave to localstorage wenever customer change
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

const getInitialStaff = (storageKey: string): StaffMember[] => {
  if (typeof window === "undefined") {
    return (seedStaff as StaffMember[]).map((staff) => ({ ...staff }));
  }

  const storedRecords = window.localStorage.getItem(storageKey);

  if (!storedRecords) {
    return (seedStaff as StaffMember[]).map((staff) => ({ ...staff }));
  }

  try {
    const parsed = JSON.parse(storedRecords) as unknown;

    if (Array.isArray(parsed) && parsed.every(isValidStaff)) {
      return parsed;
    }

    const fallback = (seedStaff as StaffMember[]).map((staff) => ({ ...staff }));
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  } catch {
    const fallback = (seedStaff as StaffMember[]).map((staff) => ({ ...staff }));
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  }
};

export const useStaffStorage = () => {
  const STORAGE_KEY = "barracks.staff.records";
  const [staff, setStaff] = useState<StaffMember[]>(() => getInitialStaff(STORAGE_KEY));

  // autosave to localstorage wenever staff change
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

const getInitialInventory = (storageKey: string): InventoryItem[] => {
  if (typeof window === "undefined") {
    return (seedInventory as InventoryItem[]).map((item) => ({ ...item }));
  }

  const storedRecords = window.localStorage.getItem(storageKey);

  if (!storedRecords) {
    return (seedInventory as InventoryItem[]).map((item) => ({ ...item }));
  }

  try {
    const parsed = JSON.parse(storedRecords) as unknown;

    if (Array.isArray(parsed) && parsed.every(isInventoryItem)) {
      return parsed;
    }

    const fallback = (seedInventory as InventoryItem[]).map((item) => ({ ...item }));
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  } catch {
    const fallback = (seedInventory as InventoryItem[]).map((item) => ({ ...item }));
    window.localStorage.setItem(storageKey, JSON.stringify(fallback));
    return fallback;
  }
};

export const useInventoryStorage = () => {
  const STORAGE_KEY = "barracks.inventory.records";
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() =>
    getInitialInventory(STORAGE_KEY),
  );

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
