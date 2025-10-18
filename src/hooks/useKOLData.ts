import { useState, useEffect } from "react";
import { KOL } from "../types/api";
import { KOLService } from "../api/kolService";

export const useKOLData = (walletAddress: string | undefined) => {
  const [kolData, setKolData] = useState<KOL | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKOLData = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await KOLService.getKOLByWallet(walletAddress);
        setKolData(data);
      } catch (err) {
        console.error("Error fetching KOL data:", err);
        setError("Failed to fetch KOL data");
      } finally {
        setLoading(false);
      }
    };

    fetchKOLData();
  }, [walletAddress]);

  return { kolData, loading, error };
};
