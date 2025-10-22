// Payment service for handling tTRUST transactions on Intuition Network
export class PaymentService {
  private static readonly MESSAGE_COST = "0.01";

  static async getBalance(address: string): Promise<string> {
    try {
      if (!window.ethereum) throw new Error("No wallet connected");

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      // Convert from wei to tTRUST
      const balanceInTrust = (Number.parseInt(balance, 16) / 1e18).toFixed(4);
      return balanceInTrust;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  static async sendPayment(fromAddress: string, toAddress: string): Promise<string> {
    try {
      if (!window.ethereum) throw new Error("No wallet connected");

      // Convert tTRUST to wei
      const amountInWei = `0x${(Number.parseFloat(this.MESSAGE_COST) * 1e18).toString(16)}`;

      // Send transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: fromAddress,
            to: toAddress,
            value: amountInWei,
            gas: "0x5208",
          },
        ],
      });

      return txHash;
    } catch (error) {
      console.error("Error sending payment:", error);
      throw error;
    }
  }

  // static async waitForTransaction(txHash: string): Promise<boolean> {
  //   try {
  //     if (!window.ethereum) throw new Error("No wallet connected");

  //     let receipt = null;
  //     let attempts = 0;
  //     const maxAttempts = 30; // 30 seconds timeout

  //     while (!receipt && attempts < maxAttempts) {
  //       receipt = await window.ethereum.request({
  //         method: "eth_getTransactionReceipt",
  //         params: [txHash],
  //       });

  //       if (!receipt) {
  //         await new Promise((resolve) => setTimeout(resolve, 1000));
  //         attempts++;
  //       }
  //     }

  //     return receipt?.status === "0x1";
  //   } catch (error) {
  //     console.error("Error waiting for transaction:", error);
  //     return false;
  //   }
  // }

  static getMessageCost(): string {
    return this.MESSAGE_COST;
  }

  static async hasEnoughBalance(address: string): Promise<boolean> {
    try {
      const balance = await this.getBalance(address);
      return Number.parseFloat(balance) >= Number.parseFloat(this.MESSAGE_COST);
    } catch (error) {
      return false;
    }
  }
}
