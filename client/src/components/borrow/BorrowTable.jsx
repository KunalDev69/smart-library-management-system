// Table displaying borrow records
const BorrowTable = ({ records, onReturn, showUser = true, isAdmin = false }) => {
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
  };

  const isOverdue = (returnDate, status) => {
    return status === "borrowed" && new Date(returnDate) < new Date();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-surface-200 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
        <thead>
          <tr className="bg-gray-50 dark:bg-white/[0.02] text-gray-600 dark:text-gray-400 text-sm">
            {showUser && <th className="px-4 py-3 text-left font-semibold">User</th>}
            <th className="px-4 py-3 text-left font-semibold">Book</th>
            <th className="px-4 py-3 text-left font-semibold">Issue Date</th>
            <th className="px-4 py-3 text-left font-semibold">Due Date</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Fine</th>
            {onReturn && <th className="px-4 py-3 text-left font-semibold">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
          {records.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
              {showUser && (
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-800 dark:text-white">{record.user?.name}</div>
                  <div className="text-gray-500 text-xs">{record.user?.email}</div>
                </td>
              )}
              <td className="px-4 py-3 text-sm">
                <div className="font-medium text-gray-800 dark:text-white">{record.book?.title}</div>
                <div className="text-gray-500 text-xs">{record.book?.author}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(record.issueDate)}</td>
              <td className="px-4 py-3 text-sm">
                <span className={isOverdue(record.returnDate, record.status) ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-600 dark:text-gray-400"}>
                  {formatDate(record.returnDate)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    record.status === "returned"
                      ? "bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400"
                      : isOverdue(record.returnDate, record.status)
                      ? "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                      : "bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400"
                  }`}
                >
                  {record.status === "returned"
                    ? "Returned"
                    : isOverdue(record.returnDate, record.status)
                    ? "Overdue"
                    : "Borrowed"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                {record.fine > 0 ? (
                  <span className="text-red-600 font-medium">₹{record.fine}</span>
                ) : (
                  <span className="text-gray-400">₹0</span>
                )}
              </td>
              {onReturn && (
                <td className="px-4 py-3">
                  {record.status === "borrowed" && (
                    <button
                      onClick={() => onReturn(record._id)}
                      className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Return
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-400">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowTable;
