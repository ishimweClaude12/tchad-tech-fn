import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
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
import type { CourseEnrollment } from "src/types/Enrollment.types";
import { usePayCourse } from "src/hooks/learn/useEnrollmentApi";

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  phoneNumber?: string;
}

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: payCourse, isPending: isPaymentProcessing } = usePayCourse();

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

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [countryCode, setCountryCode] = useState("+235");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate pricing
  const coursePrice = enrollment?.course.price || 0;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replaceAll(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19);
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replaceAll(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    return value.replaceAll(/\D/g, "").substring(0, 15);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.replaceAll(/\s/g, "").length < 13) {
        newErrors.cardNumber = "Enter a valid card number";
      }
      if (!cardName || cardName.trim().length < 3) {
        newErrors.cardName = "Enter the cardholder name";
      }
      if (!expiryDate || expiryDate.length < 5) {
        newErrors.expiryDate = "Enter expiry date (MM/YY)";
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = "Enter CVV";
      }
    } else if (!phoneNumber || phoneNumber.length < 8) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Only process mobile money payment through API
    if (paymentMethod === "mobile") {
      if (!enrollment) return;

      payCourse(
        {
          enrollmentId: enrollment.id,
          amount: coursePrice,
          phoneNumber: phoneNumber,
        },
        {
          onSuccess: (response) => {
            // If API returns payment URL, redirect to it
            if (response.data?.paymentUrl) {
              globalThis.location.href = response.data.paymentUrl;
            } else {
              // Otherwise, navigate to courses page
              navigate("/learn/courses");
            }
          },
        },
      );
    } else {
      // Card payment - to be integrated later
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        alert(
          "Card payment integration coming soon. Please use Mobile Money for now.",
        );
      }, 1000);
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
                          <Chip
                            label="Coming Soon"
                            size="small"
                            color="default"
                            className="absolute top-2 right-2"
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
                        Card Details
                      </Typography>

                      <TextField
                        fullWidth
                        label="Card Number"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                      />

                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        error={!!errors.cardName}
                        helperText={errors.cardName}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          value={expiryDate}
                          onChange={(e) =>
                            setExpiryDate(formatExpiryDate(e.target.value))
                          }
                          placeholder="MM/YY"
                          error={!!errors.expiryDate}
                          helperText={errors.expiryDate}
                        />

                        <TextField
                          fullWidth
                          label="CVV"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value
                                .replaceAll(/\D/g, "")
                                .substring(0, 4),
                            )
                          }
                          placeholder="123"
                          error={!!errors.cvv}
                          helperText={errors.cvv}
                          type="password"
                        />
                      </div>
                    </Box>
                  ) : (
                    <Box className="space-y-4">
                      <Typography variant="h6" className="mb-4 font-semibold">
                        Mobile Money Details
                      </Typography>

                      <Alert severity="info" icon={<Smartphone />}>
                        A payment request will be sent to your phone. Please
                        confirm the transaction on your device.
                      </Alert>

                      <Box className="flex gap-2">
                        <FormControl className="w-32">
                          <InputLabel>Code</InputLabel>
                          <Select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            label="Code"
                          >
                            <MenuItem value="+235">+235</MenuItem>
                            <MenuItem value="+237">+237</MenuItem>
                            <MenuItem value="+250">+250</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={phoneNumber}
                          onChange={(e) =>
                            setPhoneNumber(formatPhoneNumber(e.target.value))
                          }
                          placeholder="912345678"
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber}
                        />
                      </Box>

                      <Paper className="bg-gray-50 p-4">
                        <Typography
                          variant="body2"
                          className="font-medium mb-2"
                        >
                          Supported Providers:
                        </Typography>
                        <Box className="flex flex-wrap gap-2">
                          <Chip label="MTN Mobile Money" size="small" />
                          <Chip label="Airtell Money" size="small" />
                        </Box>
                      </Paper>
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
                      isProcessing ||
                      (paymentMethod === "mobile" && isPaymentProcessing)
                    }
                    className="mt-6 py-4"
                    startIcon={
                      isProcessing || isPaymentProcessing ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )
                    }
                  >
                    {(() => {
                      if (isProcessing || isPaymentProcessing) {
                        return paymentMethod === "mobile"
                          ? "Processing payment..."
                          : "Processing...";
                      }
                      return `Pay ${coursePrice.toLocaleString()} CFA`;
                    })()}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
