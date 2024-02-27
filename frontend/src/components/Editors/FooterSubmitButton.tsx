import React from "react";

const FooterSubmitButton: React.FC<any> = ({
  data,
  activeTabId,
  generateResultForPrompt,
}) => {
  const handleClick = async () => {
    try {
      var output = await generateResultForPrompt(activeTabId as string);
    } catch (e) {
      //print axios error
    }
  };

  return (
    <button
      id="submit-prompt"
      tabIndex={0}
      className={`btn btn-sm btn-filled ${
        data.loading ? "btn-neutral" : "btn-primary"
      } pg-submit-btn`}
      type="button"
      aria-haspopup="true"
      aria-expanded="false"
      onClick={handleClick}
    >
      <span className="btn-label-wrap">
        <span className="btn-label-inner">
          {data.loading ? "Processing..." : "Submit"}
        </span>
      </span>
    </button>
  );
};

export default FooterSubmitButton;
