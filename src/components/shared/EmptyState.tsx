export const EmptyState: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <img
        src="/icons/empty-state.svg"
        alt="empty box"
        className="w-48 h-48 mb-4"
      />
      <p className="text-gray-500 text-lg">{message || "No data available."}</p>
    </div>
  );
};
