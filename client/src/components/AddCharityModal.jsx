import { faHandsHelping, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddCharityForm from "./AddCharityForm";
import { useEth } from "../contexts/EthContext";
import Web3 from "web3";

export default function AddCharityModal({ showModal, setShowModal }) {
  const { state } = useEth();

  const onSave = (data) => {
    state.contract.methods
      .addCharity(
        state.accounts[0],
        data.Name,
        data.Description,
        data.Website,
        data.PhotoURL,
        data.Email,
        data.MobileNumber,
        data.Address,
        0,
        Web3.utils.toWei(data.Goal.toString(), "ether"),
        0
      )
      .send({ from: state.accounts[0] }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          window.location.reload();
          setShowModal(false);
        }
      });
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
                Fight For a Cause
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
              <p className=" text-slate-700 text-sm leading-relaxed">
                Create a new cause to fight for. <br /> Fill in the details
                below and people around the world will be able to donate to
                your cause.
              </p>
            </div>
            <div>
              <AddCharityForm setShowModal={setShowModal} onSave={onSave} />
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null;
}
