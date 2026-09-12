"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// Shares the "clicked product" between the product grid / look list and the inquiry form.
type InquiryContextValue = {
  selectedProduct: string;
  setSelectedProduct: (name: string) => void;
  /** Increments on every jumpTo — the form uses it to reopen after a submission */
  jumpSeq: number;
  jumpTo: (name: string) => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [jumpSeq, setJumpSeq] = useState(0);

  const jumpTo = useCallback((name: string) => {
    setSelectedProduct(name);
    setJumpSeq((n) => n + 1);
    const el = document.getElementById("inquiry");
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
  }, []);

  return (
    <InquiryContext.Provider value={{ selectedProduct, setSelectedProduct, jumpSeq, jumpTo }}>
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside <InquiryProvider>");
  return ctx;
}
