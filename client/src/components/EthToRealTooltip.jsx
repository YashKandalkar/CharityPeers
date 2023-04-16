import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Web3 from "web3";
import { useEth } from "../contexts/EthContext";

const EthToRealTooltip = ({ children, value }) => {
  const id = Web3.utils.randomHex(8);
  const { state } = useEth();
  return (
    <div className="">
      <div data-tooltip-id={id}>{children}</div>
      <Tooltip id={id} className="text-base">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="text-gray-300">INR:</div>
            <div className="ml-2">
              ₹
              {(value * state.donationAmountInRealCurrency.inr).toLocaleString(
                {
                  maximumFractionDigits: 2,
                }
              )}
              /-
            </div>
          </div>
          <div className="flex flex-row">
            <div className="text-gray-300">USD:</div>
            <div className="ml-2">
              $
              {(value * state.donationAmountInRealCurrency.usd).toLocaleString(
                "en-US",
                {
                  maximumFractionDigits: 2,
                }
              )}
              /-
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default EthToRealTooltip;
