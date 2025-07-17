import { NextResponse } from "next/server";
import { dummyTokens, Token } from "@/lib/tokens";

// Helper to map token ID to blockchain name for the DIA API
const getBlockchainFromTokenId = (id: string) => {
  switch (id) {
    case "sol":
      return "Solana";
    case "eth":
    case "usdc":
    case "usdt":
      return "Ethereum";
    case "btc":
      return "Bitcoin";
    case "bnb":
      return "BinanceSmartChain";
    default:
      return null;
  }
};

export async function GET() {
  try {
    const updatedTokens = await Promise.all(
      dummyTokens.map(async (token) => {
        if (token.id === "parti") {
          try {
            const apiUrl = `https://deep-index.moralis.io/api/v2.2/erc20/0x59264f02D301281f3393e1385c0aEFd446Eb0F00/price?chain=bsc&include=percent_change`;
            const response = await fetch(apiUrl, {
              headers: {
                accept: "application/json",
                "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
              },
              next: { revalidate: 300 }, // Revalidate every 5 minutes
            });

            if (!response.ok) {
              console.warn(
                `Failed to fetch price for ${token.name}: ${response.statusText}`
              );
              return token;
            }

            const data = await response.json();
            return {
              ...token,
              currentPriceUsd: data.usdPrice,
              description: `Swap for ${token.name} on multiple chains`,
            };
          } catch (error) {
            console.error(`Error fetching price for ${token.name}:`, error);
            return token;
          }
        }

        const blockchain = getBlockchainFromTokenId(token.id);
        if (!blockchain) {
          return token; // Return original token if no blockchain mapping
        }

        try {
          let apiUrl: string;

          switch (token.id) {
            case "usdc":
              apiUrl =
                "https://api.diadata.org/v1/assetQuotation/Base/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
              break;
            case "usdt":
              apiUrl =
                "https://api.diadata.org/v1/assetQuotation/Ethereum/0xdAC17F958D2ee523a2206206994597C13D831ec7";
              break;
            default:
              apiUrl = `https://api.diadata.org/v1/assetQuotation/${blockchain}/0x0000000000000000000000000000000000000000`;
          }

          const response = await fetch(apiUrl, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
          });

          if (!response.ok) {
            console.warn(
              `Failed to fetch price for ${token.name}: ${response.statusText}`
            );
            return token; // Return original token on API error
          }

          const data = await response.json();
          return {
            ...token,
            currentPriceUsd: data.Price,
            description: `Swap for ${token.name} on multiple chains`,
          };
        } catch (error) {
          console.error(`Error fetching price for ${token.name}:`, error);
          return token; // Return original token on fetch error
        }
      })
    );

    return NextResponse.json(updatedTokens);
  } catch (error) {
    console.error("Failed to update token prices:", error);
    return NextResponse.json(dummyTokens, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
