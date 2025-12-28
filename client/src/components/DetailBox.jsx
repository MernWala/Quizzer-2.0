const DetailBox = ({ children, className }) => {
  return (
    <div className={`px-4 py-3 bg-gray-700 rounded-md mb-4 ${className}`}>
      {children}
    </div>
  );
};

const Title = ({ children, className }) => {
  return (
    <span
      className={`font-medium text-lg block mb-3 tracking-wider border-b border-white/10 pb-1 ${className}`}
    >
      {children}
    </span>
  );
};

const Body = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};


DetailBox.Title = Title;
DetailBox.Body = Body;

export default DetailBox;
