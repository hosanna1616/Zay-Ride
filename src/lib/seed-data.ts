import type { Debt, Transaction } from "@/types";
import { createLocalId } from "@/lib/utils";
import { subDays } from "date-fns";

/**
 * Realistic Merkato-style demo data (amounts in ብር).
 * On first app load, persisted stores hydrate empty; `seedIfEmpty` in each store applies this once.
 * API INTEGRATION: Remove seeding; fetch `GET /v1/transactions` etc. after auth.
 */

const now = new Date();

function d(daysAgo: number): string {
  return subDays(now, daysAgo).toISOString();
}

export const DEFAULT_SHOP = {
  name: "Merkato Spice & Grains",
  pickupAddress: "St. George Merkato, Shop Block C-12, Addis Ababa",
  phone: "+251 91 234 5678",
};

export function buildSeedTransactions(): Transaction[] {
  return [
    {
      id: createLocalId(),
      type: "sale",
      amount: 2400,
      product: "Injera (50 pcs wholesale)",
      customerName: "Ato Kebede",
      note: "Restaurant supply",
      createdAt: d(0),
      deliveryRequested: false,
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 3200,
      product: "Teff (red, 50kg)",
      customerName: "Woizero Selam",
      createdAt: d(0),
    },
    {
      id: createLocalId(),
      type: "expense",
      amount: 850,
      product: "Transport — mercato run",
      note: "Mini truck",
      createdAt: d(1),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 1800,
      product: "Cooking Oil (20L)",
      customerName: "Ato Tesfaye",
      createdAt: d(1),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 950,
      product: "Berbere & Mitmita bundle",
      createdAt: d(2),
    },
    {
      id: createLocalId(),
      type: "expense",
      amount: 1200,
      product: "Storage rent (weekly)",
      createdAt: d(2),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 4100,
      product: "Coffee beans (20kg)",
      customerName: "Ato Kebede",
      createdAt: d(3),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 650,
      product: "Shiro & spices mix",
      createdAt: d(4),
    },
    {
      id: createLocalId(),
      type: "expense",
      amount: 400,
      product: "Packaging & bags",
      createdAt: d(4),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 2750,
      product: "Injera + Teff combo",
      customerName: "Woizero Selam",
      createdAt: d(5),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 1400,
      product: "Niger seed oil (10L)",
      createdAt: d(6),
    },
    {
      id: createLocalId(),
      type: "expense",
      amount: 600,
      product: "Electric bill share",
      createdAt: d(7),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 2200,
      product: "Kolo & snack supply",
      customerName: "Ato Tesfaye",
      createdAt: d(8),
    },
    {
      id: createLocalId(),
      type: "sale",
      amount: 500,
      product: "Small retail spices",
      createdAt: d(9),
    },
  ];
}

export function buildSeedDebts(): Debt[] {
  return [
    {
      id: createLocalId(),
      customerName: "Ato Kebede",
      amount: 1500,
      dueDate: subDays(now, 2).toISOString(),
      paid: false,
      note: "Coffee delivery balance",
      createdAt: d(10),
    },
    {
      id: createLocalId(),
      customerName: "Woizero Selam",
      amount: 800,
      dueDate: subDays(now, -1).toISOString(),
      paid: false,
      note: "Teff partial",
      createdAt: d(12),
    },
    {
      id: createLocalId(),
      customerName: "Ato Tesfaye",
      amount: 2200,
      dueDate: subDays(now, 14).toISOString(),
      paid: false,
      createdAt: d(5),
    },
    {
      id: createLocalId(),
      customerName: "Ato Mekonnen",
      amount: 450,
      dueDate: subDays(now, 20).toISOString(),
      paid: true,
      createdAt: d(20),
    },
  ];
}

export const PRODUCT_QUICK_PICKS = [
  "Injera",
  "Teff",
  "Cooking Oil",
  "Berbere",
  "Coffee",
  "Shiro",
  "Spices mix",
  "Kolo",
];

export const FAKE_DRIVERS = [
  { name: "Dawit M.", phone: "+251 91 111 2233", vehicle: "Bajaj", plate: "AA-3-45678" },
  { name: "Hanna T.", phone: "+251 92 444 8899", vehicle: "Motorcycle", plate: "AA-1-99001" },
  { name: "Solomon G.", phone: "+251 90 777 5566", vehicle: "Small van", plate: "AA-4-21098" },
];
