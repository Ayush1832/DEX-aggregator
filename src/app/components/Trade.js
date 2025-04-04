"use client";
import { useState } from "react";
const slippageTolerance = 10; //%
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
      const deadline = Maths.floor(Date.now() / 1000) + 60 * 60;
       const tx2 = await dex.contract.swapTokensForExactTokens(
        trade.amountOut,
        amountInMax,
        [trade.tokenIn, trade.tokenOut],
        to,
        deadline,
        {
          gasLimit: 3000000,
          gasPrice: ethers.utils.parseUnits("5", "gwei"),
        }
      );
      const receipt2 = await tx2.wait();
      if(receipt1.status !== "1"){
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
    <>
      <h2 className="fw mt-3">The best price was found!</h2>
      <ul className="list-group mb-3">
        <li className="list-group-item">Exchange: {dex.name}</li>
        <li className="list-group-item">
          Address of token sold: {trade.tokenIn}
        </li>
        <li className="list-group-item">
          Amount of token sold: {trade.amountIn.toString()}
        </li>
        <li className="list-group-item">
          Address of token bought: {trade.tokenOut}
        </li>
        <li className="list-group-item">
          Amount of token bought: {trade.amountOut}
        </li>
        <li className="list-group-item">
          Slippage tolerance: {slippageTolerance}
        </li>
      </ul>
      <button
        className="btn btn-primary"
        onClick={executeTrade}
        disabled={processing}
      >
        Trade
      </button>
      {processing && (
        <div className="alert alert-info mt-4 mb-0">
          Your trade is processing. Please wait until the transaction is mined
        </div>
      )}
      {confirmed && (
        <div className="alert alert-info mt-4 mb-0">
          Congrats! Your trade was successful
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-4 mb-0">
          Opps...Your trade failed. Please try again later
        </div>
      )}
    </>
  );
}
