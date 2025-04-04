"use client";

import { Contract, isAddress, ethers } from "ethers";
import { useState } from "react";
import blockchain from "../blockchain.json";

export default function SearchTrade({ dexes, signer, setTrade, setToken }) {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountOut, setAmountOut] = useState("");

  const search = async (e) => {
    e.preventDefault();

    if (
      !isAddress(tokenIn) ||
      !isAddress(tokenOut) ||
      isNaN(amountOut) ||
      amountOut <= 0
    ) {
      console.error("Invalid inputs:", { tokenIn, tokenOut, amountOut });
      return;
    }

    try {
      const amountOutBN = ethers.parseUnits(amountOut, 18);
      console.log("Converted amountOut:", amountOutBN.toString());

      const calls = dexes.map(async (dex) => {
        try {
          const dexContract = dex.contract.connect(signer);
          const amounts = await dexContract.getAmountsIn(amountOutBN, [
            tokenIn,
            tokenOut,
          ]);
          console.log(
            `Quote from ${dex.name} (${dex.address}):`,
            amounts.map((a) => a.toString())
          );
          return amounts;
        } catch (error) {
          console.error(
            `Error calling getAmountsIn on ${dex.name} (${dex.address}):`,
            error
          );
          if (error.data) console.log("Revert data:", error.data);
          return null;
        }
      });

      const quotes = (await Promise.all(calls)).filter((q) => q !== null);
      if (quotes.length === 0) {
        console.error(
          "No valid quotes received. Possible causes: invalid token pair, no liquidity, or wrong network."
        );
        return;
      }

      const trades = quotes.map((quote, i) => ({
        address: dexes[i].address,
        amountIn: quote[0],
        amountOut,
        tokenIn,
        tokenOut,
      }));

      trades.sort((trade1, trade2) =>
        trade1.amountIn < trade2.amountIn ? -1 : 1
      );
      console.log("Best trade:", trades[0]);
      setTrade(trades[0]);

      const tokenContract = new Contract(tokenIn, blockchain.erc20ABI, signer);
      setToken(tokenContract);
    } catch (error) {
      console.error("Error fetching trade data:", error);
    }
  };

  return (
    <form onSubmit={search} className="space-y-6 mt-6">
      <div className="relative">
        <input
          type="text"
          className="w-full p-4 bg-[var(--card-bg)] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
          id="tokenIn"
          placeholder="0x..."
          onChange={(e) => setTokenIn(e.target.value)}
          value={tokenIn}
        />
        <label
          htmlFor="tokenIn"
          className="absolute -top-2 left-3 px-1 bg-[var(--card-bg)] text-sm text-gray-500"
        >
          Token to Sell
        </label>
      </div>
      <div className="relative">
        <input
          type="text"
          className="w-full p-4 bg-[var(--card-bg)] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
          id="tokenOut"
          placeholder="0x..."
          onChange={(e) => setTokenOut(e.target.value)}
          value={tokenOut}
        />
        <label
          htmlFor="tokenOut"
          className="absolute -top-2 left-3 px-1 bg-[var(--card-bg)] text-sm text-gray-500"
        >
          Token to Buy
        </label>
      </div>
      <div className="relative">
        <input
          type="text"
          className="w-full p-4 bg-[var(--card-bg)] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200"
          id="amountOut"
          placeholder="0.0"
          onChange={(e) => setAmountOut(e.target.value)}
          value={amountOut}
        />
        <label
          htmlFor="amountOut"
          className="absolute -top-2 left-3 px-1 bg-[var(--card-bg)] text-sm text-gray-500"
        >
          Amount to Buy
        </label>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-[var(--primary)] text-white rounded-lg shadow-md hover:bg-[var(--secondary)] transition-all duration-300 transform hover:scale-105"
      >
        Find Best Trade
      </button>
    </form>
  );
}
