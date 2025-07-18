"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Copy, Network } from "lucide-react";
import { useState } from "react";
import { supportedChains } from "@/lib/chains";

const truncateAddress = (address: string, chars = 6) => {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

interface DepositDialogProps {
  showDepositDialog: boolean;
  setShowDepositDialog: (show: boolean) => void;
  evmAddress: string;
  solanaAddress: string;
}

export default function DepositDialog({
  showDepositDialog,
  setShowDepositDialog,
  evmAddress,
  solanaAddress,
}: DepositDialogProps) {
  return (
    <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
      <DialogContent className="p-4 max-w-sm bg-white rounded-xl border border-gray-200">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4 text-white" />
            </div>
            <DialogTitle className="text-base font-semibold text-purple-700">
              Deposit Assets
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Networks */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Network className="w-4 h-4 text-purple-600" />
            Supported Networks
          </div>
          <p className="text-xs text-gray-500 leading-tight">
            Use the EVM UA for EVM assets or Solana UA for Solana assets.
          </p>
          <div className="grid grid-cols-5 gap-x-2 gap-y-3 pt-2">
            {supportedChains.map((chain) => (
              <div
                key={chain.name}
                className="flex flex-col items-center justify-center"
              >
                <img
                  src={chain.icon}
                  alt={chain.name}
                  className="w-6 h-6 rounded-full border"
                />
                <span className="text-[9px] text-center text-gray-700 leading-tight mt-1">
                  {chain.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address Blocks */}
        <div className="space-y-2 mb-4">
          {[
            { label: "EVM UA", value: evmAddress },
            { label: "Solana UA", value: solanaAddress },
          ].map(({ label, value }) => {
            const [copied, setCopied] = useState(false);

            const handleCopy = async () => {
              try {
                await navigator.clipboard.writeText(value);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch (err) {
                console.error("Clipboard copy failed", err);
              }
            };

            return (
              <div
                key={label}
                className="bg-purple-100 rounded-lg px-3 py-2 flex justify-between items-center"
              >
                <div className="text-sm font-medium text-purple-800 max-w-[75%] truncate">
                  <span className="font-semibold">{label}:</span>{" "}
                  {truncateAddress(value)}
                </div>
                <div className="relative">
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="icon"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {copied && (
                    <div className="absolute -top-7 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded shadow">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
