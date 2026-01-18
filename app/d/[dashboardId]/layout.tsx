import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory List",
  description: "Manage Quantities in Inventory List.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}