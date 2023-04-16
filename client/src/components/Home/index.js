import AddUserDetails from "../AddUserDetails";
import CharityList from "../CharityList";
import { Landing } from "../Landing";
import "react-tooltip/dist/react-tooltip.css";

const Home = ({ loading, userDetails }) => {
  return loading ? (
    <div></div>
  ) : userDetails.name === "" ? (
    <AddUserDetails />
  ) : (
    <section>
      <Landing />
      <CharityList />
    </section>
  );
};

export default Home;
