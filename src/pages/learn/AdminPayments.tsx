import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Delete,
  Edit,
  Replay,
  Payments,
  TrendingUp,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Close,
  Warning,
} from "@mui/icons-material";
import {
  useGetAllPaymentsMade,
  useUpdatePayment,
  useDeletePayment,
  useRefundPayment,
} from "src/hooks/learn/useEnrollmentApi";
import UserCard from "src/components/learn/UserCard";
import type { Payment } from "src/types/Enrollment.types";

interface EditDialogProps {
  open: boolean;
  payment: Payment | null;
  onClose: () => void;
  onSave: (updated: Partial<Payment>) => void;
  isLoading?: boolean;
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: "error" | "warning" | "primary";
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig = {
  completed: {
    label: "Completed",
    color: "#16a34a",
    bg: "#dcfce7",
    icon: <CheckCircle sx={{ fontSize: 14 }} />,
  },
  pending: {
    label: "Pending",
    color: "#d97706",
    bg: "#fef3c7",
    icon: <HourglassEmpty sx={{ fontSize: 14 }} />,
  },
  failed: {
    label: "Failed",
    color: "#dc2626",
    bg: "#fee2e2",
    icon: <Cancel sx={{ fontSize: 14 }} />,
  },
  refunded: {
    label: "Refunded",
    color: "#7c3aed",
    bg: "#ede9fe",
    icon: <Replay sx={{ fontSize: 14 }} />,
  },
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount,
  );

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
};

const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}> = ({ label, value, sub, icon, accent }) => (
  <Box className="rounded-xl p-4 flex items-start gap-3 bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
    <Box
      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
      sx={{ background: accent, color: "#fff" }}
    >
      {icon}
    </Box>
    <Box>
      <Typography className="text-xsl! text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </Typography>
      <Typography className="text-xl! font-bold! text-gray-900">
        {value}
      </Typography>
      {sub && <Typography className="text-xs! text-blue-600">{sub}</Typography>}
    </Box>
  </Box>
);

const StatusChip: React.FC<{ status?: Payment["status"] }> = ({
  status = "pending",
}) => {
  const cfg = statusConfig[status];
  return (
    <Chip
      icon={cfg.icon}
      label={cfg.label}
      size="small"
      sx={{
        background: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        fontSize: "0.7rem",
        border: `1px solid ${cfg.color}30`,
        "& .MuiChip-icon": { color: cfg.color, ml: "6px" },
      }}
    />
  );
};

const getConfirmDialogColor = (
  confirmColor: "error" | "warning" | "primary",
): string => {
  if (confirmColor === "error") return "#dc2626";
  if (confirmColor === "warning") return "#d97706";
  return "#2563eb";
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  confirmColor = "error",
  icon,
  onClose,
  onConfirm,
  isLoading = false,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle className="flex items-center gap-2 pb-1!">
      {icon && (
        <Box
          sx={{
            color: getConfirmDialogColor(confirmColor),
          }}
        >
          {icon}
        </Box>
      )}
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography className="text-gray-600 text-sm!">{message}</Typography>
    </DialogContent>
    <DialogActions className="px-4! pb-4! gap-2">
      <Button
        onClick={onClose}
        variant="outlined"
        size="small"
        sx={{ borderColor: "#e2e8f0", color: "#64748b" }}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        size="small"
        color={confirmColor}
        sx={{ boxShadow: "none" }}
        disabled={isLoading}
      >
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  payment,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [form, setForm] = useState<Partial<Payment>>({});

  React.useEffect(() => {
    if (payment)
      setForm({
        amount: payment.amount,
        status: payment.status,
      });
  }, [payment]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span>Edit Transaction</span>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="pt-4 flex flex-col gap-4">
        <TextField
          label="Amount"
          type="number"
          fullWidth
          size="small"
          value={form.amount ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
        />
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status ?? ""}
            label="Status"
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                status: e.target.value,
              }))
            }
          >
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <MenuItem key={key} value={key}>
                {cfg.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions className="px-4! pb-4! gap-2">
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ borderColor: "#e2e8f0", color: "#64748b" }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave(form);
          }}
          variant="contained"
          size="small"
          sx={{
            background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
            boxShadow: "none",
          }}
          disabled={isLoading}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton width={200} height={20} />
    </TableCell>
    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
      <Skeleton width={140} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton width={100} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton width={120} height={20} />
    </TableCell>
    <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
      <Skeleton width={120} height={20} />
    </TableCell>
    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
      <Skeleton width={90} height={20} />
    </TableCell>
    <TableCell>
      <Skeleton width={100} height={20} />
    </TableCell>
  </TableRow>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const AdminPayments: React.FC = () => {
  const ROWS_PER_PAGE = 8;

  const [page, setPage] = useState(0);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);
  const [refundPayment, setRefundPayment] = useState<Payment | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data, isLoading, error } = useGetAllPaymentsMade({
    page,
    limit: ROWS_PER_PAGE,
  });
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();
  const refundPaymentMutation = useRefundPayment();

  const payments = data?.data?.payments ?? [];
  const meta = data?.data?.meta;

  const handleDelete = (p: Payment) => {
    deletePaymentMutation.mutate(p.id, {
      onSuccess: () => {
        setDeletePayment(null);
      },
    });
  };

  const handleRefund = (p: Payment) => {
    refundPaymentMutation.mutate(p.id, {
      onSuccess: () => {
        setRefundPayment(null);
      },
    });
  };

  const handleEdit = (updated: Partial<Payment>) => {
    if (!editPayment) return;
    updatePaymentMutation.mutate(
      {
        paymentId: editPayment.id,
        partialPayment: updated,
      },
      {
        onSuccess: () => {
          setEditPayment(null);
        },
      },
    );
  };

  // Stats
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((s, p) => s + +p.amount, 0);
  const refundCount = payments.filter((p) => p.status === "refunded").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <Box className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6">
      {/* ── Header ── */}
      <Box className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <Box>
          <Box className="flex items-center gap-2 mb-1">
            <Box className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Payments sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Typography variant="h5" className="font-bold! text-gray-900">
              Payment Management
            </Typography>
          </Box>
          <Typography className="text-sm! text-gray-500 ml-10">
            Review, edit, refund, or remove learner transactions
          </Typography>
        </Box>
      </Box>

      {/* ── Stat Cards ── */}
      <Box className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Revenue"
          value={isLoading ? "—" : formatCurrency(totalRevenue, "XAF")}
          sub={`${payments.filter((p) => p.status === "completed").length} completed`}
          icon={<TrendingUp sx={{ fontSize: 20 }} />}
          accent="linear-gradient(135deg,#1d4ed8,#2563eb)"
        />
        <StatCard
          label="Total Transactions"
          value={isLoading ? "—" : String(payments.length)}
          icon={<Payments sx={{ fontSize: 20 }} />}
          accent="linear-gradient(135deg,#0891b2,#06b6d4)"
        />
        <StatCard
          label="Pending"
          value={isLoading ? "—" : String(pendingCount)}
          icon={<HourglassEmpty sx={{ fontSize: 20 }} />}
          accent="linear-gradient(135deg,#d97706,#f59e0b)"
        />
        <StatCard
          label="Refunds Issued"
          value={isLoading ? "—" : String(refundCount)}
          icon={<Replay sx={{ fontSize: 20 }} />}
          accent="linear-gradient(135deg,#7c3aed,#8b5cf6)"
        />
      </Box>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" className="mb-4 rounded-xl">
          Failed to load payment data. Please try again.
        </Alert>
      )}

      {/* ── Table ── */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #dbeafe",
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50!">
                Learner
              </TableCell>
              <TableCell
                className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50!"
                sx={{ display: { xs: "none", md: "table-cell" } }}
              >
                Course
              </TableCell>
              <TableCell className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50!">
                Amount
              </TableCell>
              <TableCell className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50!">
                Status
              </TableCell>
              <TableCell
                className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50!"
                sx={{ display: { xs: "none", lg: "table-cell" } }}
              >
                Method
              </TableCell>
              <TableCell
                className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50!"
                sx={{ display: { xs: "none", md: "table-cell" } }}
              >
                Date
              </TableCell>
              <TableCell className="font-semibold! text-xs! uppercase! tracking-wider! text-blue-700! bg-blue-50! text-center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonRow key={`skeleton-${i + 1}`} />
                ))
              : null}
            {!isLoading && payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12! text-center!">
                  <Box className="flex flex-col items-center gap-2 text-gray-400">
                    <Payments sx={{ fontSize: 40, opacity: 0.3 }} />
                    <Typography className="text-sm!">
                      No transactions found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                hover
                sx={{
                  "&:hover": { background: "#eff6ff" },
                  "&:last-child td": { borderBottom: 0 },
                  transition: "background 0.15s",
                }}
              >
                <TableCell>
                  {payment.enrollment.userId && (
                    <UserCard
                      userId={payment?.enrollment?.userId ?? ""}
                      variant="compact"
                    />
                  )}
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography className="text-xs! text-gray-700 max-w-40 truncate">
                    {payment.enrollment.course.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className="text-sm! font-bold! text-gray-900">
                    {formatCurrency(Number(payment.amount), payment.currency)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={payment.status} />
                </TableCell>
                <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                  <Typography className="text-xs! text-gray-500 capitalize">
                    {payment.provider ?? "—"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Typography className="text-xs! text-gray-500">
                    {formatDate(payment.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box className="flex items-center justify-center gap-1">
                    <Tooltip title="Edit Transaction" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setEditPayment(payment)}
                        sx={{
                          color: "#2563eb",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          width: 28,
                          height: 28,
                          "&:hover": { background: "#dbeafe" },
                        }}
                      >
                        <Edit sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                    {payment.status === "completed" && (
                      <Tooltip title="Issue Refund" arrow>
                        <IconButton
                          size="small"
                          onClick={() => setRefundPayment(payment)}
                          sx={{
                            color: "#7c3aed",
                            background: "#f5f3ff",
                            border: "1px solid #ddd6fe",
                            width: 28,
                            height: 28,
                            "&:hover": { background: "#ede9fe" },
                          }}
                        >
                          <Replay sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete Transaction" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setDeletePayment(payment)}
                        sx={{
                          color: "#dc2626",
                          background: "#fff5f5",
                          border: "1px solid #fecaca",
                          width: 28,
                          height: 28,
                          "&:hover": { background: "#fee2e2" },
                        }}
                      >
                        <Delete sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={7}
                count={meta?.totalItems ?? 0}
                page={page}
                rowsPerPage={ROWS_PER_PAGE}
                rowsPerPageOptions={[ROWS_PER_PAGE]}
                onPageChange={(_, newPage) => setPage(newPage)}
                sx={{
                  borderTop: "1px solid #dbeafe",
                  "& .MuiTablePagination-toolbar": { color: "#374151" },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    { fontSize: "0.75rem" },
                  "& .MuiIconButton-root": {
                    color: "#1d4ed8",
                    "&.Mui-disabled": { color: "#9ca3af" },
                  },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* ── Dialogs ── */}
      <EditDialog
        open={!!editPayment}
        payment={editPayment}
        onClose={() => setEditPayment(null)}
        onSave={handleEdit}
        isLoading={updatePaymentMutation.isPending}
      />
      <ConfirmDialog
        open={!!refundPayment}
        title="Issue Refund"
        message={`Are you sure you want to refund  to this learner? This action cannot be undone.`}
        confirmLabel="Issue Refund"
        confirmColor="warning"
        icon={<Replay />}
        onClose={() => setRefundPayment(null)}
        onConfirm={() => refundPayment && handleRefund(refundPayment)}
        isLoading={refundPaymentMutation.isPending}
      />
      <ConfirmDialog
        open={!!deletePayment}
        title="Delete Transaction"
        message={`This will permanently remove transaction ${deletePayment?.id.slice(0, 12)}… from the system. This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        icon={<Warning />}
        onClose={() => setDeletePayment(null)}
        onConfirm={() => deletePayment && handleDelete(deletePayment)}
        isLoading={deletePaymentMutation.isPending}
      />
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
