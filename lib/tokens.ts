export interface Token {
    id: string
    name: string
    symbol: string
    icon: string
    currentPriceUsd: number // Simulated price per token
    description: string
  }
  
  export const dummyTokens: Token[] = [
    {
      id: "usdt",
      name: "Tether",
      symbol: "USDT",
      icon: "https://imgs.search.brave.com/8f34VWezwOD_VJ03ER5HlzAS6DZHPYwx7s_48DL3uOI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMua3Jha2VuLmNv/bS9tYXJrZXRpbmcv/d2ViL2ljb25zLXVu/aS13ZWJwL3NfdXNk/dC53ZWJwP2k9a2Rz",
      currentPriceUsd: 1.0,
      description: "Tether (USDT) is a stablecoin pegged to the US dollar.",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      icon: "https://imgs.search.brave.com/Hs-InvveRF-d_DtjChjGUfHxPPV9QvyZ4d8OqWWATtA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZs/YXRpY29uLmNvbS81/MTIvMTQ0NDYvMTQ0/NDYyODUucG5n",
      currentPriceUsd: 1.0,
      description: "USD Coin (USDC) is a stablecoin backed by fully reserved assets.",
    },
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      icon: "https://imgs.search.brave.com/PNOo568ygD9SRI_1SyGxZn3jKt8VmcfHA2WRxI_ZIrE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY29u/cy5pY29uYXJjaGl2/ZS5jb20vaWNvbnMv/Y2pkb3duZXIvY3J5/cHRvY3VycmVuY3kt/ZmxhdC81MTIvRXRo/ZXJldW0tRVRILWlj/b24ucG5n",
      currentPriceUsd: 3500.0,
      description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
    },
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      icon: "https://imgs.search.brave.com/KaYJiw36W6f27WtnKzk_95j74lW0TP5nmvYN7h8kkjo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQyLzIvc29sYW5h/LXNvbC1sb2dvLXBu/Z19zZWVrbG9nby00/MjMwOTUucG5n",
      currentPriceUsd: 150.0,
      description: "Solana is a high-performance blockchain supporting dApps and crypto projects.",
    },
    {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "https://imgs.search.brave.com/_Uh3OOTskflR3kSwaZYKFluj25abSbsSc-Ih1VoxaDk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni81OTY4LzU5Njgy/NjAucG5nP3NlbXQ9/YWlzX2h5YnJpZA",
      currentPriceUsd: 65000.0,
      description: "Bitcoin is a decentralized digital currency, without a central bank or single administrator.",
    },
  ]
  