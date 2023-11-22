"use client";

import { api } from "@/services/api";
import { Button, Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NewList {
  name: string;
  description: string;
}

export default function NewList() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<NewList>();
  const router = useRouter();

  const onSubmit = async (data: NewList) => {
    try {
      setIsLoading(true);
      await api.post("marketlist/create-market-list", data);
      toast.success("Lista criada com sucesso!");
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        `Falha ao comunicar com a API! ${JSON.stringify(error.message)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-orange-500">
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <Spinner color="green" />
        </div>
      ) : (
        <div className="max-w-full overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-[400px] p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Título da Lista
              </label>
              <input
                {...register("name")}
                id="name"
                placeholder="Título da Lista"
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Descrição
              </label>
              <input
                {...register("description")}
                id="description"
                placeholder="Descrição"
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Criar
              </button>
              <Button color="red" fullWidth onClick={() => router.back()}>
                Voltar
              </Button>
            </div>
          </form>
        </div>
      )}

      <ToastContainer />
    </main>
  );
}
