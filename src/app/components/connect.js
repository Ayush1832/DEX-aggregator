"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function Connect({ setSigner }) {
  const [error, setError] = useState(undefined);

  const connect = async () => {
    if (!window.ethereum) {
      setError("You need to install metamask to use this app.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
    } catch {
      setError(
        "You need to accept connection request in your metamask in order to use this app."
      );
    }
  };

  return (
    <div className="text-center">
      <button
        className="mt-4 px-6 py-3 bg-[var(--primary)] text-white rounded-lg shadow-md hover:bg-[var(--secondary)] transition-all duration-300 transform hover:scale-105"
        onClick={connect}
      >
        Connect Wallet
      </button>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
