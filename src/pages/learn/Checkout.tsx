import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import {
  CreditCard,
  Smartphone,
  Lock,
  School,
  CheckCircle,
} from "lucide-react";
import { MobileNetwork } from "src/types/Enrollment.types";
import type { CourseEnrollment, MomoCountry } from "src/types/Enrollment.types";

import {
  useGetAllPayments,
  usePayWithCard,
  usePayWithMobileMoney,
} from "src/hooks/learn/useEnrollmentApi";
import { PaymentHistorySection } from "src/components/learn/PaymentHistory";

interface FormErrors {
  cardName?: string;
  cardEmail?: string;
  phoneNumber?: string;
  network?: string;
}

// ─── Main CheckoutPage ────────────────────────────────────────────────────────

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutate: payWithMobileMoney, isPending: isPaymentProcessing } =
    usePayWithMobileMoney();
  const { mutate: payWithCard, isPending: isCardPaymentProcessing } =
    usePayWithCard();

  const enrollment = useMemo(() => {
    const enrollmentData = searchParams.get("data");
    if (enrollmentData) {
      try {
        return JSON.parse(
          decodeURIComponent(enrollmentData),
        ) as CourseEnrollment;
      } catch (error) {
        console.error("Failed to parse enrollment data:", error);
        return null;
      }
    }
    return null;
  }, [searchParams]);

  const {
    data: paymentData,
    isLoading: isLoadingPayments,
    error: errorLoadingPayments,
  } = useGetAllPayments(enrollment?.id ?? "");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">(
    "mobile",
  );
  const [cardName, setCardName] = useState(
    user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "",
  );
  const [cardEmail, setCardEmail] = useState(
    user?.primaryEmailAddress?.emailAddress ?? "",
  );
  const [country, setCountry] = useState<MomoCountry>("rwanda");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState<MobileNetwork>(MobileNetwork.MTN);
  const [errors, setErrors] = useState<FormErrors>({});

  const coursePrice = enrollment?.course.price || 0;

  const formatPhoneNumber = (value: string) => {
    return value.replaceAll(/\D/g, "").substring(0, 15);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (paymentMethod === "card") {
      if (!cardName || cardName.trim().length < 3)
        newErrors.cardName = "Enter your full name";
      if (!cardEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardEmail))
        newErrors.cardEmail = "Enter a valid email address";
    } else {
      if (!cardName || cardName.trim().length < 3)
        newErrors.cardName = "Enter your full name";
      if (!cardEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardEmail))
        newErrors.cardEmail = "Enter a valid email address";
      if (!phoneNumber || phoneNumber.length < 8)
        newErrors.phoneNumber = "Enter a valid phone number";
      if (!network) newErrors.network = "Select a mobile network";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === "mobile") {
      if (!enrollment) return;
      payWithMobileMoney(
        {
          courseId: enrollment.course.id,
          email: cardEmail.trim(),
          fullname: cardName.trim(),
          phone_number: phoneNumber,
          country,
          network,
        },
        {
          onSuccess: (response) => {
            if (response.data?.redirect_url) {
              globalThis.location.href = response.data.redirect_url;
            } else {
              navigate(`/learn/course/${enrollment.course.slug}`);
            }
          },
        },
      );
    } else {
      if (!enrollment) return;
      payWithCard(
        {
          courseId: enrollment.course.id,
          fullname: cardName.trim(),
          email: cardEmail.trim(),
        },
        {
          onSuccess: (response) => {
            if (response.data?.payment_link) {
              globalThis.location.href = response.data.payment_link;
            } else {
              navigate(`/learn/course/${enrollment.course.slug}`);
            }
          },
        },
      );
    }
  };

  if (!enrollment) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress size={48} />
        <Typography className="ml-4">Loading checkout...</Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-w-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h3" className="font-bold text-gray-900 mb-2">
            Complete Your Enrollment
          </Typography>
          <Typography className="text-gray-600">
            Secure checkout for your course enrollment
          </Typography>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form Section */}
          <div className="lg:col-span-2">
            <Card elevation={1}>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Payment Method Selection */}
                  <Box className="mb-6">
                    <Typography variant="h6" className="mb-4 font-semibold">
                      Payment Method
                    </Typography>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "card" | "mobile")
                      }
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Paper
                          elevation={paymentMethod === "card" ? 3 : 0}
                          className={`p-4 cursor-pointer transition-all border-2 relative ${
                            paymentMethod === "card"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                              <Box className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                <span className="font-medium">
                                  Card Payment
                                </span>
                              </Box>
                            }
                          />
                        </Paper>

                        <Paper
                          elevation={paymentMethod === "mobile" ? 3 : 0}
                          className={`p-4 cursor-pointer transition-all border-2 ${
                            paymentMethod === "mobile"
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod("mobile")}
                        >
                          <FormControlLabel
                            value="mobile"
                            control={<Radio />}
                            label={
                              <Box className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                <span className="font-medium">
                                  Mobile Money
                                </span>
                              </Box>
                            }
                          />
                        </Paper>
                      </div>
                    </RadioGroup>
                  </Box>

                  {/* Payment Form */}
                  {paymentMethod === "card" ? (
                    <Box className="space-y-4">
                      <Typography variant="h6" className="mb-4 font-semibold">
                        Card Payment Details
                      </Typography>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={cardEmail}
                        onChange={(e) => setCardEmail(e.target.value)}
                        placeholder="you@example.com"
                        error={!!errors.cardEmail}
                        helperText={errors.cardEmail}
                      />
                    </Box>
                  ) : (
                    <Box className="space-y-4">
                      <Typography variant="h6" className="mb-4 font-semibold">
                        Mobile Money Details
                      </Typography>
                      <Alert severity="info" icon={<Smartphone />}>
                        You will be redirected to complete your payment. Please
                        have your mobile money account ready.
                      </Alert>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={cardEmail}
                        onChange={(e) => setCardEmail(e.target.value)}
                        placeholder="you@example.com"
                        error={!!errors.cardEmail}
                        helperText={errors.cardEmail}
                      />
                      <FormControl fullWidth error={!!errors.network}>
                        <InputLabel>Mobile Network</InputLabel>
                        <Select
                          value={network}
                          onChange={(e) =>
                            setNetwork(e.target.value as MobileNetwork)
                          }
                          label="Mobile Network"
                        >
                          <MenuItem value={MobileNetwork.MTN}>
                            MTN Mobile Money
                          </MenuItem>
                          <MenuItem value={MobileNetwork.AIRTELL}>
                            Airtel Money
                          </MenuItem>
                          <MenuItem value={MobileNetwork.TIGO}>
                            Tigo Cash
                          </MenuItem>
                        </Select>
                        {errors.network && (
                          <Typography
                            variant="caption"
                            color="error"
                            className="ml-3.5 mt-0.5"
                          >
                            {errors.network}
                          </Typography>
                        )}
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={country}
                          onChange={(e) =>
                            setCountry(e.target.value as MomoCountry)
                          }
                          label="Country"
                        >
                          <MenuItem value="rwanda">Rwanda</MenuItem>
                          <MenuItem value="uganda">Uganda</MenuItem>
                          <MenuItem value="kenya">Kenya</MenuItem>
                          <MenuItem value="ghana">Ghana</MenuItem>
                          <MenuItem value="zambia">Zambia</MenuItem>
                          <MenuItem value="tanzania">Tanzania</MenuItem>
                          <MenuItem value="cameroon">Cameroon</MenuItem>
                          <MenuItem value="senegal">Senegal</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(formatPhoneNumber(e.target.value))
                        }
                        placeholder="0780322379"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                      />
                    </Box>
                  )}

                  {/* Security Notice */}
                  <Alert
                    severity="success"
                    icon={<Lock className="w-5 h-5" />}
                    className="mt-6"
                  >
                    <Typography variant="body2" className="font-medium">
                      Secure Payment
                    </Typography>
                    <Typography variant="caption">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </Typography>
                  </Alert>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={
                      (paymentMethod === "mobile" && isPaymentProcessing) ||
                      (paymentMethod === "card" && isCardPaymentProcessing)
                    }
                    className="mt-6 py-4"
                    startIcon={
                      isPaymentProcessing || isCardPaymentProcessing ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )
                    }
                  >
                    {(() => {
                      if (isPaymentProcessing || isCardPaymentProcessing) {
                        return "Processing payment...";
                      }
                      return `Pay ${coursePrice.toLocaleString()} CFA`;
                    })()}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ── Payment History ── */}
            <PaymentHistorySection
              payments={paymentData?.data.payments}
              isLoading={isLoadingPayments}
              error={errorLoadingPayments}
            />
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <Card elevation={2} className="sticky top-8">
              <CardContent className="p-6">
                <Box className="flex items-center gap-2 mb-4">
                  <School className="w-5 h-5 text-blue-600" />
                  <Typography variant="h6" className="font-semibold">
                    Enrollment Summary
                  </Typography>
                </Box>

                {/* Course Details */}
                <Box className="mb-6">
                  <img
                    src={enrollment.course.thumbnailUrl}
                    alt={enrollment.course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-900 mb-2"
                  >
                    {enrollment.course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 mb-3 line-clamp-3"
                  >
                    {enrollment.course.description}
                  </Typography>
                  <Chip
                    label={enrollment.enrollmentType}
                    color="primary"
                    size="small"
                    className="mb-2"
                  />
                </Box>

                <Divider className="my-4" />

                {/* Price Breakdown */}
                <Box className="space-y-3">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Course Price
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {coursePrice.toLocaleString()} CFA
                    </Typography>
                  </Box>
                  <Divider />
                  <Box className="flex justify-between items-center">
                    <Typography variant="h6" className="font-bold">
                      Total
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-bold text-blue-600"
                    >
                      {coursePrice.toLocaleString()} CFA
                    </Typography>
                  </Box>
                </Box>

                {/* Benefits */}
                <Paper className="bg-blue-50 p-4 mt-6">
                  <Typography
                    variant="body2"
                    className="font-medium text-blue-900 mb-2"
                  >
                    What's included:
                  </Typography>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Lifetime access to course content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Certificate upon completion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Access to course materials</span>
                    </li>
                  </ul>
                </Paper>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
