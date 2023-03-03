const Spinner = () => {
   return (
      <div
         className="ms-2 spinner-border"
         role="status"
         style={{ width: "100px", height: "100px" }}
      >
         <span className="visually-hidden">Loading...</span>
      </div>
   );
};

export default Spinner;
