export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl">404</h1>
        <p className="mb-4 text-gray-600 text-xl">Oops! Page not found</p>
        <a className="text-blue-500 underline hover:text-blue-700" href="/">
          Return to Home
        </a>
      </div>
    </div>
  );
}
