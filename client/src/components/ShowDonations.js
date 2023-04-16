import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEth } from "../contexts/EthContext";
import EthToRealTooltip from "./EthToRealTooltip";

const ShowDonations = ({ charityId }) => {
  const { state } = useEth();
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState(null);
  console.log(loading, donations);

  useEffect(() => {
    if (!state.contract) return;
    // Get all donations for this charity
    state.contract.methods
      .getDonationIds(charityId)
      .call((err, allDonationsRes) => {
        if (err) {
          console.log(err);
        } else {
          const tempDonations = [];
          allDonationsRes.forEach((donationId) => {
            // Get donation details for each donation
            state.contract.methods
              .donations(donationId)
              .call((err, donationRes) => {
                if (err) {
                  console.log(err);
                } else {
                  // Get transaction details for each donation
                  console.log(
                    dayjs(parseInt(donationRes.timestamp) * 1000).fromNow(),
                    donationRes.timestamp
                  );

                  state.web3.eth.getTransaction(
                    donationRes.txHash,
                    (err, txRes) => {
                      if (err) {
                        console.log(err);
                      } else {
                        donationRes.txDetails = txRes;
                        tempDonations.push(donationRes);
                        if (tempDonations.length === allDonationsRes.length) {
                          tempDonations.sort((a, b) => {
                            return (
                              parseInt(b.timestamp) - parseInt(a.timestamp)
                            );
                          });
                          setDonations(tempDonations);
                        }
                      }
                    }
                  );
                }
              });
          });

          console.log(tempDonations);
          setLoading(false);
        }
      });

    return () => {};
  }, [charityId, state]);

  useEffect(() => {
    if (!donations) return;

    // adjust with of thead cells when donations are loaded to match the width of the tbody cells
    const theadCells = document.querySelectorAll(".donations-table thead th");
    const tbodyCells = document.querySelectorAll(".donations-table tbody td");
    theadCells.forEach((cell, index) => {
      cell.style.width = `${tbodyCells[index].offsetWidth}px`;
    });

    return () => {};
  }, [donations]);

  dayjs.extend(relativeTime);
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold">Donations</h1>
      <div className="flex flex-col">
        {donations?.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="p-1.5 w-full inline-block align-middle">
              <div className="overflow-hidden border rounded-lg">
                <table className="donations-table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 block">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase "
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase "
                      >
                        hash
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase "
                      >
                        message
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase "
                      >
                        To
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase "
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 max-h-[300px] overflow-y-scroll block">
                    {donations.map((donation, index) => (
                      <tr key={`donation-${charityId}-${index}`}>
                        <td className="px-6 py-4 text-base font-medium text-gray-800 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 w-[200px] block overflow-hidden overflow-ellipsis text-base text-gray-800">
                          {donation.txHash} <br />
                          <span className="text-sm text-gray-500">
                            {dayjs(
                              parseInt(donation.timestamp) * 1000
                            ).fromNow()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-base max-w-xs italic overflow-auto text-center">
                          {donation.message}
                        </td>
                        <td className="px-6 py-4 text-base text-gray-800 whitespace-nowrap">
                          {donation.txDetails.to.slice(0, 8)}...
                          {donation.txDetails.to.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-base font-medium text-right whitespace-nowrap">
                          <span
                            className="text-indigo-600 hover:text-indigo-900"
                            href="/"
                          >
                            <EthToRealTooltip
                              value={state.web3.utils.fromWei(
                                donation.txDetails.value,
                                "ether"
                              )}
                            >
                              {state.web3.utils.fromWei(
                                donation.txDetails.value,
                                "ether"
                              )}{" "}
                              Eth
                            </EthToRealTooltip>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          "No donations yet!"
        )}
      </div>
    </div>
  );
};

export default ShowDonations;
