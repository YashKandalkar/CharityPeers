import { useEffect, useState } from "react";
import { useEth } from "../contexts/EthContext";
import CharityItem from "./CharityItem";

const CharityList = () => {
  const { state } = useEth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [charityCount, setCharityCount] = useState(null);
  const [donationAmountInRealCurrency, setDonationAmountInRealCurrency] =
    useState({ usd: 0, inr: 0 });

  useEffect(() => {
    async function getDonationAmountInRealCurrency() {
      const lastApiCallTimestamp = window.localStorage.getItem(
        "lastApiCallTimestamp"
      );
      if (
        lastApiCallTimestamp &&
        Date.now() - parseInt(lastApiCallTimestamp) < 1000 * 60 * 60
      ) {
        const donationAmountInRealCurrency = window.localStorage.getItem(
          "donationAmountInRealCurrency"
        );
        if (donationAmountInRealCurrency) {
          setDonationAmountInRealCurrency(
            JSON.parse(donationAmountInRealCurrency)
          );
          return;
        }
      }

      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd%2Cinr"
      );
      const data = await response.json();
      setDonationAmountInRealCurrency({
        usd: data.ethereum.usd,
        inr: data.ethereum.inr,
      });
      window.localStorage.setItem(
        "donationAmountInRealCurrency",
        JSON.stringify({
          usd: data.ethereum.usd,
          inr: data.ethereum.inr,
        })
      );
      window.localStorage.setItem("lastApiCallTimestamp", Date.now());
    }
    getDonationAmountInRealCurrency();

    if (!state.contract) return;
    if (charityCount === null) {
      state.contract.methods.charityCount().call((err, res) => {
        if (err) {
          console.log(err);
        } else {
          setCharityCount(parseInt(res));
          console.log(res);
        }
      });
    } else {
      console.log("here", charityCount);
      const tempCharities = [];
      for (let i = 1; i <= charityCount; i++) {
        state.contract.methods.charities(i).call((err, res) => {
          if (err) {
            console.log(err);
          } else {
            tempCharities.push(res);
            console.log("heraae", charityCount);

            if (tempCharities.length === charityCount) {
              console.log("herbbb", charityCount);

              setCharities(tempCharities);
              console.log(tempCharities);
              setLoading(false);
            }
          }
        });
      }
    }

    return () => {};
  }, [state, charityCount]);

  return (
    <div className="flex flex-wrap flex-row gap-4 p-8">
      {loading ? (
        <div></div>
      ) : (
        charities.map((charity, index) => {
          return (
            <CharityItem
              key={index}
              ownerAddress={state.accounts[0]}
              charity={charity}
              setCharities={setCharities}
              index={index + 1}
              donationAmountInRealCurrency={donationAmountInRealCurrency}
            />
          );
        })
      )}
    </div>
  );
};

export default CharityList;
