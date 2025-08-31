const Message = ({ variant, children }) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-[#50C878] text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-[#50C878] text-[#333333]";
    }
  };
  return <div className={`p-4 rounded ${getVariantClass()}`}>{children}</div>;
};

export default Message;
