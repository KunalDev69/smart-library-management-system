// Centered loading spinner component
const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-surface-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-violet-600"></div>
    </div>
  );
};

export default Loader;
