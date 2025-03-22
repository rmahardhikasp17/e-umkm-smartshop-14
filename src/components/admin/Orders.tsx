import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, Eye, Filter } from "lucide-react";
import { formatPrice } from "@/utils/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define transaction type based on Supabase table
type Product = {
  name: string;
  image_url: string | null;
};

type User = {
  email: string;
};

type Transaction = {
  id: string;
  product_id: string | null;
  quantity: number;
  total_price: number;
  status: string;
  user_id: string | null;
  created_at: string | null;
  product?: Product;
  user?: User;
};

const statusColors = {
  "Menunggu Pembayaran": "bg-yellow-500",
  "Dibayar": "bg-blue-500",
  "Dikemas": "bg-indigo-500",
  "Dikirim": "bg-green-500",
  "Selesai": "bg-green-700",
  "Dibatalkan": "bg-red-500",
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
  const pageSize = 10;

  // Fetch transactions from Supabase
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          product:products(name, image_url),
          user:users(email)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching orders");
        throw new Error(error.message);
      }

      return data as Transaction[];
    },
  });

  const handleViewOrder = (order: Transaction) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  // Filter transactions based on search term and status
  const filteredTransactions = transactions?.filter(
    (transaction) =>
      (transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.product?.name &&
          transaction.product.name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (!filterStatus || transaction.status === filterStatus)
  ) || [];

  // Paginate transactions
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pesanan</h1>
          <p className="text-muted-foreground">Kelola pesanan dari pelanggan Anda</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-subtle overflow-hidden mb-6"
      >
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pesanan..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["Menunggu Pembayaran", "Dibayar", "Dikemas", "Dikirim", "Selesai", "Dibatalkan"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.product?.name || "Unknown Product"}</TableCell>
                        <TableCell>{transaction.user?.email || "Unknown User"}</TableCell>
                        <TableCell>{formatPrice(transaction.total_price)}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${
                              statusColors[transaction.status as keyof typeof statusColors] || "bg-gray-500"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {transaction.created_at
                            ? new Date(transaction.created_at).toLocaleDateString("id-ID")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewOrder(transaction)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchTerm || filterStatus
                          ? "Tidak ada pesanan yang sesuai dengan filter."
                          : "Belum ada pesanan."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length > pageSize && (
              <div className="p-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Order Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detail Pesanan #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium text-white ${
                      statusColors[selectedOrder.status as keyof typeof statusColors] || "bg-gray-500"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Pesanan</p>
                  <p className="font-medium">
                    {selectedOrder.created_at
                      ? new Date(selectedOrder.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-medium mb-3">Produk</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                      {selectedOrder.product?.image_url ? (
                        <img
                          src={selectedOrder.product.image_url}
                          alt={selectedOrder.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          No Img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedOrder.product?.name || "Unknown Product"}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {selectedOrder.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pelanggan</p>
                  <p className="font-medium">{selectedOrder.user?.email || "Unknown User"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pesanan</p>
                  <p className="font-medium">{formatPrice(selectedOrder.total_price)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowDetail(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Orders;
