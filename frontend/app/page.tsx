import Button from "@/Components/buttons";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg w-full flex flex-col scroll-auto">
      <div className="bg w-full h-screen flex flex-row font-roboto font-bold">
        <div className="bg-black w-1/2 flex justify-center items-center flex-col">
          <h1 className="text-6xl text-center p-10 ">
            Test your APIs
            <br />
            with AI
          </h1>

          <h1 className="text-2xl pb-10">The best API testing platform</h1>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>

        <div className="bg-blue-900 w-1/2 flex justify-center items-center">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={1200}
            height={100}
            className="object-cover relative w-full h-screen"
          />
        </div>
      </div>
      <div className="bg-black w-full h-screen"></div>
    </div>
  );
}
