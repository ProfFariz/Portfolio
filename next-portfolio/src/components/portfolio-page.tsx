"use client";

import React, { useState, useEffect } from "react";
import { MarioPortfolio } from "./mario-portfolio";

export function PortfolioPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <MarioPortfolio />;
}
