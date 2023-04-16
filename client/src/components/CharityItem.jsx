import { ProgressBar } from "react-progressbar-fancy";
import {
  faEnvelope,
  faHandsHelping,
  faLink,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DonationModal from "./DonationModal";
import { useState } from "react";
import ThankyouModal from "./ThankyouModal";
import { useEth } from "../contexts/EthContext";
import { Link } from "react-router-dom";
import EthToRealTooltip from "./EthToRealTooltip";

const CharityItem = ({
  index,
  charity,
  ownerAddress,
  setCharities,
  donationAmountInRealCurrency,
}) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showThankyouModal, setShowThankyouModal] = useState(false);
  const { state } = useEth();

  return (
    <>
      <div
        className="border-gray-400 p-4 rounded-md w-96 relative overflow-hidden"
        style={{ borderWidth: 1 }}
      >
        <div className="-z-10 ">
          <img
            src={charity.photoUrl}
            alt={charity.name + " photo"}
            className="absolute -z-10 bg-cover top-0 left-0 h-full object-cover"
          />
          <div className="absolute -z-10 top-0 left-0 bg-black opacity-70 w-full h-full" />
        </div>
        <Link
          to={`/charity/${index}`}
          className="text-2xl z-10 text-gray-50 font-bold"
        >
          {charity.name}
        </Link>
        <p
          className="w-full rounded-md py-2 my-2 text-white border-gray-400 p-2 h-36 overflow-y-auto"
          style={{ borderWidth: 1 }}
        >
          {charity.description}
        </p>
        <div
          className="flex flex-row w-full justify-evenly bg-gray-100 py-2 mt-4 border-gray-400"
          style={{ borderWidth: 1 }}
        >
          <span className="flex gap-1">
            Goal:
            <EthToRealTooltip value={charity.goalAmount}>
              <span className="font-bold">{charity.goalAmount}ETH</span>
            </EthToRealTooltip>{" "}
          </span>
          <span>
            {" "}
            Total Donations:{" "}
            <span className="font-bold">{charity.totalDonationCount}</span>
          </span>
        </div>
        <ProgressBar
          progressColor="green"
          score={(
            (state.web3.utils.fromWei(
              charity.totalDonationAmount.toString(),
              "ether"
            ) /
              charity.goalAmount) *
            100
          ).toFixed(2)}
          darkTheme
          className="mt-1"
        />

        <div className="flex justify-center my-4 w-full">
          <button
            onClick={() => setShowDonationModal(true)}
            className="bg-green-500 disabled:bg-gray-400 hover:bg-green-700 w-full text-black font-bold py-2 px-4 rounded"
            disabled={ownerAddress === charity.owner}
            aria-disabled={ownerAddress === charity.owner}
          >
            <FontAwesomeIcon icon={faHandsHelping} /> Donate
          </button>
        </div>
        <hr />
        <div className="mt-4 flex flex-row gap-2 max-w-sm justify-center">
          <div className="flex text-blue-400 hover:text-blue-600 visited:text-purple-500 flex-row gap-1 items-center">
            <a
              href={charity.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLink} />
            </a>
          </div>
          <div className="flex text-blue-400 hover:text-blue-600 visited:text-purple-500 flex-row gap-2 items-center">
            <a
              href={"mailto:" + charity.email}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
          <div className="flex  flex-row gap-1 text-white items-center">
            <FontAwesomeIcon icon={faPhone} />
            {charity.phone}
          </div>
        </div>
        <address className="text-center text-white">
          {charity.physicalAddress}
        </address>
      </div>
      <DonationModal
        showModal={showDonationModal}
        setShowModal={setShowDonationModal}
        setShowThankyouModal={setShowThankyouModal}
        charity={charity}
        setCharities={setCharities}
        index={index}
        donationAmountInRealCurrency={donationAmountInRealCurrency}
      />
      <ThankyouModal
        showModal={showThankyouModal}
        setShowModal={setShowThankyouModal}
        charity={charity}
        index={index}
      />
    </>
  );
};

export default CharityItem;
