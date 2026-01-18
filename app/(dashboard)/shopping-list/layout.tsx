import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping List",
  description: "View and manage your shopping list.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}