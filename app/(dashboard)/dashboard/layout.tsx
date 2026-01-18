import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "See key information about your inventory and account.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}