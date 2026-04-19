export const URGENCY_LEVELS = ["Low", "Medium", "High"] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export type InventoryItem = {
  itemID: string;
  itemName: string;
  category: string;
  unitPrice: number;
  quantity: number;
  urgencyLevel: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
};

export type InventoryItemInput = Omit<InventoryItem, "itemID" | "createdAt" | "updatedAt">;

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

export const isUrgencyLevel = (value: unknown): value is UrgencyLevel =>
  typeof value === "string" && URGENCY_LEVELS.includes(value as UrgencyLevel);

export const isInventoryItem = (value: unknown): value is InventoryItem => {
  if (!isObjectRecord(value)) {
    return false;
  }

  return (
    typeof value.itemID === "string" &&
    typeof value.itemName === "string" &&
    typeof value.category === "string" &&
    typeof value.unitPrice === "number" &&
    Number.isFinite(value.unitPrice) &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 0 &&
    isUrgencyLevel(value.urgencyLevel) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
};

export type InventoryInputValidationResult =
  | { valid: true; data: InventoryItemInput }
  | { valid: false; message: string };

export const validateInventoryItemInput = (input: unknown): InventoryInputValidationResult => {
  if (!isObjectRecord(input)) {
    return { valid: false, message: "Payload must be an object." };
  }

  const itemName = typeof input.itemName === "string" ? input.itemName.trim() : "";
  if (!itemName) {
    return { valid: false, message: "Item name is required." };
  }

  const category = typeof input.category === "string" ? input.category.trim() : "";
  if (!category) {
    return { valid: false, message: "Category is required." };
  }

  const unitPrice = typeof input.unitPrice === "number" ? input.unitPrice : Number.NaN;
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return { valid: false, message: "Unit price must be a valid number greater than or equal to 0." };
  }

  const quantity = typeof input.quantity === "number" ? input.quantity : Number.NaN;
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { valid: false, message: "Quantity must be a whole number greater than or equal to 0." };
  }

  if (!isUrgencyLevel(input.urgencyLevel)) {
    return { valid: false, message: "Urgency level must be Low, Medium, or High." };
  }

  return {
    valid: true,
    data: {
      itemName,
      category,
      unitPrice,
      quantity,
      urgencyLevel: input.urgencyLevel,
    },
  };
};
