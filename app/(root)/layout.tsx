import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      <section className="flex h-full flex-1 flex-col">
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
