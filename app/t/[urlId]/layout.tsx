import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Adjustment",
  description: "Adjust inventory quantity for item.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}