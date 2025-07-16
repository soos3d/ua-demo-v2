"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import { UniversalAccount } from "@particle-network/universal-account-sdk";
import { type Token } from "../lib/tokens";
import TokenSelectionView from "./token-selection-view";
import TokenSwapInputView from "./token-swap-input-view";

interface SwapDialogProps {
  showSwapDialog: boolean;
  setShowSwapDialog: (show: boolean) => void;
  primaryBalanceUsd: number; // Example: User's total USD balance for buying
  universalAccount: UniversalAccount | null;
}

export default function SwapDialog({
  showSwapDialog,
  setShowSwapDialog,
  primaryBalanceUsd,
  universalAccount,
}: SwapDialogProps) {
  console.log(primaryBalanceUsd);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showSwapDialog) {
      const fetchTokens = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/tokens");
          if (!response.ok) {
            throw new Error("Failed to fetch tokens");
          }
          const data = await response.json();
          console.log("data", data);
          setTokens(data);
        } catch (error) {
          console.error(error);
          // Optionally, set some error state to show in the UI
        } finally {
          setIsLoading(false);
        }
      };

      fetchTokens();
    }
  }, [showSwapDialog]);

  const handleClose = () => {
    setShowSwapDialog(false);
    setSelectedToken(null); // Reset selected token when dialog closes
  };

  return (
    <Dialog open={showSwapDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {selectedToken
                ? `Swap ${selectedToken.symbol}`
                : "Select Token to Swap"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {selectedToken ? (
          <TokenSwapInputView
            token={selectedToken}
            onBack={() => setSelectedToken(null)}
            primaryBalanceUsd={primaryBalanceUsd}
            universalAccount={universalAccount}
          />
        ) : (
          <TokenSelectionView
            tokens={tokens}
            onSelectToken={setSelectedToken}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
