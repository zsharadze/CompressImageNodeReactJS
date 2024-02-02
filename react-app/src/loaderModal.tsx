const LoaderModal = ({ showLoader }) => {
  return (
    <div
      className="modal"
      id="loaderModal"
      style={{ display: showLoader ? "block" : "none", zIndex: "999999" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="loader-modal-content"
          style={{ border: "0", marginLeft: "110px" }}
        >
          <img
            src="/loader-img.gif"
            alt="loading..."
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoaderModal;
