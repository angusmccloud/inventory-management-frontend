import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account or create a new one.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}