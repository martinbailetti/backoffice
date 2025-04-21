import { useContext } from "react";
import { DataContext } from "@/context/DataContext";

export const fetchData = async (lang: string) => {
  const response = await fetch(`/locales/${lang}.json`);
  const jsonData = await response.json();
  return jsonData;
};

export const useTranslation = () => {
//  const data = useContext(DataContext);
  const { t } = useContext(DataContext);
  return t;
};

