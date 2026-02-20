import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ForumDetails = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
      >
        <ArrowBackIcon /> Back to Quiz
      </Button>
      <h1 className="text-2xl font-bold mb-4">Forum Details</h1>
      <p>
        This is where the details of a specific forum post will be displayed.
      </p>
    </div>
  );
};

export default ForumDetails;
