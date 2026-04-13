"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import seedCustomers from "@/app/data/customers.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Pencil, Trash2, Mail, Phone, Calendar, Hash } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  createdAt: string;
};

type CustomerForm = {
  name: string;
  email: string;
  contactNumber: string;
};

const STORAGE_KEY = "barracks.customers.records";

const emptyForm: CustomerForm = {
  name: "",
  email: "",
  contactNumber: "",
};

const fallbackCustomers: Customer[] = (seedCustomers as Customer[]).map((customer) => ({
  ...customer,
}));

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

const getInitialCustomers = (): Customer[] => {
  if (typeof window === "undefined") {
    return fallbackCustomers;
  }

  const storedRecords = window.localStorage.getItem(STORAGE_KEY);

  if (!storedRecords) {
    return fallbackCustomers;
  }

  try {
    const parsed = JSON.parse(storedRecords) as unknown;

    if (Array.isArray(parsed) && parsed.every(isValidCustomer)) {
      return parsed;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackCustomers));
    return fallbackCustomers;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackCustomers));
    return fallbackCustomers;
  }
};

export default function CustomerRecordsPage() {
  const [customers, setCustomers] = useState<Customer[]>(() => getInitialCustomers());
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [viewingCustomerId, setViewingCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "recent">("name-asc");
  const [formData, setFormData] = useState<CustomerForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const persistCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
  };

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const visible = customers.filter((customer) =>
      customer.name.toLowerCase().includes(normalizedQuery),
    );

    return visible.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [customers, searchQuery, sortBy]);

  const viewedCustomer = customers.find((customer) => customer.id === viewingCustomerId) ?? null;
  const editingCustomer = customers.find((customer) => customer.id === editingCustomerId) ?? null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedContactNumber = formData.contactNumber.trim();

    if (!trimmedName || !trimmedEmail || !trimmedContactNumber) {
      setFormError("Name, email, and contact number are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!/^[+()\-\d\s]{7,}$/.test(trimmedContactNumber)) {
      setFormError("Please enter a valid contact number.");
      return;
    }

    setFormError("");

    if (editingCustomerId) {
      const updatedCustomers = customers.map((customer) =>
        customer.id === editingCustomerId
          ? {
              ...customer,
              name: trimmedName,
              email: trimmedEmail,
              contactNumber: trimmedContactNumber,
            }
          : customer,
      );

      persistCustomers(updatedCustomers);
      setEditingCustomerId(null);
      setFormData(emptyForm);
      return;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      contactNumber: trimmedContactNumber,
      createdAt: new Date().toISOString(),
    };

    const updatedCustomers = [newCustomer, ...customers];
    persistCustomers(updatedCustomers);
    setFormData(emptyForm);
    setCreateDialogOpen(false);
  };

  const startEdit = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      contactNumber: customer.contactNumber,
    });
    setFormError("");
  };

  const deleteCustomer = (customerId: string) => {
    const targetCustomer = customers.find((customer) => customer.id === customerId);

    if (!targetCustomer) {
      return;
    }

    const confirmed = window.confirm(`Delete ${targetCustomer.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const remainingCustomers = customers.filter((customer) => customer.id !== customerId);
    persistCustomers(remainingCustomers);

    if (editingCustomerId === customerId) {
      setEditingCustomerId(null);
      setFormData(emptyForm);
      setFormError("");
    }

    if (viewingCustomerId === customerId) {
      setViewingCustomerId(null);
    }
  };

  const cancelEdit = () => {
    setEditingCustomerId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const openCreateDialog = () => {
    setEditingCustomerId(null);
    setFormData(emptyForm);
    setFormError("");
    setCreateDialogOpen(true);
  };

  const openEditDialog = (customer: Customer) => {
    startEdit(customer);
  };

  return (
    <div className="container mx-auto py-8 px-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Records</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer data with search, sorting, and quick actions.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
              <DialogDescription>
                Fill in the customer details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} id="create-form">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, name: event.target.value }))
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, email: event.target.value }))
                    }
                    placeholder="name@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number</label>
                  <Input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        contactNumber: event.target.value,
                      }))
                    }
                    placeholder="+63 917 555 0111"
                  />
                </div>
              </div>
              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="create-form">
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search customers by name"
            className="pl-9"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as typeof sortBy)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Records Table */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">All Customers</h2>
            <Badge variant="secondary">
              {filteredCustomers.length} record{filteredCustomers.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? "No customers match your search." : "No customers yet. Add one to get started!"}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{customer.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      {customer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      {customer.contactNumber}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setViewingCustomerId(customer.id)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditDialog(customer)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteCustomer(customer.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Customer Dialog */}
      <Dialog open={!!viewingCustomerId} onOpenChange={(open) => !open && setViewingCustomerId(null)}>
        <DialogContent>
          {viewedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{viewedCustomer.name}</DialogTitle>
                <DialogDescription>Customer Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{viewedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Contact Number</p>
                    <p className="text-sm text-muted-foreground">{viewedCustomer.contactNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Record ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{viewedCustomer.id}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Created At</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(viewedCustomer.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingCustomerId(null);
                    openEditDialog(viewedCustomer);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewingCustomerId(null);
                    deleteCustomer(viewedCustomer.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog
        open={!!editingCustomerId}
        onOpenChange={(open) => {
          if (!open) cancelEdit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} id="edit-form">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, email: event.target.value }))
                  }
                  placeholder="name@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Number</label>
                <Input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      contactNumber: event.target.value,
                    }))
                  }
                  placeholder="+63 917 555 0111"
                />
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button type="submit" form="edit-form">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hardcoded Note */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-muted-foreground text-sm">
        <p>Note: These are hardcoded, I will replace them later with live data.</p>
      </div>
    </div>
  );
}
