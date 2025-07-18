"use client";

import { DollarSign } from "lucide-react";
import type { Token } from "../lib/tokens";

interface TokenSelectionViewProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  isLoading: boolean;
}

export default function TokenSelectionView({
  tokens,
  onSelectToken,
  isLoading,
}: TokenSelectionViewProps) {
  console.log("tokens", tokens);
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">Loading tokens...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {tokens.map((token) => (
            <div
              key={token.id}
              onClick={() => onSelectToken(token)}
              className="relative group bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <img
                  src={token.icon}
                  alt={token.name}
                  className="w-10 h-10 rounded-full bg-gray-100 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 truncate">
                      {token.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 uppercase ml-2 flex-shrink-0">
                      {token.symbol}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-gray-800">
                    <DollarSign className="w-3 h-3 text-green-600" />
                    {(token.currentPriceUsd ?? 0).toFixed(6)}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
