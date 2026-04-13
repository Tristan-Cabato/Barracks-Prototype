"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import seedStaff from "@/app/data/staff.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name-asc" | "salary-high" | "salary-low">("name-asc");
  const [formData, setFormData] = useState<StaffForm>(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  }, [staff]);

  const persistStaff = (updatedStaff: StaffMember[]) => {
    setStaff(updatedStaff);
  };

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

  const selectedStaff = staff.find((member) => member.id === selectedStaffId) ?? staff[0] ?? null;

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
      setSelectedStaffId(editingStaffId);
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
    setSelectedStaffId(newStaff.id);
    setFormData(emptyForm);
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

    setSelectedStaffId((previous) => (previous === staffId ? remainingStaff[0]?.id ?? null : previous));
  };

  const cancelEdit = () => {
    setEditingStaffId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(6,95,70,0.5),_transparent_55%),linear-gradient(120deg,_#111827_0%,_#1f2937_35%,_#0f172a_100%)]">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-white md:px-8">
        <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
          <h1 className="text-3xl font-bold">Staff Records</h1>
          <p className="mt-1 text-sm text-white/70">
            Track staff details, filter by role, and monitor monthly salary quickly.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search staff by name"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2 text-white"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role === "all" ? "Filter: All Roles" : `Role: ${role}`}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "name-asc" | "salary-high" | "salary-low")
              }
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-emerald-300 transition focus:ring-2 text-white"
            >
              <option value="name-asc">Sort: Name A-Z</option>
              <option value="salary-high">Sort: Salary High-Low</option>
              <option value="salary-low">Sort: Salary Low-High</option>
            </select>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="rounded-2xl border border-white/15 bg-black/45 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Record List View</CardTitle>
              <CardDescription className="text-white/70">
                {filteredStaff.length} staff record(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStaff.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
                  >
                    <p className="text-lg font-semibold">{member.name}</p>
                    <p className="text-sm text-white/75">{member.role}</p>
                    <p className="text-sm text-white/75">{member.email}</p>
                    <p className="text-sm text-white/75">{member.contactNumber}</p>
                    <p className="text-sm text-white/75">
                      Monthly Salary:{" "}
                      {member.monthlySalary.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedStaffId(member.id)}
                        className="bg-sky-500 hover:bg-sky-400 text-white"
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => startEdit(member)}
                        className="bg-amber-500 hover:bg-amber-400 text-black"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteStaff(member.id)}
                        className="bg-rose-600 hover:bg-rose-500 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}

                {filteredStaff.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/25 p-5 text-center text-white/70">
                    No staff records match your filters.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <section className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm"
            >
              <h2 className="text-xl font-semibold">{editingStaffId ? "Edit Staff" : "Create Staff"}</h2>

              <div className="mt-4 space-y-3">
                <label className="block text-sm">
                  Name
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, name: event.target.value }))
                    }
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </label>

                <label className="block text-sm">
                  Role
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, role: event.target.value }))
                    }
                    placeholder="e.g., Barber, Cashier"
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </label>

                <label className="block text-sm">
                  Email
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, email: event.target.value }))
                    }
                    placeholder="name@email.com"
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </label>

                <label className="block text-sm">
                  Contact Number
                  <Input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, contactNumber: event.target.value }))
                    }
                    placeholder="+63 917 555 0210"
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </label>

                <label className="block text-sm">
                  Monthly Salary
                  <Input
                    type="number"
                    min="0"
                    value={formData.monthlySalary}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, monthlySalary: event.target.value }))
                    }
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </label>
              </div>

              {formError && <p className="mt-3 text-sm text-red-300">{formError}</p>}

              <div className="mt-4 flex gap-2">
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black">
                  {editingStaffId ? "Save Changes" : "Add Staff"}
                </Button>
                {editingStaffId && (
                  <Button
                    type="button"
                    onClick={cancelEdit}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            <Card className="rounded-2xl border border-white/15 bg-black/45 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Staff Detail View</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStaff ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-white/85">Name:</span> {selectedStaff.name}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Role:</span> {selectedStaff.role}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Email:</span> {selectedStaff.email}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Contact Number:</span>{" "}
                      {selectedStaff.contactNumber}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Monthly Salary:</span>{" "}
                      {selectedStaff.monthlySalary.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Record ID:</span> {selectedStaff.id}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => deleteStaff(selectedStaff.id)}
                      className="mt-2 bg-rose-700 hover:bg-rose-600 text-white"
                    >
                      Delete This Staff Record
                    </Button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/70">Select a staff member to view full info.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}