"use client";
import { useEffect, useState } from "react";
import Connect from "./components/connect";
import SearchTrade from "./components/SearchTrade.js";
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
    <div className="container-fluid mt-5 mb-5 d-flex justify-content center">
      <div id="content" className="row">
        <div id="content-liner" className="col">
          <div className="text-center">
            <h1 id="title" className="fw-bold">
              {" "}
              DEX AGGREGATOR
            </h1>
            <p id="sub-title" className="mt-4 fw-bold">
              <span>Optimise your trades</span>
            </p>
          </div>
          {signer ? (
            <SearchTrade dexes = {dexes} signer={signer} setTrade= {setTrade}/>
          ) :  <Connect setSigner={setSigner}/> }

        </div>
      </div>
    </div>
  );
}
