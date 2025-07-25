"use client";

import {
  ArrowDownLeft,
  RefreshCw,
  User,
  Eye,
  EyeOff,
  Globe,
  ChevronRight,
  LogOut,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useDisconnect,
  useParticleAuth,
  useWallets,
  useAccount,
} from "@particle-network/connectkit";

// UA SDK
import {
  UniversalAccount,
  IAssetsResponse,
} from "@particle-network/universal-account-sdk";

// Local components
import AssetsDialog from "./AssetsDialog";
import DepositDialog from "./DepositDialog"; // <-- Make sure this import path is correct
import SwapDialog from "./SwapDialog";

export default function Demo() {
  // States
  const [showBalance, setShowBalance] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showAssetsDialog, setShowAssetsDialog] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [accountInfo, setAccountInfo] = useState<{
    ownerAddress: string;
    evmUaAddress: string;
    solanaUaAddress: string;
  } | null>(null);

  // ConnectKit states
  const { disconnect } = useDisconnect();
  const { getUserInfo } = useParticleAuth();
  const [primaryWallet] = useWallets();
  const { isConnected, address } = useAccount();

  // UA states
  const [universalAccount, setUniversalAccount] =
    useState<UniversalAccount | null>(null);
  const [primaryAssets, setPrimaryAssets] = useState<IAssetsResponse | null>(
    null
  );
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [partiTokenValue, setPartiTokenValue] = useState<number>(0);

  // Instantiate UA
  useEffect(() => {
    if (!isConnected || !address) return;
    const ua = new UniversalAccount({
      projectId: process.env.NEXT_PUBLIC_UA_PROJECT_ID!,
      ownerAddress: address!,
      tradeConfig: {
        slippageBps: 100,
        universalGas: true,
      },
    });
    setUniversalAccount(ua);
  }, [isConnected, address]);

  // Fetch user and asset data
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isConnected || !address || !universalAccount) return;

      if (primaryWallet?.connector?.walletConnectorType === "particleAuth") {
        const userInfo = await getUserInfo();
        setUserInfo(userInfo);
      }

      const primaryAssets = await universalAccount.getPrimaryAssets();
      setPrimaryAssets(primaryAssets);

      const smartAccountOptions =
        await universalAccount.getSmartAccountOptions();
      const accountInfo = {
        ownerAddress: smartAccountOptions.ownerAddress,
        evmUaAddress: smartAccountOptions.smartAccountAddress!,
        solanaUaAddress: smartAccountOptions.solanaSmartAccountAddress!,
      };
      setAccountInfo(accountInfo);
    };

    fetchUserInfo();
  }, [
    isConnected,
    address,
    universalAccount,
    primaryWallet?.connector?.walletConnectorType,
  ]);

  // Fetch token balance when accountInfo is available
  useEffect(() => {
    const fetchTokenBalance = async (uaAddress: string) => {
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://binance.llamarpc.com"
        );
        const tokenAddress = "0x59264f02D301281f3393e1385c0aEFd446Eb0F00";
        const abi = ["function balanceOf(address) view returns (uint256)"];
        const contract = new ethers.Contract(tokenAddress, abi, provider);
        const balance = await contract.balanceOf(uaAddress);
        console.log("Token balance:", balance);
        setTokenBalance(ethers.formatUnits(balance, 18)); // Assuming 18 decimals
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };

    if (accountInfo?.evmUaAddress) {
      fetchTokenBalance(accountInfo.evmUaAddress);
    }
  }, [accountInfo]);

  // Fetch PARTI token price and calculate value
  useEffect(() => {
    if (tokenBalance) {
      const fetchPartiPriceAndCalculateValue = async () => {
        try {
          const response = await fetch("/api/tokens");
          const tokens = await response.json();
          const partiToken = tokens.find((token: any) => token.id === "parti");
          if (partiToken && partiToken.currentPriceUsd) {
            const balance = parseFloat(tokenBalance);
            const value = balance * partiToken.currentPriceUsd;
            setPartiTokenValue(value);
          }
        } catch (error) {
          console.error(
            "Error fetching token price or calculating value:",
            error
          );
        }
      };

      fetchPartiPriceAndCalculateValue();
    }
  }, [tokenBalance]);

  const assetCount =
    (primaryAssets?.assets?.filter((asset) => asset.amountInUSD > 0).length ?? 0) +
    (tokenBalance && parseFloat(tokenBalance) > 0 ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-md">
          <Wallet className="w-6 h-6 text-white" />
        </div>

        {/* Title and Description */}
        <div className="max-w-xs">
          <h1 className="text-xl font-semibold text-gray-900">
            Universal Accounts Demo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Experience cross-chain functionality without bridging.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between p-6">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm hover:bg-gray-100 transition">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent>
            {userInfo ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full border-2 border-purple-500 shadow-md"
                />
                <h2 className="text-xl font-semibold text-gray-800">
                  {userInfo.name}
                </h2>
                <Button
                  onClick={() => disconnect()}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="text-gray-600">Logged in with a wallet</p>
                <Button
                  onClick={() => disconnect()}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance */}
      <div className="px-6 mt-4">
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-purple-100 font-medium">
                  Total Balance
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-white/20"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4 text-purple-100" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-purple-100" />
                  )}
                </Button>
              </div>

              <div className="text-4xl font-bold tracking-tight text-white">
                {showBalance
                  ? (
                      (primaryAssets?.totalAmountInUSD ?? 0) + partiTokenValue
                    ).toFixed(3)
                  : "••••••"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cards */}
      <div className="flex-1 px-6 mt-8 space-y-6">
        <Card
          className="bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
          onClick={() => setShowAssetsDialog(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                  <div className="text-xl font-bold text-blue-600">
                    {assetCount}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    View portfolio
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  Universal Account
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Use your full balance across all chains without bridging.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 pb-8 space-y-3 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent">
        <Button
          onClick={() => setShowDepositDialog(true)}
          disabled={!accountInfo}
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all duration-200"
          size="lg"
        >
          <ArrowDownLeft className="w-5 h-5" />
          Deposit Funds
        </Button>

        <Button
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all duration-200"
          size="lg"
          onClick={() => setShowSwapDialog(true)}
          disabled={!accountInfo}
        >
          <RefreshCw className="w-5 h-5" />
          Swap
        </Button>
      </div>

      {/* Dialogs */}
      <AssetsDialog
        showAssetsDialog={showAssetsDialog}
        setShowAssetsDialog={setShowAssetsDialog}
        primaryAssets={primaryAssets!}
        tokenBalance={tokenBalance}
        partiTokenValue={partiTokenValue}
      />
      {accountInfo && (
        <DepositDialog
          showDepositDialog={showDepositDialog}
          setShowDepositDialog={setShowDepositDialog}
          evmAddress={accountInfo.evmUaAddress}
          solanaAddress={accountInfo.solanaUaAddress}
        />
      )}
      <SwapDialog
        showSwapDialog={showSwapDialog}
        setShowSwapDialog={setShowSwapDialog}
        primaryBalanceUsd={primaryAssets?.totalAmountInUSD ?? 0.0}
        universalAccount={universalAccount}
      />
    </div>
  );
}
