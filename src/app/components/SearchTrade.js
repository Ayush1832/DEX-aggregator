"use client";

import { useState } from "react";

export default function SearchTrade({ dexes, signer , setTrades}) {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountOut, setAmountOut] = useState("");

  const search = async e => {
    e.preventDefault();
   const calls =  dexes.map(dex => (
        dex.contract.getAmountsIn(
            amountOut,
            [tokenIn. tokenOut]
        )
    ));
    const quotes = await Promise.all(calls);
    const trades = quotes.map((quote , i)=>(
        {
            address: dexes[i].address,
            amountIn: quote[0],
            amountOut,
            tokenIn,
            tokenOut
        }
    ));
    trades.sort((trade1, trade2)=> (trade1.amountIn < trade2.amountIn ? -1 : 1));
    setTrades(trades[0]);
  }
  return (
    <form onSubmit = {search}>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="tokenIn"
          placeholder="0x........"
          onChange={(e) => setTokenIn(e.target.value)}
          value={tokenIn}
        />
        <label htmlFor="tokenIn">Address of token Sold</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="tokenOut"
          placeholder="0x........"
          onChange={(e) => setTokenOut(e.target.value)}
          value={tokenOut}
        />
        <label htmlFor="tokenOut">Address of token Bought</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="amountOut"
          placeholder="1000...."
          onChange={(e) => setAmountOut(e.target.value)}
          value={amountOut}
        />
        <label htmlFor="amountOut">Amount of token Bought</label>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}
