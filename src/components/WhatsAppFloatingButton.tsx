import React, { useState } from "react";
import whatsappConfig from "../config/whatsapp";
import { Button } from "@mui/material";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: "bottom-right" | "bottom-left";
  className?: string;
  messageType?:
    | "general"
    | "ecommerce"
    | "elearning"
    | "hubManagement"
    | "techHub"
    | "support";
}

const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = whatsappConfig.phoneNumber,
  message,
  position = whatsappConfig.appearance.position,
  className = "",
  messageType = "general",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Use specific message type or fallback to provided message or default
  const chatMessage =
    message ||
    whatsappConfig.messages[messageType] ||
    whatsappConfig.defaultMessage;

  const handleWhatsAppClick = () => {
    try {
      setIsClicked(true);

      // Clean phone number (remove any non-digit characters except +)
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
      const encodedMessage = encodeURIComponent(chatMessage);
      const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;

      console.log("Clean phone number:", cleanPhoneNumber);
      console.log("Opening WhatsApp with URL:", whatsappUrl);

      // Try to open WhatsApp
      const newWindow = window.open(whatsappUrl, "_blank");

      // Fallback: if popup was blocked, try direct navigation
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        console.log("Popup blocked, trying direct navigation");
        window.location.href = whatsappUrl;
      }

      // Reset click state after a short delay
      setTimeout(() => setIsClicked(false), 1000);
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      // Fallback: direct navigation
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
      const encodedMessage = encodeURIComponent(chatMessage);
      window.location.href = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;

      setTimeout(() => setIsClicked(false), 1000);
    }
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-90 ${className}`}
      style={{
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {/* Chat bubble tooltip */}
      {isHovered && whatsappConfig.appearance.showTooltip && (
        <div className="absolute bottom-full mb-3 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px] animate-fadeIn">
          <div className="text-sm text-gray-800 font-medium mb-1">
            {whatsappConfig.appearance.tooltipText}
          </div>
          <div className="text-xs text-gray-600">
            {whatsappConfig.appearance.tooltipSubtext}
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}

      {/* WhatsApp button */}
      <Button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => {
          console.log("Mouse entered WhatsApp button");
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          console.log("Mouse left WhatsApp button");
          setIsHovered(false);
        }}
        variant="contained"
        color="success"
        className={`bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-200 relative ${
          isClicked ? "scale-95 bg-green-700" : ""
        }`}
        aria-label="Chat with us on WhatsApp"
        disabled={isClicked}
        style={{
          pointerEvents: "auto",
          position: "relative",
          zIndex: 10,
          width: "60px",
          height: "60px",
          border: "2px solid #22c55e",
        }}
      >
        {/* WhatsApp Icon SVG */}
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
        </svg>
      </Button>

      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
    </div>
  );
};

export default WhatsAppFloatingButton;
