import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import OrderPopup from "../../components/order-popup.jsx";
import { useDispatch, useSelector } from "react-redux";
import { OrderTableBody, ActionButtons, OrderTableHeader, Pagination, SearchBar, StatusFilter } from "../../components/order-table-components.jsx";
import { handleBacketAction } from "../../redux/method.js";
import {ShoppingCart} from "lucide-react"

const OrderTable = () => {
  // Récupère les commandes initiales depuis le state Redux
  const initialOrders = useSelector(state => state.basket);
  const dispatch = useDispatch();

  // États locaux pour gérer les différentes fonctionnalités du tableau
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [statusOptions, setStatusOptions] = useState(["all"]);
  const [isEcommerceDashboardPopupOpen, setIsEcommerceDashboardPopupOpen] = useState(false);
  
  // Effet pour extraire les statuts uniques des commandes et les ajouter aux options de filtrage
  useEffect(() => {
    const uniqueStatuses = ["all", ...new Set(initialOrders.map((order) => order.status))];
    setStatusOptions(uniqueStatuses);
  }, [initialOrders]);

  // Effet pour filtrer les commandes lorsque les critères de recherche ou de statut changent
  useEffect(() => {
    filterOrders(searchTerm, statusFilter);
  }, [searchTerm, statusFilter, initialOrders]);

  // Fonction pour filtrer les commandes selon la recherche et le statut
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

  // Fonction pour exporter les commandes sélectionnées
  const handleExport = () => {
    console.log("Exporting orders:", selectedOrders);
  };

  // Fonction pour vider le panier
  const handleCleanBacket = () => {
   dispatch(handleBacketAction('reset'))
  };

  // Fonction pour supprimer une commande spécifique
  const handleDeleteOrder = (orderId) => {
    dispatch(handleBacketAction('delProduct',  orderId))
  };

  // Fonction pour ouvrir la popup d'achat
  const handleBuyNow = () => {
    console.log("Buy Now clicked...");
    setIsEcommerceDashboardPopupOpen(true);
  };

  // Fonction pour sélectionner/désélectionner toutes les commandes de la page courante
  const handleSelectAll = (checked) => {
    setSelectedOrders(checked ? paginatedOrders.map((order) => order.id) : []);
  };

  // Fonction pour sélectionner/désélectionner une commande individuelle
  const handleSelectOrder = (orderId, checked) => {
    setSelectedOrders(prev => 
      checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
    );
  };

  // Fonction pour changer le nombre de lignes par page
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Fonction pour aller à la page précédente
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Fonction pour aller à la page suivante
  const handleNextPage = () => {
    setCurrentPage(prev =>
      Math.min(prev + 1, Math.ceil(orders.length / rowsPerPage))
    );
  };

  // Calcul des commandes à afficher sur la page courante
  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  console.log("Paginated Orders:", paginatedOrders);
  return (
    <div className="container mx-auto ">
      {isEcommerceDashboardPopupOpen && (
        <OrderPopup 
          onClose={() => setIsEcommerceDashboardPopupOpen(false)} 
          isOpen={isEcommerceDashboardPopupOpen}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="flex flex-row items-center gap-3 p-2 h-10 w-full sm:text-xl  text-[#2563eb] text-lg font-semibold sm:mb-0">
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

      {paginatedOrders.length > 0 ? <>
      
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
          handleDeleteOrder={handleDeleteOrder}
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
      
      </> : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-xl font-semibold text-gray-700 mb-4">Vous n&apos;avez aucune commande</h1>
            <p className="text-gray-500 mb-6">Commencez vos achats pour voir vos commandes apparaître ici</p>
            <div 
              className="w-full flex justify-center items-center p-4"
            >
              <ShoppingCart
                className="w-48 h-48 text-slate-500"
              />
            </div>
            
            <Link 
              to="/product"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Parcourir les produits
            </Link>
          </div>
        )  }
    </div> 
  );
};

export default OrderTable;
