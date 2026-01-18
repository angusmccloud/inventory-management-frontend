import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "View the terms of service.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}