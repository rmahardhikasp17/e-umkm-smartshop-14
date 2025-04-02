
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, User, Clipboard, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatPrice } from "@/utils/data";

// Define types based on Supabase tables
type Product = {
  name: string;
};

type Transaction = {
  transaction_id: string; // Updated column name
  product_id: string | null; // Updated column name
  quantity: number;
  total_price: number;
  status: string;
  created_at: string | null;
  product?: Product;
};

type User = {
  user_id: string; // Updated column name
  email: string;
  role: string;
  created_at: string | null;
  transactions?: Transaction[];
  total_spent?: number;
  order_count?: number;
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const pageSize = 10;

  // Fetch users and their transactions from Supabase
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Fetch users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (userError) {
        toast.error("Error fetching customers");
        throw new Error(userError.message);
      }

      // For each user, fetch their transactions
      const usersWithTransactions = await Promise.all(
        userData.map(async (user) => {
          const { data: transactionData, error: transactionError } = await supabase
            .from("transactions")
            .select(`
              *,
              product:products (name)
            `)
            .eq("user_id", user.user_id); // Updated column name

          if (transactionError) {
            console.error("Error fetching transactions:", transactionError);
            return {
              ...user,
              transactions: [],
              total_spent: 0,
              order_count: 0,
            };
          }

          // Calculate total spent and order count
          const totalSpent = transactionData.reduce(
            (sum, transaction) => sum + transaction.total_price,
            0
          );

          return {
            ...user,
            transactions: transactionData,
            total_spent: totalSpent,
            order_count: transactionData.length,
          };
        })
      );

      return usersWithTransactions as User[];
    },
  });

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
      },
      () => {
        toast.error("Failed to copy");
      }
    );
  };

  // Filter users based on search term
  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Paginate users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pelanggan</h1>
          <p className="text-muted-foreground">Kelola pelanggan dan lihat informasi pembelian mereka</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-subtle overflow-hidden mb-6"
      >
        <div className="p-4 border-b">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari pelanggan..."
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
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Total Pesanan</TableHead>
                    <TableHead>Total Pembelian</TableHead>
                    <TableHead>Tanggal Bergabung</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs flex items-center gap-1.5">
                          {user.user_id.substring(0, 8)}...
                          <button
                            onClick={() => copyToClipboard(user.user_id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Clipboard className="h-3.5 w-3.5" />
                          </button>
                        </TableCell>
                        <TableCell>{user.order_count || 0}</TableCell>
                        <TableCell>{formatPrice(user.total_spent || 0)}</TableCell>
                        <TableCell>
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString("id-ID")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm
                          ? "Tidak ada pelanggan yang sesuai dengan pencarian."
                          : "Belum ada pelanggan."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length > pageSize && (
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

      {/* User Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detail Pelanggan</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedUser.email}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    ID: {selectedUser.user_id}
                    <button
                      onClick={() => copyToClipboard(selectedUser.user_id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                    </button>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Pembelian</p>
                  <p className="font-bold text-lg">{formatPrice(selectedUser.total_spent || 0)}</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Jumlah Pesanan</p>
                  <p className="font-bold text-lg">{selectedUser.order_count || 0}</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Bergabung Sejak</p>
                  <p className="font-bold text-lg">
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              <h3 className="font-medium text-lg mb-4">Riwayat Pesanan</h3>
              {selectedUser.transactions && selectedUser.transactions.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pesanan</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUser.transactions.map((transaction) => (
                        <TableRow key={transaction.transaction_id}>
                          <TableCell className="font-mono text-xs">
                            {transaction.transaction_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{transaction.product?.name || "Unknown Product"}</TableCell>
                          <TableCell>{formatPrice(transaction.total_price)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                transaction.status === "Selesai" || transaction.status === "Dikirim"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "Dibatalkan"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-secondary/30">
                  <p className="text-muted-foreground">Pelanggan ini belum melakukan pembelian</p>
                </div>
              )}
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

export default Customers;
