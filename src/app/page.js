"use client";
import { useEffect, useState } from "react";
import Connect from "./components/connect";
import SearchTrade from "./components/SearchTrade.js";
import Trade from "./components/Trade";
import blockchain from "./blockchain.json";
import { Contract } from "ethers";

export default function Home() {
  const initialDexes = blockchain.dexes.map((dex) => ({
    ...dex,
    ...{ contract: undefined },
  }));
  const [signer, setSigner] = useState(undefined);
  const [dexes, setDexes] = useState(initialDexes);
  const [trade, setTrade] = useState(undefined);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    if (signer) {
      const newDexes = blockchain.dexes.map((dex) => ({
        ...dex,
        ...{ contract: new Contract(dex.address, blockchain.dexAbi, signer) },
      }));
      setDexes(newDexes);
    }
  }, [signer]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div id="content">
        <div id="content-inner">
          <div className="text-center">
            <h1 id="title" className="fw-bold">
              DEX AGGREGATOR
            </h1>
            <p id="sub-title" className="mt-4 fw-bold">
              <span>Optimise your trades</span>
            </p>
          </div>
          {signer ? (
            <>
              <SearchTrade
                dexes={dexes}
                signer={signer}
                setTrade={setTrade}
                setToken={setToken}
              />
              {trade && (
                <Trade
                  dexes={dexes}
                  trade={trade}
                  token={token}
                  signer={signer}
                />
              )}
            </>
          ) : (
            <Connect setSigner={setSigner} />
          )}
        </div>
      </div>
    </div>
  );
}
