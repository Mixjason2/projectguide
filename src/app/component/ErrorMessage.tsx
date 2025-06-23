const ErrorMessage = ({ error }: { error: string }) => (
  <div className="max-w-md mx-auto my-5 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg font-semibold text-center shadow-md">
    Error: {error}
  </div>
);

export default ErrorMessage;
