import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory",
  description: "View and manage inventory items.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}