import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggest",
  description: "Submit your suggestions.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}