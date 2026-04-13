"use client";

import { FormEvent, useMemo, useState } from "react";
import seedStaff from "@/app/data/staff.json";
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
  Hash,
  UserCheck,
  Banknote,
  Briefcase,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  contactNumber: string;
  monthlySalary: number;
  createdAt: string;
};

type StaffForm = {
  name: string;
  role: string;
  email: string;
  contactNumber: string;
  monthlySalary: string;
};

const STORAGE_KEY = "barracks.staff.records";

const emptyForm: StaffForm = {
  name: "",
  role: "",
  email: "",
  contactNumber: "",
  monthlySalary: "",
};

const fallbackStaff: StaffMember[] = (seedStaff as StaffMember[]).map((staff) => ({ ...staff }));

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

const getInitialStaff = (): StaffMember[] => {
  if (typeof window === "undefined") {
    return fallbackStaff;
  }

  const storedRecords = window.localStorage.getItem(STORAGE_KEY);

  if (!storedRecords) {
    return fallbackStaff;
  }

  try {
    const parsed = JSON.parse(storedRecords) as unknown;

    if (Array.isArray(parsed) && parsed.every(isValidStaff)) {
      return parsed;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackStaff));
    return fallbackStaff;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackStaff));
    return fallbackStaff;
  }
};

export default function StaffRecordsPage() {
  const [staff, setStaff] = useState<StaffMember[]>(() => getInitialStaff());
  const [viewingStaffId, setViewingStaffId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "salary-high" | "salary-low">("name-asc");
  const [formData, setFormData] = useState<StaffForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const roleOptions = useMemo(() => {
    const uniqueRoles = new Set(staff.map((member) => member.role).filter(Boolean));
    return ["all", ...Array.from(uniqueRoles).sort((a, b) => a.localeCompare(b))];
  }, [staff]);

  const filteredStaff = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const visible = staff.filter((member) => {
      const matchesName = member.name.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      return matchesName && matchesRole;
    });

    return visible.sort((a, b) => {
      if (sortBy === "salary-high") {
        return b.monthlySalary - a.monthlySalary;
      }

      if (sortBy === "salary-low") {
        return a.monthlySalary - b.monthlySalary;
      }

      return a.name.localeCompare(b.name);
    });
  }, [staff, searchQuery, roleFilter, sortBy]);

  const viewingStaff = staff.find((member) => member.id === viewingStaffId) ?? null;
  const editingStaff = staff.find((member) => member.id === editingStaffId) ?? null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedRole = formData.role.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedContactNumber = formData.contactNumber.trim();
    const salary = Number(formData.monthlySalary);

    if (
      !trimmedName ||
      !trimmedRole ||
      !trimmedEmail ||
      !trimmedContactNumber ||
      !formData.monthlySalary.trim()
    ) {
      setFormError("All fields are required.");
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

    if (Number.isNaN(salary) || salary <= 0) {
      setFormError("Monthly salary must be a valid amount greater than 0.");
      return;
    }

    setFormError("");

    if (editingStaffId) {
      const updatedStaff = staff.map((member) =>
        member.id === editingStaffId
          ? {
              ...member,
              name: trimmedName,
              role: trimmedRole,
              email: trimmedEmail,
              contactNumber: trimmedContactNumber,
              monthlySalary: salary,
            }
          : member,
      );

      persistStaff(updatedStaff);
      setEditingStaffId(null);
      setFormData(emptyForm);
      return;
    }

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: trimmedName,
      role: trimmedRole,
      email: trimmedEmail,
      contactNumber: trimmedContactNumber,
      monthlySalary: salary,
      createdAt: new Date().toISOString(),
    };

    const updatedStaff = [newStaff, ...staff];
    persistStaff(updatedStaff);
    setFormData(emptyForm);
    setCreateDialogOpen(false);
  };

  const startEdit = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      contactNumber: member.contactNumber,
      monthlySalary: String(member.monthlySalary),
    });
    setFormError("");
  };

  const deleteStaff = (staffId: string) => {
    const targetStaff = staff.find((member) => member.id === staffId);

    if (!targetStaff) {
      return;
    }

    const confirmed = window.confirm(`Delete ${targetStaff.name}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const remainingStaff = staff.filter((member) => member.id !== staffId);
    persistStaff(remainingStaff);

    if (editingStaffId === staffId) {
      setEditingStaffId(null);
      setFormData(emptyForm);
      setFormError("");
    }

    if (viewingStaffId === staffId) {
      setViewingStaffId(null);
    }
  };

  const cancelEdit = () => {
    setEditingStaffId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const persistStaff = (updatedStaff: StaffMember[]) => {
    setStaff(updatedStaff);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStaff));
    }
  };

  const openCreateDialog = () => {
    setEditingStaffId(null);
    setFormData(emptyForm);
    setFormError("");
    setCreateDialogOpen(true);
  };

  const openEditDialog = (member: StaffMember) => {
    startEdit(member);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background dark:bg-[#08090a]">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px),
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
            <div className="mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5">
                <UserCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
            <h1
              className="text-4xl font-extrabold tracking-tight text-foreground dark:text-white md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
            >
              Staff
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Track staff details, filter by role, and monitor monthly salaries.
            </p>
          </div>

          {/* Add Staff Button */}
          <div className="md:pt-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="h-10 gap-2 border border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5 text-emerald-600 dark:text-emerald-400 transition-all duration-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 hover:text-emerald-700 dark:hover:text-emerald-300"
                  style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wide">Add Staff</span>
                </Button>
              </DialogTrigger>

              {/* ─── Create Dialog ─── */}
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">Add Staff</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new staff member.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="create-form">
                  <div className="space-y-4 py-4">
                    <Field label="Name" icon={UserCheck}>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, name: event.target.value }))
                        }
                        placeholder="John Doe"
                      />
                    </Field>
                    <Field label="Role" icon={Briefcase}>
                      <Input
                        type="text"
                        value={formData.role}
                        onChange={(event) =>
                          setFormData((previous) => ({ ...previous, role: event.target.value }))
                        }
                        placeholder="e.g., Barber, Cashier"
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
                        placeholder="+63 917 555 0210"
                      />
                    </Field>
                    <Field label="Monthly Salary" icon={Banknote}>
                      <Input
                        type="number"
                        min="0"
                        value={formData.monthlySalary}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            monthlySalary: event.target.value,
                          }))
                        }
                        placeholder="20000"
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
                    Add Staff
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* ─── Search & Filters ─── */}
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
              placeholder="Search staff by name"
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] border-border/40 dark:border-zinc-800/50">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="border-border/40 dark:border-zinc-800/50">
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role === "all" ? "All Roles" : role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as typeof sortBy)}
          >
            <SelectTrigger className="w-full sm:w-[200px] border-border/40 dark:border-zinc-800/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-border/40 dark:border-zinc-800/50">
              <SelectItem value="name-asc">Name A–Z</SelectItem>
              <SelectItem value="salary-high">Salary High–Low</SelectItem>
              <SelectItem value="salary-low">Salary Low–High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ─── Records Panel ─── */}
        <div
          className="overflow-hidden rounded-xl border border-border/40 dark:border-zinc-800/50 bg-card shadow-sm"
          style={{ animation: "fade-in 0.5s 0.2s ease-out both" }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border/30 dark:border-zinc-800/40 bg-muted/30 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground">
                All Staff
              </span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
                {filteredStaff.length}
              </span>
            </div>
          </div>

          {filteredStaff.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery || roleFilter !== "all"
                  ? "No staff records match your filters."
                  : "No staff yet. Add one to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40 dark:divide-zinc-800/50">
              {filteredStaff.map((member, index) => (
                <div
                  key={member.id}
                  className="group flex items-center justify-between px-5 py-4 transition-all duration-300 hover:bg-muted/40 dark:hover:bg-zinc-800/30"
                  style={{
                    animation: `fade-in 0.4s ${0.05 + index * 0.04}s ease-out both`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-card-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {member.name}
                    </p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <Briefcase className="h-3 w-3 flex-shrink-0" />
                        {member.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3 w-3 flex-shrink-0" />
                        {member.monthlySalary.toLocaleString("en-PH", {
                          style: "currency",
                          currency: "PHP",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <IconBtn
                      icon={<Eye className="h-3.5 w-3.5" />}
                      label="View"
                      onClick={() => setViewingStaffId(member.id)}
                      hoverColor="hover:bg-primary/10 hover:text-primary"
                    />
                    <IconBtn
                      icon={<Pencil className="h-3.5 w-3.5" />}
                      label="Edit"
                      onClick={() => openEditDialog(member)}
                      hoverColor="hover:bg-emerald-500/10 hover:text-emerald-500"
                    />
                    <IconBtn
                      icon={<Trash2 className="h-3.5 w-3.5" />}
                      label="Delete"
                      onClick={() => deleteStaff(member.id)}
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
            <span className="mt-0.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400" />
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

      {/* ─── View Staff Dialog ─── */}
      <Dialog open={!!viewingStaffId} onOpenChange={(open) => !open && setViewingStaffId(null)}>
        <DialogContent>
          {viewingStaff && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5">
                    <UserCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  {viewingStaff.name}
                </DialogTitle>
                <DialogDescription>Staff Details</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                <DetailRow icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} label="Role" value={viewingStaff.role} />
                <DetailRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={viewingStaff.email} />
                <DetailRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Contact" value={viewingStaff.contactNumber} />
                <DetailRow icon={<Banknote className="h-4 w-4 text-muted-foreground" />} label="Monthly Salary" value={viewingStaff.monthlySalary.toLocaleString("en-PH", { style: "currency", currency: "PHP" })} />
                <DetailRow icon={<Hash className="h-4 w-4 text-muted-foreground" />} label="Record ID" value={viewingStaff.id} mono />
                <DetailRow icon={<Hash className="h-4 w-4 text-muted-foreground" />} label="Created" value={new Date(viewingStaff.createdAt).toLocaleString()} />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingStaffId(null);
                    openEditDialog(viewingStaff);
                  }}
                  className="hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingStaffId(null);
                    deleteStaff(viewingStaff.id);
                  }}
                  className="border-red-500/20 dark:border-red-400/20 bg-red-500/5 dark:bg-red-400/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 hover:text-red-700 dark:hover:text-red-300 hover:border-red-500/30 dark:hover:border-red-400/30"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Edit Staff Dialog ─── */}
      <Dialog
        open={!!editingStaffId}
        onOpenChange={(open) => {
          if (!open) cancelEdit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>
              Update the details for <span className="font-semibold">{editingStaff?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} id="edit-form">
            <div className="space-y-4 py-4">
              <Field label="Name" icon={UserCheck}>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, name: event.target.value }))
                  }
                />
              </Field>
              <Field label="Role" icon={Briefcase}>
                <Input
                  type="text"
                  value={formData.role}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, role: event.target.value }))
                  }
                  placeholder="e.g., Barber, Cashier"
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
                  placeholder="+63 917 555 0210"
                />
              </Field>
              <Field label="Monthly Salary" icon={Banknote}>
                <Input
                  type="number"
                  min="0"
                  value={formData.monthlySalary}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      monthlySalary: event.target.value,
                    }))
                  }
                  placeholder="20000"
                />
              </Field>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-form"
              className="border border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
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
    <div className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/40 dark:hover:bg-zinc-800/30">
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
