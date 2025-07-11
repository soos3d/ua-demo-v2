import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Coins, DollarSign, TrendingUp, Receipt } from "lucide-react";

interface Asset {
  tokenType: string;
  amount: number;
  amountInUSD: number;
}

interface AssetsDialogProps {
  showAssetsDialog: boolean;
  setShowAssetsDialog: (show: boolean) => void;
  primaryAssets?: {
    assets: Asset[];
  };
}

const getTokenIcon = (tokenType: string) => {
  const iconMap: Record<string, string> = {
    USDT: "https://imgs.search.brave.com/8f34VWezwOD_VJ03ER5HlzAS6DZHPYwx7s_48DL3uOI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMua3Jha2VuLmNv/bS9tYXJrZXRpbmcv/d2ViL2ljb25zLXVu/aS13ZWJwL3NfdXNk/dC53ZWJwP2k9a2Rz",
    USDC: "https://imgs.search.brave.com/Hs-InvveRF-d_DtjChjGUfHxPPV9QvyZ4d8OqWWATtA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS81/MTIvMTQ0NDYvMTQ0/NDYyODUucG5n",
    ETH: "https://imgs.search.brave.com/PNOo568ygD9SRI_1SyGxZn3jKt8VmcfHA2WRxI_ZIrE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/cy5pY29uYXJjaGl2/ZS5jb20vaWNvbnMv/Y2pkb3duZXIvY3J5/cHRvY3VycmVuY3kt/ZmxhdC81MTIvRXRo/ZXJldW0tRVRILWlj/b24ucG5n",
    SOL: "https://imgs.search.brave.com/KaYJiw36W6f27WtnKzk_95j74lW0TP5nmvYN7h8kkjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQyLzIvc29sYW5h/LXNvbC1sb2dvLXBu/Z19zZWVrbG9nby00/MjMwOTUucG5n",
    BTC: "https://imgs.search.brave.com/_Uh3OOTskflR3kSwaZYKFluj25abSbsSc-Ih1VoxaDk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni81OTY4LzU5Njgy/NjAucG5nP3NlbXQ9/YWlzX2h5YnJpZA",
  };

  return iconMap[tokenType.toUpperCase()] || "https://via.placeholder.com/40";
};

export default function AssetsDialog({
  showAssetsDialog,
  setShowAssetsDialog,
  primaryAssets,
}: AssetsDialogProps) {
  const filteredAssets =
    primaryAssets?.assets?.filter((asset) => asset.amountInUSD > 0) || [];
  const totalValue = filteredAssets.reduce(
    (sum, asset) => sum + asset.amountInUSD,
    0
  );

  return (
    <Dialog open={showAssetsDialog} onOpenChange={setShowAssetsDialog}>
      <DialogContent className="max-w-md sm:max-w-lg bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Your Assets
            </DialogTitle>
          </div>

          {/* Total Portfolio Value */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Total Portfolio
                </p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {filteredAssets.map((asset) => (
            <div
              key={asset.tokenType}
              className="group relative bg-white rounded-xl border border-purple-100 p-3 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Token Icon */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200 shadow-md flex items-center justify-center">
                    <img
                      src={getTokenIcon(asset.tokenType)}
                      alt={asset.tokenType}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base uppercase tracking-wide">
                        {asset.tokenType}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {asset.amount.toFixed(4)} tokens
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-base font-bold text-gray-900">
                    <DollarSign className="w-3 h-3 text-green-600" />
                    {asset.amountInUSD.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                    <Receipt className="w-3 h-3 text-green-600" />
                    {(asset.amountInUSD / asset.amount).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Hover effect gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none" />
            </div>
          ))}

          {filteredAssets.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No assets found</p>
              <p className="text-sm text-gray-400">
                Your portfolio will appear here once you have assets
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
