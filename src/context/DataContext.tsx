import React, { createContext, useState, useEffect, ReactNode, FC } from "react";
import obj from "../../public/locales/es.json";
import { fetchData } from "@/context/contextUtils";
import { settings } from "@/config";

interface DataContextProps {
  data: object;
  language: string;
  changeLanguage: (lang: string) => void;
  t: (value: string) => string;
}

export const DataContext = createContext<DataContextProps>({
  data: obj,
  language: settings.default_language,
  changeLanguage: () => {},
  t: () => "",
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState(obj);
  const [language, setLanguage] = useState<string>(settings.default_language);

  // Language
  const loadData = async (lang: string) => {
    const jsonData = await fetchData(lang);
    setData(jsonData);
  };

  useEffect(() => {
    loadData(language);
  }, [language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  const t = (attributeName: string) => {
    if (!attributeName) return "";
    const lowercasedAttributeName = attributeName.toLowerCase();
    return data[lowercasedAttributeName as keyof typeof data] ?? attributeName;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
