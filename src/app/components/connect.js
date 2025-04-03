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
        setError("You need to accept connection request in your metamask in order to use this app.")
    }
  };

  return (
    <div className="text-center">
      <button className="btn btin-primary btn-lg mt-1" onClick={connect}>
        Connect
      </button>
      {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
    </div>
  );
}
