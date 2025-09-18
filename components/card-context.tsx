import { CardContextType } from "@/types";
import { createContext } from "react";

export const CardContext = createContext<CardContextType>({
  onCardClose: () => {},
  currentIndex: null,
});
