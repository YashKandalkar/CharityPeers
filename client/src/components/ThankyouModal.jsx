import { faClose, faHandsHelping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const ThankyouModal = ({ showModal, setShowModal, charity, index }) => {
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
                Thank You!
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
                Thank you for your donation to <i>{charity.name}</i> !
              </h5>
              <p className="my-4 text-gray-600 text-lg leading-relaxed">
                Your donation will be used to help the charity in their mission
                to help others.
              </p>
              <p className="my-4 text-gray-600 text-lg leading-relaxed">
                You can{" "}
                <Link
                  to={`/charity/${index}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  view the charity page to view your donation!
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null;
};

export default ThankyouModal;
