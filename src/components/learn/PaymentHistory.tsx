import { CheckCircle } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Table,
} from "@mui/material";
import { Receipt, AlertCircle, Clock, XCircle, RotateCcw } from "lucide-react";
import type { Payment } from "src/types/Enrollment.types";

const statusConfig: Record<
  Payment["status"],
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "#92400e",
    bg: "#fef3c7",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    color: "#065f46",
    bg: "#d1fae5",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  failed: {
    label: "Failed",
    color: "#991b1b",
    bg: "#fee2e2",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  refunded: {
    label: "Refunded",
    color: "#1e3a8a",
    bg: "#dbeafe",
    icon: <RotateCcw className="w-3.5 h-3.5" />,
  },
};

const PaymentStatusBadge = ({ status }: { status: Payment["status"] }) => {
  const cfg = statusConfig[status];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        px: "10px",
        py: "3px",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: cfg.color,
        backgroundColor: cfg.bg,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.icon}
      {cfg.label}
    </Box>
  );
};

// ─── Format date helper ───────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const PaymentHistorySection = ({
  payments,
  isLoading,
  error,
}: {
  payments: Payment[] | undefined;
  isLoading: boolean;
  error: unknown;
}) => {
  return (
    <Card elevation={1} sx={{ mt: 4 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              backgroundColor: "#eff6ff",
            }}
          >
            <Receipt className="w-5 h-5" style={{ color: "#2563eb" }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Payment History
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              All transactions for this enrollment
            </Typography>
          </Box>
        </Box>

        {/* Loading */}

        {isLoading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              gap: 2,
              color: "text.secondary",
            }}
          >
            <CircularProgress size={22} />
            <Typography variant="body2">Loading payment history…</Typography>
          </Box>
        )}

        {/* Error */}
        {!isLoading && error && (
          <Alert
            severity="error"
            icon={<AlertCircle className="w-5 h-5" />}
            sx={{ borderRadius: 2 }}
          >
            Unable to load payment history. Please refresh the page.
          </Alert>
        )}

        {/* Empty state */}
        {!isLoading && !error && (!payments || payments.length === 0) && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 2,
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              border: "1px dashed #e5e7eb",
            }}
          >
            <Receipt
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "#9ca3af" }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No payments recorded yet
            </Typography>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
              Your transactions will appear here after you make a payment.
            </Typography>
          </Box>
        )}

        {/* Table */}
        {!isLoading && !error && payments && payments.length > 0 && (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  {[
                    "Transaction ID",
                    "Provider",
                    "Amount",
                    "Status",
                    "Date",
                    "Paid At",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid #e5e7eb",
                        py: 1.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment, idx) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                      "&:hover": { backgroundColor: "#f0f9ff" },
                      transition: "background-color 0.15s",
                    }}
                  >
                    {/* Transaction ID */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "monospace",
                          color: "#374151",
                          backgroundColor: "#f3f4f6",
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                          fontSize: "0.7rem",
                        }}
                      >
                        {payment.providerTransactionId
                          ? `…${payment.providerTransactionId.slice(-10)}`
                          : "—"}
                      </Typography>
                    </TableCell>

                    {/* Provider */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#374151" }}
                      >
                        {payment.provider || "—"}
                      </Typography>
                    </TableCell>

                    {/* Amount */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "#111827" }}
                      >
                        {Number(payment.amount).toLocaleString()}{" "}
                        <span style={{ color: "#6b7280", fontWeight: 400 }}>
                          {payment.currency}
                        </span>
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell sx={{ py: 1.5 }}>
                      <PaymentStatusBadge status={payment.status} />
                      {payment.status === "failed" && payment.failureReason && (
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: "#ef4444", mt: 0.4 }}
                        >
                          {payment.failureReason}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Created At */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", whiteSpace: "nowrap" }}
                      >
                        {formatDate(payment.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* Paid At */}
                    <TableCell sx={{ py: 1.5 }}>
                      {payment.paidAt ? (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#059669",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(payment.paidAt)}
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Summary row */}
        {!isLoading && !error && payments && payments.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {(["completed", "pending", "failed", "refunded"] as const).map(
              (status) => {
                const count = payments.filter(
                  (p) => p.status === status,
                ).length;
                if (count === 0) return null;
                const cfg = statusConfig[status];
                return (
                  <Box
                    key={status}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      fontSize: "0.78rem",
                      color: cfg.color,
                    }}
                  >
                    {cfg.icon}
                    <span>
                      {count} {cfg.label}
                    </span>
                  </Box>
                );
              },
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
