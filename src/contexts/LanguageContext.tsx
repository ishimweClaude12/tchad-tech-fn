import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "en" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  const isRTL = language === "ar";

  // Listen for language requests from micro-frontends
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "REQUEST_LANGUAGE") {
        // Send current language to requesting micro-frontend
        if (event.source && event.origin) {
          (event.source as Window).postMessage(
            {
              type: "LANGUAGE_CHANGE",
              language: language,
            },
            { targetOrigin: event.origin }
          );
        }
      } else if (event.data.type === "LANGUAGE_CHANGE") {
        // Update language when micro-frontend requests change
        setLanguage(event.data.language);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [language]);

  const handleSetLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);

    // Expose language context to window for Module Federation micro-frontends
    (window as any).__SHELL_LANGUAGE_CONTEXT__ = {
      language: newLanguage,
      isRTL: newLanguage === "ar",
    };

    // Broadcast language change to all iframes (micro-frontends)
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: "LANGUAGE_CHANGE",
            language: newLanguage,
          },
          { targetOrigin: "*" }
        );
      }
    });
  }, []);

  // Expose current language context to window on every render
  useEffect(() => {
    (window as any).__SHELL_LANGUAGE_CONTEXT__ = {
      language,
      isRTL,
    };
  }, [language, isRTL]);

  const value: LanguageContextType = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      isRTL,
    }),
    [language, isRTL, handleSetLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
