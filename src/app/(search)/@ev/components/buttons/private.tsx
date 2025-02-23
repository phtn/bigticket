export const PrivateNoAccess = () => {
  return (
    <h2 className="text-xl font-black">
      <span className="font-bold italic tracking-tighter text-teal-400">
        Diamond
      </span>
      Ticket
    </h2>
  );
};

export const PrivateWithAccess = ({ count }: { count: number }) => (
  <h2 className="text-xl font-black">
    <span className="font-bold italic tracking-tighter text-teal-400">
      Claim
    </span>
    Ticket{count > 1 && "s"}
  </h2>
);
