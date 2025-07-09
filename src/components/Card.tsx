"use client";

import { ReactNode } from "react";

type CardProps = {
  onClick: () => void;
  title: string;
  children: ReactNode;
  key: any;
};

export default function Card({ onClick, title, children, key }: CardProps) {
  return (
    <div
      key={key}
      onClick={onClick}
      className="p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition bg-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg truncate max-w-[80%]">{title}</h2>
        <hr className="text-gray-50" />
        <span className="text-xs text-gray-600 italic shrink-0">
          Clique para editar
        </span>
      </div>

      {children}
    </div>
  );
}
