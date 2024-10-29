import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import OrderPopup from "../../components/order-popup.jsx";
import { useSelector } from "react-redux";
import { OrderTableBody, ActionButtons, OrderTableHeader, Pagination, SearchBar, StatusFilter } from "../../components/order-table-components.jsx";

const OrderTable = () => {
  const initialOrders = useSelector(state => state.basket);
  
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [statusOptions, setStatusOptions] = useState(["all"]);
  const [isEcommerceDashboardPopupOpen, setIsEcommerceDashboardPopupOpen] = useState(false);
  
  useEffect(() => {
    const uniqueStatuses = ["all", ...new Set(initialOrders.map((order) => order.status))];
    setStatusOptions(uniqueStatuses);
  }, [initialOrders]);

  useEffect(() => {
    filterOrders(searchTerm, statusFilter);
  }, [searchTerm, statusFilter, initialOrders]);

  const filterOrders = (search, status) => {
    let filteredOrders = initialOrders.filter(
      (order) =>
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase())
    );

    if (status !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status.toLowerCase() === status.toLowerCase()
      );
    }

    setOrders(filteredOrders);
    setCurrentPage(1);
  };

  const handleExport = () => {
    console.log("Exporting orders:", selectedOrders);
  };

  const handleCleanBacket = () => {
    window.confirm("voulez-vous videz votre panier ?")
  };

  const handleBuyNow = () => {
    console.log("Buy Now clicked...");
    setIsEcommerceDashboardPopupOpen(true);
  };

  const handleSelectAll = (checked) => {
    setSelectedOrders(checked ? paginatedOrders.map((order) => order.id) : []);
  };

  const handleSelectOrder = (orderId, checked) => {
    setSelectedOrders(prev => 
      checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev =>
      Math.min(prev + 1, Math.ceil(orders.length / rowsPerPage))
    );
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto ">
      {isEcommerceDashboardPopupOpen && (
        <OrderPopup 
          onClose={() => setIsEcommerceDashboardPopupOpen(false)} 
          isOpen={isEcommerceDashboardPopupOpen}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="flex flex-row items-center gap-3 p-2 h-10 w-full sm:text-xl text-[#2563eb] text-lg font-semibold sm:mb-0">
          <Link className="cursor-pointer text-xl mt-1 bg-black/5 rounded-sm hover:bg-black/10 ease-in-out duration-75" to="/product">
            <ChevronLeft />
          </Link>
          Order
          <span className="flex items-center justify-center ml-3 mt-1 text-gray-400 text-sm h-full">({orders.length} Order)</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-2 mb-4 sm:mb-6 space-y-2 sm:space-y-0 sm:space-x-2">
        <SearchBar searchTerm={searchTerm} handleSearch={(e) => setSearchTerm(e.target.value)} />
        <StatusFilter
          statusFilter={statusFilter}
          handleStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
        />
        <ActionButtons
          handleExport={handleExport}
          handleCleanBacket={handleCleanBacket}
          handleBuyNow={handleBuyNow}
        />
      </div>

      <div className="overflow-x-auto">
        <OrderTableHeader
          handleSelectAll={handleSelectAll}
          paginatedOrders={paginatedOrders}
          selectedOrders={selectedOrders}
        />

        <OrderTableBody
          paginatedOrders={paginatedOrders}
          selectedOrders={selectedOrders}
          handleSelectOrder={handleSelectOrder}
        />
      </div>

      <Pagination
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        currentPage={currentPage}
        totalPages={Math.ceil(orders.length / rowsPerPage)}
      />
    </div>
  );
};

export default OrderTable;
