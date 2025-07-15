"use client";

import { DollarSign, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Token } from "../lib/tokens";

interface TokenSelectionViewProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
}

export default function TokenSelectionView({
  tokens,
  onSelectToken,
}: TokenSelectionViewProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input placeholder="Search tokens..." className="pl-9" />
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="group relative bg-white rounded-xl border border-purple-100 p-3 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 cursor-pointer"
            onClick={() => onSelectToken(token)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                  <img
                    src={token.icon || "/placeholder.svg"}
                    alt={token.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {token.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium uppercase">
                    {token.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-base font-bold text-gray-900">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  {token.currentPriceUsd.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500">USD</p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
