"use client";
import { useState } from "react";
import { ethers } from "ethers";

const slippageTolerance = 10; // %

export default function Trade({ dexes, trade, token, signer }) {
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(false);

  const dex = dexes.find((dex) => dex.address === trade.address);

  const executeTrade = async () => {
    setProcessing(true);
    try {
      const amountInMax =
        (trade.amountIn * BigInt(100 + slippageTolerance)) / 100n;
      const tx1 = await token.approve(dex.address, amountInMax);
      const receipt1 = await tx1.wait();
      if (receipt1.status !== "1") {
        throw new Error("approve transaction failed");
      }

      const to = await signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
      const tx2 = await dex.contract.swapTokensForExactTokens(
        trade.amountOut,
        amountInMax,
        [trade.tokenIn, trade.tokenOut],
        to,
        deadline,
        {
          gasLimit: 3000000,
          gasPrice: ethers.parseUnits("5", "gwei"),
        }
      );
      const receipt2 = await tx2.wait();
      if (receipt2.status !== "1") {
        throw new Error("Trade failed");
      }
      setConfirmed(true);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
        Best Trade Found!
      </h2>
      <div className="bg-[var(--card-bg)] p-6 rounded-lg shadow-md">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-semibold">Exchange:</span>
            <span>{dex.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Token Sold:</span>
            <span className="truncate max-w-[200px]">{trade.tokenIn}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount Sold:</span>
            <span>{trade.amountIn.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Token Bought:</span>
            <span className="truncate max-w-[200px]">{trade.tokenOut}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount Bought:</span>
            <span>{trade.amountOut}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Slippage Tolerance:</span>
            <span>{slippageTolerance}%</span>
          </div>
        </div>
        <button
          className="w-full mt-4 py-3 bg-[var(--primary)] text-white rounded-lg shadow-md hover:bg-[var(--secondary)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={executeTrade}
          disabled={processing}
        >
          {processing ? "Processing..." : "Execute Trade"}
        </button>
        {processing && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            Your trade is processing. Please wait...
          </div>
        )}
        {confirmed && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            Congrats! Your trade was successful 🎉
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            Oops! Trade failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
