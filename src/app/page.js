import Image from "next/image";

export default function Home() {
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
        </div>
      </div>
    </div>
  );
}
