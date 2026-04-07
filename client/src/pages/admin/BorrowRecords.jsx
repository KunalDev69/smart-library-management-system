import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRecords,
  getOverdueRecords,
  returnBook,
  approveRequest,
  rejectRequest,
  clearBorrowState,
} from "../../redux/slices/borrowSlice";
import Sidebar from "../../components/layout/Sidebar";
import BorrowTable from "../../components/borrow/BorrowTable";
import toast from "react-hot-toast";

const BorrowRecords = () => {
  const dispatch = useDispatch();
  const { records, overdueRecords, loading, error, message } = useSelector(
    (state) => state.borrow
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getAllRecords());
    dispatch(getOverdueRecords());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearBorrowState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearBorrowState());
    }
  }, [error, message, dispatch]);

  const handleReturn = async (borrowId) => {
    const result = await dispatch(returnBook(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`Book returned! Fine: ₹${result.payload.fine}`);
      dispatch(getAllRecords());
      dispatch(getOverdueRecords());
    }
  };

  const handleApprove = async (borrowId) => {
    const result = await dispatch(approveRequest(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Borrow request approved!");
      dispatch(getAllRecords());
    }
  };

  const handleReject = async (borrowId) => {
    const result = await dispatch(rejectRequest(borrowId));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Borrow request rejected");
      dispatch(getAllRecords());
    }
  };

  const getFilteredRecords = () => {
    const today = new Date();
    switch (filter) {
      case "pending":
        return records.filter((r) => r.status === "pending");
      case "borrowed":
        return records.filter((r) => r.status === "borrowed");
      case "returned":
        return records.filter((r) => r.status === "returned");
      case "rejected":
        return records.filter((r) => r.status === "rejected");
      case "overdue":
        return records.filter(
          (r) => r.status === "borrowed" && new Date(r.returnDate) < today
        );
      default:
        return records;
    }
  };

  const filteredRecords = getFilteredRecords();

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Borrow Records</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: `All (${records.length})` },
            { key: "pending", label: `Pending (${records.filter((r) => r.status === "pending").length})`, warn: true },
            { key: "borrowed", label: `Borrowed (${records.filter((r) => r.status === "borrowed").length})` },
            { key: "returned", label: `Returned (${records.filter((r) => r.status === "returned").length})` },
            { key: "rejected", label: `Rejected (${records.filter((r) => r.status === "rejected").length})` },
            { key: "overdue", label: `Overdue (${overdueRecords.length})`, danger: true },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.key
                  ? tab.danger
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : tab.warn
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : tab.danger
                  ? "bg-red-500/5 text-red-400/60 hover:bg-red-500/10 border border-gray-200 dark:border-white/5"
                  : tab.warn
                  ? "bg-yellow-500/5 text-yellow-400/60 hover:bg-yellow-500/10 border border-gray-200 dark:border-white/5"
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Borrow Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <BorrowTable
            records={filteredRecords}
            onReturn={handleReturn}
            onApprove={handleApprove}
            onReject={handleReject}
            showUser={true}
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
};

export default BorrowRecords;
