"use client";

import App from "../_App";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <App>{children}</App>;
}
