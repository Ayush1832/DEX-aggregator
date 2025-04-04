import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Permanent_Marker } from "next/font/google";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Dex Aggregator",
  description: "Optimize your trades on DEXes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={permanentMarker.className}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
