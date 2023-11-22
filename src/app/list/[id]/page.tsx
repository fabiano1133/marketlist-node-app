"use client";

import { api } from "@/services/api";
import { Button, Spinner } from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IconButton, Checkbox } from "@material-tailwind/react";
import { FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaClipboardList } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";

interface ListProps {
  id: string;
  name: string;
  description: string;
  isDone: boolean;
  created_at: Date;
}

interface ProductProps {
  id: string;
  name: string;
  description: string;
  quantity: number;
  isChecked: boolean;
}

interface NewProductProps {
  name: string;
  description: string;
  quantity: number;
}

export default function ListDetails() {
  const params = useParams();
  const [list, setList] = useState<ListProps>({} as ListProps);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { handleSubmit, register } = useForm<NewProductProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = (productId: string) => {
    let newArray = products.map((item) => ({ ...item }));
    const index = newArray.findIndex((item) => item.id === productId);
    newArray[index].isChecked = !newArray[index].isChecked;
    setProducts(newArray);
    setIsChecked(!isChecked);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { id } = params;

  const getProductsInList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/products/findall-products-in-list/${id}`
      );
      setList(response.data.listName);
      setProducts(response.data.products);
    } catch (error: any) {
      toast.error(`Ocorreu um erro. Tente novamente: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const newProduct = async (data: NewProductProps) => {
    try {
      setIsLoading(true);
      const productId = await api.post(`products/create-product/${id}`, {
        name: data.name,
        description: data.description,
        quantity: +data.quantity,
      });
      await api.post(
        `/products/add-product-in-list/listId/${id}/productId/${productId.data}`
      );

      toast.success(`Produto Adicionado com Sucesso!`, {
        autoClose: 2000,
      });
      getProductsInList();
    } catch (error: any) {
      toast.error(
        `Ocorreu um erro na comunicação com a API. Tente novamente! :${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeProductInList = async (productId: string) => {
    try {
      setIsLoading(true);
      await api.delete(
        `/products/remove-product-in-list/${id}/product/${productId}`
      );
      toast.success(`Produto removido`, {
        autoClose: 2000,
      });
      getProductsInList();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListIsDone = async () => {
    try {
      setIsLoading(true);
      await api.put(`marketlist/update-status-list/${id}`);
      toast.success("Lista concluída");
      setIsLoading(false);
      router.push("/lists");
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductsInList();
    router.refresh();
  }, [getProductsInList, id, router]);

  return (
    <>
      <main className="">
        <div className="px-2 py-2 sticky top-0 z-50 bg-orange-600 space-y-4">
          <div className="flex items-center justify-center">
            <FaClipboardList size={32} />
            <h1 className="text-2xl font-semibold">{list?.name}</h1>
          </div>
          <div className="flex justify-center item-center">
            <h1 className="text-sm text-white">{list?.description}</h1>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <h1 className="text-sm text-white">
              STATUS: {list.isDone === false ? "PENDENTE" : "CONCLUÍDA"}
            </h1>
            <FaCartArrowDown size={18} color={"red"} />
          </div>
          <div className="flex justify-center items-center gap-2 mt-2">
            <Button onClick={() => router.back()} fullWidth>
              Voltar
            </Button>
            <Button onClick={() => openModal()} fullWidth color="green">
              Novo Produto
            </Button>
          </div>
        </div>

        {isModalOpen &&
          (isLoading ? (
            <div className="h-screen flex justify-center items-center">
              <Spinner color="green" />
            </div>
          ) : (
            <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl mb-4">Novo Produto</h2>

                <form
                  onSubmit={handleSubmit(newProduct)}
                  className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Nome do Produto
                    </label>
                    <input
                      {...register("name")}
                      id="name"
                      placeholder="Nome de Produto"
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

                    <input
                      {...register("quantity")}
                      id="quantity"
                      type="number"
                      placeholder="Quantidade"
                      className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="mr-2 w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Criar
                    </button>

                    <button
                      className="w-full px-4 py-2 font-medium text-white bg-red-700 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={closeModal}
                    >
                      Fechar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ))}

        {isLoading ? (
          <div className="h-screen flex justify-center items-center">
            <Spinner color="green" />
          </div>
        ) : (
          <div className="p-2 pb-20 overflow-auto bg-orange-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center">
                  <h1 className="text-lg font-bold mb-2">Ops! Lista vazia.</h1>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg shadow-md flex justify-around grid-cols-2 ${
                      product.isChecked
                        ? "bg-gray-300 line-through"
                        : "bg-white"
                    }`}
                  >
                    <div className="w-full">
                      <h1 className="text-lg font-bold mb-2">
                        Produto: {product.name}
                      </h1>
                      <h1 className="text-gray-500 text-sm mb-2">
                        Descrição: {product.description}
                      </h1>
                      <h1 className="text-gray-500 text-sm">
                        Quantidade: {product.quantity}
                      </h1>
                    </div>

                    <div className="flex justify-center items-center  w-36 gap-3">
                      <IconButton
                        size="lg"
                        color="red"
                        className="rounded-full"
                        disabled={product.isChecked}
                        onClick={() => removeProductInList(product.id)}
                      >
                        <FaTrash size={22} />
                      </IconButton>
                      <Checkbox
                        crossOrigin={0}
                        defaultChecked={isChecked}
                        onClick={() => handleCheckboxClick(product.id)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {products.length === 0 ? (
          ""
        ) : (
          <footer className="fixed bottom-0 w-full bg-gray-200 z-10">
            <div className="flex justify-center h-full items-center mt-3 mb-3">
              <Button onClick={() => handleListIsDone()} color="green">
                Concluir Lista
              </Button>
            </div>
          </footer>
        )}
      </main>
      <ToastContainer />
    </>
  );
}
