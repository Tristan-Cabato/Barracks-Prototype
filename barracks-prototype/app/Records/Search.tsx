"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { InventoryItem, StaffMember, useInventoryStorage, useStaffStorage } from "./DataPersistence/Storage";

type SortOption = {
  value: string;
  label: string;
};

const customerSortOptions = [
  { value: "name-asc", label: "Sort: Name A-Z" },
  { value: "name-desc", label: "Sort: Name Z-A" },
  { value: "recent", label: "Sort: Recently Added" },
];

const staffSortOptions = [
  { value: "name-asc", label: "Sort: Name A-Z" },
  { value: "salary-high", label: "Sort: Salary High-Low" },
  { value: "salary-low", label: "Sort: Salary Low-High" },
];

const inventorySortOptions = [
  { value: "name-asc", label: "Sort: Name A-Z" },
  { value: "quantity-low", label: "Sort: Quantity Low-High" },
  { value: "quantity-high", label: "Sort: Quantity High-Low" },
  { value: "value-high", label: "Sort: Value High-Low" },
  { value: "recent", label: "Sort: Recently Updated" },
];

function getUniqueCategories(inventoryItems: InventoryItem[]): string[] {
  const categories = new Set(inventoryItems.map(item => item.category));
  return ["all", ...Array.from(categories).sort()];
}

function getUniqueRoles(staffItems: StaffMember[]): string[] {
  const roles = new Set(staffItems.map(staff => staff.role));
  return ["all", ...Array.from(roles).sort()];
}

type SearchFilterProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  categoryFilter?: string;
  onCategoryChange?: (value: string) => void;
  categoryOptions?: string[];
  categoryLabel?: string;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  disabled?: boolean;
  disabledMessage?: string;
};

export default function SearchContainer() {
  const pathname = usePathname();
  
  // Get data from storage hooks
  const { inventoryItems } = useInventoryStorage();
  const { staff } = useStaffStorage();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  // Reset search when pathname changes
  useEffect(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setSortBy("name-asc");
  }, [pathname]);

  // Determine current page type
  const isDashboard = pathname === "/Display/LandingPage";
  const isCustomerRecords = pathname?.startsWith("/Records/CustomerRecords");
  const isStaffRecords = pathname?.startsWith("/Records/StaffRecords");
  const isInventoryPage = pathname?.startsWith("/Records/InventoryPage");

  const searchConfig = useMemo(() => {
    if (isCustomerRecords) {
      return {
        placeholder: "Search customers by name",
        sortOptions: customerSortOptions,
        categoryOptions: [],
        categoryLabel: "Filter",
      };
    }
    if (isStaffRecords) {
      return {
        placeholder: "Search staff by name",
        sortOptions: staffSortOptions,
        categoryOptions: getUniqueRoles(staff),
        categoryLabel: "Role",
      };
    }
    if (isInventoryPage) {
      return {
        placeholder: "Search by item name, category, or ID",
        sortOptions: inventorySortOptions,
        categoryOptions: getUniqueCategories(inventoryItems),
        categoryLabel: "Category",
      };
    }
    return {
      placeholder: "Search",
      sortOptions: [{ value: "name-asc", label: "Sort: A-Z" }],
      categoryOptions: [],
      categoryLabel: "Filter",
    };
  }, [isCustomerRecords, isStaffRecords, isInventoryPage, staff, inventoryItems]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    window.dispatchEvent(new CustomEvent("headerSearch", { detail: value }));
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    window.dispatchEvent(new CustomEvent("headerCategoryFilter", { detail: value }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    window.dispatchEvent(new CustomEvent("headerSort", { detail: value }));
  };

  return (
    <SearchFilter
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      searchPlaceholder={searchConfig.placeholder}
      categoryFilter={categoryFilter}
      onCategoryChange={searchConfig.categoryOptions.length > 0 ? handleCategoryChange : undefined}
      categoryOptions={searchConfig.categoryOptions}
      categoryLabel={searchConfig.categoryLabel}
      sortBy={sortBy}
      onSortChange={handleSortChange}
      sortOptions={searchConfig.sortOptions}
      disabled={isDashboard}
      disabledMessage="Nothing to search"
    />
  );
}

function SearchFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  categoryFilter,
  onCategoryChange,
  categoryOptions = [],
  categoryLabel = "Filter",
  sortBy,
  onSortChange,
  sortOptions,
  disabled = false,
  disabledMessage = "Nothing to search",
}: SearchFilterProps) {
  const hasCategories = categoryOptions.length > 0 && onCategoryChange;

  return (
    <div className={`flex flex-row items-center gap-2 ${disabled ? "group relative" : ""}`}>
      <div className="flex flex-row items-center gap-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            disabled={disabled}
            className={`
              pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition
              ${disabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white focus:ring-2 focus:ring-emerald-400"
              }
            `}
          />
        </div>

        {hasCategories && !disabled && (
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-gray-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? `${categoryLabel}: All` : `${categoryLabel}: ${option}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {!disabled && (
          <div className="relative">
            <ArrowUpDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-gray-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {disabled && (
        <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-600">
          {disabledMessage}
        </div>
      )}
    </div>
  );
}
