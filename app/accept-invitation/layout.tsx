import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept Invitation",
  description: "Accept your invitation to join a family.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}