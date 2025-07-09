"use client";

import { ReactNode } from "react";

type CardProps = {
  onClick: () => void;
  title: string;
  children: ReactNode;
};

export default function Card({ onClick, title, children }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all bg-white border border-gray-200 p-4 sm:p-5 flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-semibold text-base sm:text-lg text-gray-800 leading-snug truncate pr-2 max-w-[80%]">
          {title}
        </h2>
        <span className="text-xs sm:text-sm text-gray-400 italic whitespace-nowrap">
          Editar
        </span>
      </div>
      <div className="space-y-1 text-sm sm:text-base text-gray-600">
        {children}
      </div>
    </div>
  );
}
