"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, DollarSign, Wallet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Token } from "@/lib/tokens";
import { supportedChains } from "@/lib/chains";
import { useWallets, useAccount } from "@particle-network/connectkit";
import {
  UniversalAccount,
  SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";

interface TokenSwapInputViewProps {
  token: Token;
  onBack: () => void;
  primaryBalanceUsd: number;
  universalAccount: UniversalAccount | null;
}

export default function TokenSwapInputView({
  token,
  onBack,
  primaryBalanceUsd,
  universalAccount,
}: TokenSwapInputViewProps) {
  const [usdAmount, setUsdAmount] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);

  const availableChains =
    token.symbol === "USDC"
      ? supportedChains.filter(
          (chain) => chain.name !== "HyperEVM" && chain.name !== "Merlin"
        )
      : supportedChains;

  const [destinationChain, setDestinationChain] = useState<string>(
    availableChains[0]?.id || ""
  );
  console.log("token", token);
  console.log("usdAmount", usdAmount);
  // Get wallet from Particle Connect
  const [primaryWallet] = useWallets();
  const walletClient = primaryWallet?.getWalletClient();
  const { address } = useAccount();

  const tokenAmount = usdAmount
    ? (Number.parseFloat(usdAmount) / token.currentPriceUsd).toFixed(4)
    : "0.0000";
  console.log("tokenAmount", tokenAmount);
  const handleSwap = async () => {
    if (
      Number.parseFloat(usdAmount) <= 0 ||
      Number.parseFloat(usdAmount) > primaryBalanceUsd
    ) {
      console.log("Invalid amount");
      return;
    }

    const selectedChain = supportedChains.find(
      (c) => c.id === destinationChain
    );

    if (!selectedChain) {
      console.log("Invalid chain selected");
      return;
    }

    if (!universalAccount) {
      console.log("Universal Account not ready");
      return;
    }

    setIsSwapping(true);
    console.log(
      `Swapping $${usdAmount} → ${tokenAmount} ${token.symbol} on ${selectedChain.name}`
    );

    try {
      const transaction = await universalAccount.createConvertTransaction({
        expectToken: {
          type: token.id as SUPPORTED_TOKEN_TYPE,
          amount: tokenAmount,
        },
        chainId: selectedChain.chainId,
      });

      console.log("Transaction created:", transaction);

      // Sign the transaction's root hash using connected wallet
      const signature = await walletClient?.signMessage({
        account: address as `0x${string}`,
        message: { raw: transaction.rootHash },
      });

      // Send the signed transaction via Universal Account SDK
      const sendResult = await universalAccount.sendTransaction(
        transaction,
        signature
      );

      // Log UniversalX explorer link
      console.log(
        "Explorer URL:",
        `https://universalx.app/activity/details?id=${sendResult.transactionId}`
      );
      setUsdAmount("");
    } catch (error) {
      console.error("Swap failed:", error);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute left-4 top-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back to token list</span>
      </Button>

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white border border-gray-200 shadow-lg flex items-center justify-center">
          <img
            src={token.icon || "/placeholder.svg"}
            alt={token.name}
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{token.name}</h2>
        <p className="text-lg text-gray-500 uppercase">{token.symbol}</p>
      </div>

      <div className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Current Price</p>
          <div className="flex items-center gap-1 text-base font-bold text-gray-900">
            <DollarSign className="w-3 h-3 text-green-600" />
            {token.currentPriceUsd.toFixed(2)} USD
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Your Balance</p>
          <div className="flex items-center gap-1 text-base font-bold text-gray-900">
            <Wallet className="w-3 h-3 text-purple-600" />
            {primaryBalanceUsd.toFixed(2)} USD
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="destination-chain"
          className="block text-sm font-medium text-gray-700"
        >
          Destination Chain
        </label>
        <Select value={destinationChain} onValueChange={setDestinationChain}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a chain" />
          </SelectTrigger>
          <SelectContent>
            {availableChains.map((chain) => (
              <SelectItem key={chain.id} value={chain.id}>
                <div className="flex items-center gap-2">
                  <img
                    src={chain.icon || "/placeholder.svg"}
                    alt={chain.name}
                    className="w-5 h-5 rounded-full"
                  />
                  {chain.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="usd-amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount in USD
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="usd-amount"
            type="number"
            placeholder="0.00"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            className="pl-9 pr-20"
            min="0"
            step="0.01"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            USD
          </span>
        </div>
        <p className="text-sm text-gray-500 text-right">
          You will get ~{tokenAmount} {token.symbol}
        </p>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
        onClick={handleSwap}
        disabled={
          isSwapping ||
          !usdAmount ||
          Number.parseFloat(usdAmount) <= 0 ||
          Number.parseFloat(usdAmount) > primaryBalanceUsd ||
          !destinationChain
        }
      >
        {isSwapping ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Swapping...
          </>
        ) : (
          `Swap ${token.symbol}`
        )}
      </Button>
    </div>
  );
}
