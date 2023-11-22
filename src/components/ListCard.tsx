"use client";

import { FaCheck, FaCartArrowDown } from "react-icons/fa";

type ListProps = {
  name: string;
  description: string;
  isDone: boolean;
  created_at: Date;
  disabled: boolean;
};

export default function ListCard({
  name,
  description,
  isDone,
  created_at,
  disabled,
}: ListProps) {
  return (
    <button
      disabled={disabled}
      className={` shadow-lg rounded-lg w-full mx-auto font-semibold ${
        isDone ? "bg-gray-500" : "bg-green-500 text-white"
      }`}
    >
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-xl text-left font-bold mb-2">{name}</h1>
        <p className="text-gray-700 text-left text-sm">
          Descrição: {description}
        </p>
        <p className="text-gray-700 text-left text-sm flex items-center">
          Status:
          {isDone ? (
            <div className="flex items-center gap-1">
              <span>Concluída</span>
              <FaCheck color={"green"} size={22} />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>Pendente</span>
              <FaCartArrowDown color={"red"} size={22} />
            </div>
          )}
        </p>
        <p className="text-gray-700 text-sm text-left">
          Data de criação: {created_at.toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}
