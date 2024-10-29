import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  FileDown,
  Search,
  Trash,
  Trash2,
  Edit,
  Eye,
  ShoppingBag,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "fulfilled":
    case "shipped":
      return "text-green-600 bg-green-100";
    case "ready for ship":
      return "text-blue-600 bg-blue-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const SearchBar = React.memo(({ searchTerm, handleSearch }) => (
  <div className="relative flex-grow w-full sm:max-w-full mb-2 sm:mb-0">
    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
    <Input
      type="text"
      placeholder="Search"
      className="pl-8 w-full"
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>
));

export const StatusFilter = React.memo(
  ({ statusFilter, handleStatusFilter, statusOptions }) => (
    <Select value={statusFilter} onValueChange={handleStatusFilter}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Order Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={status} value={status.toLowerCase()}>
            {status === "all" ? "All Status" : status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
);

export const ActionButtons = React.memo(
  ({ handleExport, handleCleanBacket, handleBuyNow }) => (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <Button
        variant="outline"
        className="flex items-center gap-3 w-full sm:w-auto"
        onClick={handleExport}
      >
        <FileDown className="h-4 w-4" />
        Exporter
      </Button>
      <Button
        variant="outline"
        className="bg-transparent hover:bg-gray-600/10 text-gray-950 flex items-center gap-3 w-full sm:w-auto"
        onClick={handleBuyNow}
      >
        <ShoppingBag className="h-4 w-4" />
        Commender
      </Button>
      <Button
        className="bg-transparent hover:text-red-700 hover:bg-transparent text-red-500  flex items-center w-full gap-3 sm:w-auto"
        onClick={handleCleanBacket}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Reinitialiser
      </Button>
    </div>
  )
);

export const OrderTableHeader = React.memo(
  ({ handleSelectAll, paginatedOrders, selectedOrders }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="grid grid-cols-8 gap-4">
            <TableHead className="">
              <Checkbox
                checked={
                  selectedOrders.length === paginatedOrders.length &&
                  paginatedOrders.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>COMMANDE</TableHead>
            <TableHead>PRODUIT</TableHead>
            <TableHead>STATUT</TableHead>
            <TableHead>QUANTITE</TableHead>
            <TableHead>EMPLACEMENT</TableHead>
            {/* <TableHead>DATE</TableHead> */}
            <TableHead>TOTAL</TableHead>
            <TableHead className="">ACTION</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  )
);

export const OrderTableBody = React.memo(
  ({
    paginatedOrders,
    selectedOrders,
    handleSelectOrder,
    handleDeleteOrder,
    handleEditOrder,
    handleViewOrder,
  }) => (
    <ScrollArea className="h-[calc(100vh-350px)] sm:h-[calc(100vh-275px)]">
      <Table>
        <TableBody className="w-full ">
          {paginatedOrders.map((order) => (
            <TableRow key={order.id + order.customer} className="grid grid-cols-8 gap-0 p-0 w-full">
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={(checked) =>
                    handleSelectOrder(order.id, checked)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell className="flex">{order.title}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell >{order.quantity}</TableCell>
              <TableCell className="">{order.location}</TableCell>
              {/* <TableCell className="">{order.date}</TableCell> */}
              <TableCell className="">{order.total}</TableCell>
              <TableCell className="">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40">
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <Link to={`/product/${order.id.replace("#", "")}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={() => handleEditOrder(order.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
);

export const Pagination = React.memo(
  ({
    rowsPerPage,
    handleRowsPerPageChange,
    handlePreviousPage,
    handleNextPage,
    currentPage,
    totalPages,
  }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
      <Select
        value={rowsPerPage.toString()}
        onValueChange={handleRowsPerPageChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={`Show ${rowsPerPage} rows`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">Show 10 rows</SelectItem>
          <SelectItem value="20">Show 20 rows</SelectItem>
          <SelectItem value="50">Show 50 rows</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
);
