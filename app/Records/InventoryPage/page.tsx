"use client";

import { FormEvent, useMemo, useState } from "react";
import Header from "@/app/Display/Header";
import { useInventoryStorage } from "@/app/Records/DataPersistence/Storage";
import {
  type InventoryItem,
  type UrgencyLevel,
  URGENCY_LEVELS,
} from "@/app/lib/inventory-types";

type InventoryForm = {
  itemName: string;
  category: string;
  unitPrice: string;
  quantity: string;
  urgencyLevel: UrgencyLevel;
};

type SortBy = "name-asc" | "quantity-low" | "quantity-high" | "value-high" | "recent";

const emptyForm: InventoryForm = {
  itemName: "",
  category: "",
  unitPrice: "",
  quantity: "",
  urgencyLevel: "Medium",
};

const urgencyBadgeClasses: Record<UrgencyLevel, string> = {
  Low: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
  Medium: "bg-amber-500/20 text-amber-300 border border-amber-400/40",
  High: "bg-rose-500/20 text-rose-300 border border-rose-400/40",
};

export default function InventoryPage() {
  const { inventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } =
    useInventoryStorage();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("name-asc");
  const [formData, setFormData] = useState<InventoryForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set(inventoryItems.map((item) => item.category));
    return ["all", ...Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b))];
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const visibleItems = inventoryItems.filter((item) => {
      const matchesQuery =
        item.itemName.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.itemID.toLowerCase().includes(normalizedQuery);
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });

    return visibleItems.sort((a, b) => {
      if (sortBy === "quantity-low") {
        return a.quantity - b.quantity;
      }
      if (sortBy === "quantity-high") {
        return b.quantity - a.quantity;
      }
      if (sortBy === "value-high") {
        return b.unitPrice * b.quantity - a.unitPrice * a.quantity;
      }
      if (sortBy === "recent") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.itemName.localeCompare(b.itemName);
    });
  }, [inventoryItems, searchQuery, categoryFilter, sortBy]);

  const selectedItem =
    inventoryItems.find((item) => item.itemID === selectedItemId) ?? inventoryItems[0] ?? null;

  const lowStockItems = useMemo(
    () =>
      inventoryItems
        .filter((item) => item.quantity <= 5 || item.urgencyLevel === "High")
        .sort((a, b) => a.quantity - b.quantity),
    [inventoryItems],
  );

  const totalInventoryValue = useMemo(
    () => inventoryItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [inventoryItems],
  );

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingItemId(null);
    setFormError("");
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItemId(item.itemID);
    setFormData({
      itemName: item.itemName,
      category: item.category,
      unitPrice: String(item.unitPrice),
      quantity: String(item.quantity),
      urgencyLevel: item.urgencyLevel,
    });
    setFormError("");
    setStatusMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setStatusMessage("");

    const itemName = formData.itemName.trim();
    const category = formData.category.trim();
    const unitPrice = Number(formData.unitPrice);
    const quantity = Number(formData.quantity);

    if (!itemName || !category) {
      setFormError("Item name and category are required.");
      return;
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      setFormError("Unit price must be a valid number greater than or equal to 0.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setFormError("Quantity must be a whole number greater than or equal to 0.");
      return;
    }

    if (editingItemId) {
      updateInventoryItem(editingItemId, {
        itemName,
        category,
        unitPrice,
        quantity,
        urgencyLevel: formData.urgencyLevel,
      });
      setSelectedItemId(editingItemId);
      setStatusMessage("Inventory item updated.");
      resetForm();
      return;
    }

    const newItem = createInventoryItem({
      itemName,
      category,
      unitPrice,
      quantity,
      urgencyLevel: formData.urgencyLevel,
    });
    setSelectedItemId(newItem.itemID);
    setStatusMessage("Inventory item created.");
    resetForm();
  };

  const handleDeleteItem = (itemID: string) => {
    const targetItem = inventoryItems.find((item) => item.itemID === itemID);
    if (!targetItem) {
      setFormError("Inventory item not found.");
      return;
    }

    const confirmed = window.confirm(`Delete ${targetItem.itemName}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    const remainingItems = inventoryItems.filter((item) => item.itemID !== itemID);
    deleteInventoryItem(itemID);
    setFormError("");
    setStatusMessage("Inventory item deleted.");

    if (selectedItemId === itemID) {
      setSelectedItemId(remainingItems[0]?.itemID ?? null);
    }

    if (editingItemId === itemID) {
      resetForm();
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(190,24,93,0.35),_transparent_55%),linear-gradient(120deg,_#111827_0%,_#1f2937_40%,_#0f172a_100%)]">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-white md:px-8">
          <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
            <h1 className="text-3xl font-bold">Inventory Records</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage stock levels, item urgency, and inventory value using frontend-only JSON
              seeded storage.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by item name, category, or ID"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "Filter: All Categories" : `Category: ${category}`}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortBy)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
              >
                <option value="name-asc">Sort: Name A-Z</option>
                <option value="quantity-low">Sort: Quantity Low-High</option>
                <option value="quantity-high">Sort: Quantity High-Low</option>
                <option value="value-high">Sort: Value High-Low</option>
                <option value="recent">Sort: Recently Updated</option>
              </select>
            </div>

            <p className="mt-4 text-sm text-white/75">
              Total Inventory Value:{" "}
              <span className="font-semibold text-white">
                {totalInventoryValue.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </span>
            </p>
          </section>

          <main className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <section className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
              <h2 className="text-xl font-semibold">Record List View</h2>
              <p className="mt-1 text-sm text-white/70">{filteredItems.length} inventory item(s)</p>

              <div className="mt-4 space-y-3">
                {filteredItems.map((item) => (
                  <article
                    key={item.itemID}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-lg font-semibold">{item.itemName}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${urgencyBadgeClasses[item.urgencyLevel]}`}
                      >
                        {item.urgencyLevel} Urgency
                      </span>
                    </div>
                    <p className="text-sm text-white/75">Category: {item.category}</p>
                    <p className="text-sm text-white/75">Quantity: {item.quantity}</p>
                    <p className="text-sm text-white/75">
                      Unit Price:{" "}
                      {item.unitPrice.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>
                    <p className="text-sm text-white/60">Item ID: {item.itemID}</p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedItemId(item.itemID)}
                        className="rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-400"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-amber-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.itemID)}
                        className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}

                {filteredItems.length === 0 && (
                  <p className="rounded-xl border border-dashed border-white/25 p-5 text-center text-white/70">
                    No inventory records match your filters.
                  </p>
                )}
              </div>
            </section>

            <section className="space-y-6">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm"
              >
                <h2 className="text-xl font-semibold">
                  {editingItemId ? "Edit Inventory Item" : "Create Inventory Item"}
                </h2>

                <div className="mt-4 space-y-3">
                  <label className="block text-sm">
                    Item Name
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, itemName: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Category
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, category: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Unit Price
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, unitPrice: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Quantity
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={(event) =>
                        setFormData((previous) => ({ ...previous, quantity: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
                    />
                  </label>

                  <label className="block text-sm">
                    Urgency Level
                    <select
                      value={formData.urgencyLevel}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          urgencyLevel: event.target.value as UrgencyLevel,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 outline-none ring-pink-300 transition focus:ring-2"
                    >
                      {URGENCY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {formError && <p className="mt-3 text-sm text-rose-200">{formError}</p>}
                {statusMessage && <p className="mt-3 text-sm text-emerald-200">{statusMessage}</p>}

                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400"
                  >
                    {editingItemId ? "Save Changes" : "Add Inventory Item"}
                  </button>
                  {editingItemId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-md border border-white/30 px-4 py-2 font-semibold text-white hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <article className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
                <h2 className="text-xl font-semibold">Inventory Detail View</h2>

                {selectedItem ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-white/85">Item Name:</span>{" "}
                      {selectedItem.itemName}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Category:</span>{" "}
                      {selectedItem.category}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Quantity:</span>{" "}
                      {selectedItem.quantity}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Unit Price:</span>{" "}
                      {selectedItem.unitPrice.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Stock Value:</span>{" "}
                      {(selectedItem.unitPrice * selectedItem.quantity).toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Urgency:</span>{" "}
                      {selectedItem.urgencyLevel}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Item ID:</span>{" "}
                      {selectedItem.itemID}
                    </p>
                    <p>
                      <span className="font-semibold text-white/85">Last Updated:</span>{" "}
                      {new Date(selectedItem.updatedAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/70">Select an inventory item to view details.</p>
                )}
              </article>

              <article className="rounded-2xl border border-white/15 bg-black/45 p-5 backdrop-blur-sm">
                <h2 className="text-xl font-semibold">Stock Notifications</h2>
                <p className="mt-1 text-sm text-white/70">
                  Items with quantity ≤ 5 or marked as High urgency.
                </p>

                <div className="mt-3 space-y-2">
                  {lowStockItems.map((item) => (
                    <div
                      key={`notification-${item.itemID}`}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm"
                    >
                      <p className="font-semibold text-rose-200">{item.itemName}</p>
                      <p className="text-rose-100/90">
                        Qty: {item.quantity} • Urgency: {item.urgencyLevel}
                      </p>
                    </div>
                  ))}

                  {lowStockItems.length === 0 && (
                    <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                      No active low-stock notifications.
                    </p>
                  )}
                </div>
              </article>
            </section>
          </main>

        </div>
      </div>
    </>
  );
}
