import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifact, donationAmountInRealCurrency) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.getAccounts();
      const networkID = await web3.eth.net.getId();

      const { abi } = artifact;
      let address, contract;
      try {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error(err);
      }
      dispatch({
        type: actions.init,
        data: {
          artifact,
          web3,
          accounts,
          networkID,
          contract,
          donationAmountInRealCurrency,
        },
      });
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/CharityPeers.json");

        let temp;
        const lastApiCallTimestamp = window.localStorage.getItem(
          "lastApiCallTimestamp"
        );
        const donationAmountInRealCurrency = window.localStorage.getItem(
          "donationAmountInRealCurrency"
        );
        if (
          lastApiCallTimestamp &&
          donationAmountInRealCurrency &&
          Date.now() - parseInt(lastApiCallTimestamp) < 1000 * 60 * 60
        ) {
          temp = JSON.parse(donationAmountInRealCurrency);
        } else {
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd%2Cinr"
          );
          const data = await response.json();
          temp = {
            usd: data.ethereum.usd,
            inr: data.ethereum.inr,
          };
          window.localStorage.setItem(
            "donationAmountInRealCurrency",
            JSON.stringify({
              usd: data.ethereum.usd,
              inr: data.ethereum.inr,
            })
          );
          window.localStorage.setItem("lastApiCallTimestamp", Date.now());
        }
        init(artifact, temp);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
