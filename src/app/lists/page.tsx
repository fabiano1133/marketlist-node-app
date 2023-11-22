"use client";

import ListCard from "@/components/ListCard";
import { api } from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface List {
  id: string;
  name: string;
  description: string;
  isDone: boolean;
  created_at: Date;
}

export default function Lists() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<List[]>([]);

  const getLists = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("marketlist/findall");

      setList(response.data);
    } catch (error: any) {
      toast.error(`Ocorreu um erro ao carregar as listas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLists();
  }, []);

  return (
    <main className="bg-orange-500 h-screen flex flex-col items-center justify-center p-5">
      {isLoading ? (
        <div className="h-screen flex justify-center items-center">
          <Spinner color="green" />
        </div>
      ) : (
        <div className="p-6  max-w-md w-full space-y-4 overflow-y-auto">
          {list.length === 0 ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-8 text-gray-700">
                Você não possui nenhuma lista
              </h1>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => router.push("/new-list")}
              >
                Criar Lista
              </Button>
            </div>
          ) : (
            list.map((listItem) => (
              <div key={listItem?.id}>
                <Link href={`list/${listItem.id}`}>
                  <ListCard
                    disabled={listItem.isDone}
                    name={listItem.name}
                    description={listItem.description}
                    isDone={listItem.isDone}
                    created_at={new Date(listItem.created_at)}
                  />
                </Link>
              </div>
            ))
          )}
        </div>
      )}
      <div className="mt-3">
        <Button
          fullWidth
          className="bg-blue-600 rounded-full"
          onClick={() => router.push("/")}
        >
          Voltar
        </Button>
      </div>
    </main>
  );
}
