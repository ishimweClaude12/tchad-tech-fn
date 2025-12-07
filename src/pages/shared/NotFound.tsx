import Link from "@mui/material/Link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 w-screen">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>

      <Link
        component="button"
        variant="body2"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
