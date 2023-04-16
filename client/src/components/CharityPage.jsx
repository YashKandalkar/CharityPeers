import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useEth } from "../contexts/EthContext";
import { useParams } from "react-router-dom";
import { ProgressBar } from "react-progressbar-fancy";
import ShowDonations from "./ShowDonations";
import EthToRealTooltip from "./EthToRealTooltip";

const CharityPage = () => {
  const { state } = useEth();
  const [loading, setLoading] = useState(true);
  const [charityCount, setCharityCount] = useState(null);
  const [charityExists, setCharityExists] = useState(null);
  const [charity, setCharity] = useState(null);

  const { id } = useParams();
  const charityId = parseInt(id);

  useEffect(() => {
    if (!state.contract) return;
    if (charityCount === null) {
      state.contract.methods.charityCount().call((err, res) => {
        if (err) {
          console.log(err);
        } else {
          setCharityCount(parseInt(res));
          console.log(res);
          if (parseInt(res) === 0 || parseInt(res) < charityId) {
            setLoading(false);
            setCharityExists(false);
          } else {
            state.contract.methods.charities(charityId).call((err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log(res);
                setCharity(res);
                setLoading(false);
                setCharityExists(true);
              }
            });
          }
        }
      });
    }

    return () => {};
  }, [charityCount, charityId, state]);
  return (
    <>
      <NavBar user={null} setShowModal={null} />
      <section className="mt-20 py-20">
        {loading ? (
          <div className="flex justify-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
              Loading...
            </div>
          </div>
        ) : charityExists ? (
          <div
            className="flex flex-col items-center  rounded-lg border-green-400 mx-12 p-12"
            style={{
              backdropFilter: "blur(10px) saturate(140%)",
              backgroundColor: "rgba(255,255,255,0.5)",
              borderWidth: "1px",
            }}
          >
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold mb-4">{charity.name}</h1>
              <p className="text-xl">{charity.description}</p>
            </div>
            <div
              className="flex flex-row w-full justify-evenly bg-gray-100 py-2 mt-4 border-gray-400"
              style={{ borderWidth: 1 }}
            >
              <span>
                Goal:{" "}
                <span className="font-bold">{charity.goalAmount}ETH</span>{" "}
              </span>
              <span>
                {" "}
                Total Donations:{" "}
                <span className="font-bold">{charity.totalDonationCount}</span>
              </span>
            </div>
            <h1 className="text-2xl whitespace-nowrap flex gap-1 text-center mt-4">
              🎉 Amount Raised:{" "}
              <b>
                <EthToRealTooltip
                  value={state.web3.utils.fromWei(
                    charity.totalDonationAmount.toString(),
                    "ether"
                  )}
                >
                  {state.web3.utils.fromWei(
                    charity.totalDonationAmount.toString(),
                    "ether"
                  )}{" "}
                  Eth
                </EthToRealTooltip>
              </b>{" "}
              🎉
            </h1>
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
              className="mt-1"
            />
            <ShowDonations charityId={charityId} />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold">Charity not found</h1>
          </div>
        )}
      </section>
    </>
  );
};

export default CharityPage;
