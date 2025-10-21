"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectProps {
  onWalletConnect?: (address: string) => void;
  onWalletDisconnect?: () => void;
}

export function WalletConnect({ onWalletConnect, onWalletDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          onWalletConnect?.(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address);
        setIsConnected(true);
        onWalletConnect?.(address);

        // Switch to Intuition Testnet (if needed)
        await switchToIntuitionTestnet();

        toast({
          title: "Wallet connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToIntuitionTestnet = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x350B" }],
      });
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x350B", // 13579 in hex
                chainName: "Intuition Network",
                nativeCurrency: {
                  name: "tTRUST",
                  symbol: "tTRUST",
                  decimals: 18,
                },
                rpcUrls: ["https://testnet.rpc.intuition.systems/http"],
                blockExplorerUrls: ["https://testnet.explorer.intuition.systems/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    onWalletDisconnect?.();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{formatAddress(walletAddress)}</span>
                  <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0 hover:bg-gray-800">
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                  </Button>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Intuition Network</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={() => window.open("https://testnet.explorer.intuition.systems/", "_blank")} className="border-gray-700 hover:border-blue-500 bg-transparent">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={disconnectWallet} className="border-gray-700 hover:border-red-500 hover:text-red-400 bg-transparent">
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
