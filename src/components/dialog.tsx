import React from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}
export default function Dialog({ title, children, onClose }: Props) {
  return (
    <div className="fixed h-screen w-screen z-20 inset-0 px-4 overflow-y-auto overflow-x-hidden bg-black/75">
      <div className="flex items-center justify-center max-w-md mx-auto py-12 min-h-screen">
        <div className="p-4 bg-white rounded w-full">
          <div className="w-full flex items-start justify-between mb-4">
            <h1>{title}</h1>
            <div
              className="transition px-2 py-1 rounded hover:bg-gray-50 flex gap-2 items-center cursor-pointer"
              onClick={onClose}
            >
              <span>Close</span>
              <IoClose />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
