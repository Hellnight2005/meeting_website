import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-4">Welcome to My App</h1>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition duration-200"
        >
          Login
        </Link>

        <Link
          href="/Admin"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition duration-200"
        >
          Admin
        </Link>

        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
