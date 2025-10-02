
import Button from '@/Components/buttons';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-2 bg-black">
      <div className="flex flex-col items-center justify-center p-10 bg-slate-950 rounded-lg w-100">
      <h1 className="text-4xl font-bold pb-5">Login</h1>
      <form className="flex flex-col gap-4 justify-center items-center p-5 ">
        <input type="email" className="w-80 bg-transparent m-2  placeholder:text-slate-400 text-amber-50 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Enter email..."/>
        <input type="password" className="w-80  bg-transparent m-2 placeholder:text-slate-400 text-amber-50 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"  placeholder="Enter password..."/>
        <Link href="./register">
          New user? Register
        </Link>
        <Button>Login</Button>
      </form>
      </div>
    </div>
  );
