import AppleIcon from "../../../assets/apple-round-svgrepo-com.svg";
const AppleAuhtButton = () => {
  return (
    <button
      className={`flex items-center justify-center h-12 md:h-11 rounded-xl transition-all duration-200 bg-blue-50 hover:bg-blue-100 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow group`}
    >
      <img
        src={AppleIcon}
        alt={"provider-google"}
        className="w-7 h-7 group-hover:scale-110 transition-transform duration-200"
      />
    </button>
  );
};

export default AppleAuhtButton;
