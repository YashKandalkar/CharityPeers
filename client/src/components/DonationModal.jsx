import { faClose, faHandsHelping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useEth } from "../contexts/EthContext";
import Web3 from "web3";
import dayjs from "dayjs";

const DonationModal = ({
  index,
  charity,
  setCharities,
  showModal,
  setShowModal,
  setShowThankyouModal,
  donationAmountInRealCurrency,
}) => {
  const [donationAmount, setDonationAmount] = useState(0);
  const { state } = useEth();
  const messageRef = useRef();

  const onDonateClick = () => {
    if (!state.contract || !state.web3) return;
    state.web3.eth.sendTransaction(
      {
        from: state.accounts[0],
        to: charity.owner,
        value: state.web3.utils.toWei(donationAmount.toString(), "ether"),
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(dayjs().unix());
          state.contract.methods
            .addDonation(
              index,
              res,
              state.web3.utils.toWei(donationAmount.toString(), "ether"),
              messageRef.current.value,
              dayjs().unix()
            )
            .send({ from: state.accounts[0] }, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log(res);
                setCharities((prev) => {
                  const newCharities = [...prev];
                  newCharities[index - 1].totalDonationCount++;
                  const t = Web3.utils
                    .toBN(newCharities[index - 1].totalDonationAmount)
                    .add(
                      Web3.utils.toBN(
                        Web3.utils.toWei(donationAmount.toString(), "ether")
                      )
                    );

                  // add two wei variables which are in string
                  newCharities[index - 1].totalDonationAmount = t;

                  return newCharities;
                });
                setShowModal(false);
                setShowThankyouModal(true);
              }
            });
        }
      }
    );
  };

  return showModal ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl gap-2 flex flex-row items-center font-semibold">
                <FontAwesomeIcon icon={faHandsHelping} />
                Donate to{" "}
                <span className="text-green-600 italic">"{charity.name}"</span>
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <FontAwesomeIcon icon={faClose} className="text-black" />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 py-2 flex-auto">
              <h5>
                About <i>{charity.name}</i>:
              </h5>
              <p
                className="rounded-md py-2 my-2  border-gray-400 p-2 h-36 leading-relaxed max-h-20 overflow-y-auto"
                style={{ borderWidth: 1 }}
              >
                {charity.description}
              </p>
              <div className="flex flex-row items-center gap-2">
                <b>Owner Address:</b>
                <p className="text-lg">{charity.owner}</p>
              </div>
              <hr />
              <div className="flex flex-col mt-2">
                <b>Enter Amount to donate (in ETH):</b>
                <input
                  onChange={(e) => setDonationAmount(e.target.value)}
                  type="number"
                  className="rounded-md py-2 my-2  border-gray-400 p-2"
                  style={{ borderWidth: 1 }}
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div>
                  Amount in USD:{" "}
                  <span className="font-bold ml-2">
                    $
                    {(
                      donationAmount * donationAmountInRealCurrency.usd
                    ).toFixed(2)}{" "}
                    /-
                  </span>
                </div>

                <div>
                  Amount in INR:{"   "}
                  <span className="font-bold ml-2">
                    ₹
                    {(
                      donationAmount * donationAmountInRealCurrency.inr
                    ).toFixed(2)}{" "}
                    /-
                  </span>
                </div>
              </div>
              <hr />
              <div className="flex flex-col mt-2">
                <b>Write a short encouraging message:</b>
                <textarea
                  ref={messageRef}
                  maxLength={100}
                  className="rounded-md py-2 my-2 border-gray-400 p-2"
                  style={{ borderWidth: 1 }}
                  placeholder="Write a message here... (Optional)"
                ></textarea>
              </div>
              <div className="flex justify-center my-4 w-full">
                <button
                  onClick={onDonateClick}
                  disabled={donationAmount <= 0}
                  className="disabled:bg-gray-400 bg-green-500 hover:bg-green-700 w-full    text-black font-bold py-2 px-4 rounded"
                >
                  <FontAwesomeIcon icon={faHandsHelping} /> Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null;
};

export default DonationModal;
