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
      className="cursor-pointer rounded-xl shadow-md hover:shadow-lg transition bg-white border border-gray-200 p-5"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-base text-gray-800 truncate max-w-[75%]">
          {title}
        </h2>
        <span className="text-xs text-gray-500 italic">Clique para editar</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
