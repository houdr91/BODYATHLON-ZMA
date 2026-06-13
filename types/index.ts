export type Role = "USER" | "ADMIN";

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface ProductInfo {
  name: string;
  capsules: number;
  servingDays: number;
  price: number;
  compareAtPrice: number;
  currency: string;
}

export const ZMA_PRODUCT: ProductInfo = {
  name: "Bodyathlon ZMA",
  capsules: 120,
  servingDays: 40,
  price: 34.99,
  compareAtPrice: 39.99,
  currency: "EUR",
};
