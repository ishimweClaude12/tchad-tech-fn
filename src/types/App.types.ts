export interface NavigationItem {
  name: string;
  href: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface NavigationProps {
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
}
