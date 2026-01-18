import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "View the privacy policy.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}