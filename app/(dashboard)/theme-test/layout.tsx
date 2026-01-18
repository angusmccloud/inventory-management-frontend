import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme Test",
  description: "Test and customize your theme settings.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}