import React from "react";

export default function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed h-screen w-screen z-20 inset-0 px-4 overflow-y-auto overflow-x-hidden bg-black/75">
      <div className="flex items-center justify-center max-w-md mx-auto py-12 min-h-screen">
        <div className="p-4 bg-white rounded w-full">{children}</div>
      </div>
    </div>
  );
}
