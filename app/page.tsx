"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectButton, useAccount } from "@particle-network/connectkit";
import Demo from "@/components/Demo";
import { Globe, Link, Wallet, Lock, Loader2 } from "lucide-react";

// Header
function Header({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex items-center justify-end p-6">
      {!isConnected && <ConnectButton label="Login" />}
    </div>
  );
}

// Feature Card
type Feature = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};
function FeatureCard({ icon, title, subtitle }: Feature) {
  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center border border-purple-200">
            {icon}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-sm">{title}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hero section
function Hero() {
  const features: Feature[] = [
    {
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      title: "Universal",
      subtitle: "One balance spendable across all chains",
    },
    {
      icon: <Link className="w-5 h-5 text-green-600" />,
      title: "EVM and Solana",
      subtitle: "Spend across EVM and Solana chains",
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-600" />,
      title: "Keep your auth provider",
      subtitle: "No need to switch wallet providers",
    },
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 space-y-8 pb-10">
      {/* Logo */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
        <Wallet className="w-10 h-10 text-white" />
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Universal Accounts Demo
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Experience cross-chain functionality without bridging
        </p>
      </div>

      {/* Features */}
      <div className="w-full max-w-sm space-y-3 mt-6">
        {features.map((feat) => (
          <FeatureCard key={feat.title} {...feat} />
        ))}
      </div>

      {/* CTA */}
      <p className="text-sm text-gray-500 mt-8">Login to get started</p>
    </main>
  );
}

// Loading component
function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      <p className="text-lg text-gray-600">Connecting...</p>
    </div>
  );
}

// Page
export default function Page() {
  const { status } = useAccount();

  const isConnected = status === 'connected';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header isConnected={isConnected} />
      <div className="flex-1 flex flex-col">
        {(status === 'connecting' || status === 'reconnecting') && <Loading />}
        {status === 'connected' && <Demo />}
        {status === 'disconnected' && <Hero />}
      </div>
    </div>
  );
}
