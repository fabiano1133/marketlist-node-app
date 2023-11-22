"use client";

import Image from "next/image";
import logo from "../../public/logo-main.png";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="bg-orange-500 h-screen flex flex-col justify-center items-center">
      <div className="mb-4">
        <Image
          src={logo}
          alt="Logo"
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>

      <div className="flex justify-center items-center flex-col gap-4 w-full max-w-md p-4  ">
        <Button
          className="bg-white text-black py-2 w-56 h-16"
          onClick={() => router.push("/new-list")}
        >
          Nova Lista
        </Button>
        <Button
          className="bg-white text-black py-2 w-56 h-16"
          onClick={() => router.push("/lists")}
        >
          Listas Criadas
        </Button>
      </div>
    </main>
  );
}
