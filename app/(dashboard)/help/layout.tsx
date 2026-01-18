import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help",
  description: "Get assistance and find answers to your questions.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}