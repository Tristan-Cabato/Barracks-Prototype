"use client";

import { FormEvent, useMemo, useState } from "react";
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
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Hash,
  Users,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const persistCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCustomers));
    }
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
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background dark:bg-[#08090a]">
      {/* Grid background (dark mode only) */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.03] dark:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline effect (dark mode only) */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.015] dark:block"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* ─── Header ─── */}
        <header
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
          style={{ animation: "fade-in 0.5s ease-out both" }}
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/5 dark:bg-amber-400/5">
                <Users className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              </div>
              <span className="font-mono text-[11px] font-medium tracking-[0.25em] uppercase text-muted-foreground">
                Module
              </span>
            </div>
            <h1
              className="text-4xl font-extrabold tracking-tight text-foreground dark:text-white md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Customers
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Browse, search, and manage all customer records.
            </p>
          </div>

          {/* Add Customer Button */}
          <div className="md:pt-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="h-10 gap-2 border border-amber-500/20 dark:border-amber-400/20 bg-amber-500/5 dark:bg-amber-400/5 text-amber-600 dark:text-amber-400 transition-all duration-300 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 hover:text-amber-700 dark:hover:text-amber-300"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wide">Add Customer</span>
                </Button>
              </DialogTrigger>

              {/* ─── Create Dialog ─── */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">Add Customer</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new customer record.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="create-form">
                  <div className="space-y-4 py-4">
                    <Field label="Name" icon={Users}>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, name: event.target.value }))
                        }
                        placeholder="John Doe"
                      />
                    </Field>
                    <Field label="Email" icon={Mail}>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, email: event.target.value }))
                        }
                        placeholder="name@email.com"
                      />
                    </Field>
                    <Field label="Contact Number" icon={Phone}>
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
                    </Field>
                  </div>
                  {formError && (
                    <p className="text-sm text-destructive">{formError}</p>
                  )}
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
        </header>

        {/* ─── Search & Sort Bar ─── */}
        <div
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ animation: "fade-in 0.5s 0.1s ease-out both" }}
        >
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
              <SelectItem value="name-asc">Name A–Z</SelectItem>
              <SelectItem value="name-desc">Name Z–A</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ─── Records Panel ─── */}
        <div
          className="overflow-hidden rounded-xl border border-border/40 dark:border-zinc-800/50 bg-card shadow-sm"
          style={{ animation: "fade-in 0.5s 0.2s ease-out both" }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                All Customers
              </span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                {filteredCustomers.length}
              </span>
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No customers match your search."
                  : "No customers yet. Add one to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="group flex items-center justify-between px-5 py-4 transition-all duration-300 hover:bg-accent/50"
                  style={{
                    animation: `fade-in 0.4s ${0.05 + index * 0.04}s ease-out both`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-card-foreground transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {customer.name}
                    </p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
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
                  <div className="ml-4 flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <IconBtn
                      icon={<Eye className="h-3.5 w-3.5" />}
                      label="View"
                      onClick={() => setViewingCustomerId(customer.id)}
                      hoverColor="hover:bg-primary/10 hover:text-primary"
                    />
                    <IconBtn
                      icon={<Pencil className="h-3.5 w-3.5" />}
                      label="Edit"
                      onClick={() => openEditDialog(customer)}
                      hoverColor="hover:bg-amber-500/10 hover:text-amber-500"
                    />
                    <IconBtn
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      label="Delete"
                      onClick={() => deleteCustomer(customer.id)}
                      hoverColor="hover:bg-destructive/10 hover:text-destructive"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Footer Note ─── */}
        <div
          className="mt-8 rounded-lg border border-border/30 bg-muted/30 px-5 py-4"
          style={{ animation: "fade-in 0.5s 0.5s ease-out both" }}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">Placeholder Data</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Records are seeded from a local JSON file and stored in your browser&apos;s
                localStorage. Once a backend is connected, data will sync across sessions and
                support real-time persistence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── View Customer Dialog ─── */}
      <Dialog open={!!viewingCustomerId} onOpenChange={(open) => !open && setViewingCustomerId(null)}>
        <DialogContent>
          {viewedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/5">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  {viewedCustomer.name}
                </DialogTitle>
                <DialogDescription>Customer Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <DetailRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={viewedCustomer.email} />
                <DetailRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Contact" value={viewedCustomer.contactNumber} />
                <DetailRow icon={<Hash className="h-4 w-4 text-muted-foreground" />} label="Record ID" value={viewedCustomer.id} mono />
                <DetailRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Created" value={new Date(viewedCustomer.createdAt).toLocaleString()} />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingCustomerId(null);
                    openEditDialog(viewedCustomer);
                  }}
                  className="hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewingCustomerId(null);
                    deleteCustomer(viewedCustomer.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Edit Customer Dialog ─── */}
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
              Update the details for <span className="font-semibold">{editingCustomer?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} id="edit-form">
            <div className="space-y-4 py-4">
              <Field label="Name" icon={Users}>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
              </Field>
              <Field label="Email" icon={Mail}>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, email: event.target.value }))
                  }
                  placeholder="name@email.com"
                />
              </Field>
              <Field label="Contact Number" icon={Phone}>
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
              </Field>
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
    </div>
  );
}

/* ─── Sub-components ─── */

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/50">
      <span className="mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          {label}
        </p>
        <p
          className={`text-sm text-foreground ${mono ? "font-mono break-all" : "truncate"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function IconBtn({
  icon,
  label,
  onClick,
  hoverColor,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hoverColor: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ${hoverColor}`}
    >
      {icon}
    </button>
  );
}
