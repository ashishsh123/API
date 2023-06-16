import React, { useState, useEffect } from "react";

function SummaryComponent() {
  const [story, setStory] = useState("");
  const [summary, setSummary] = useState("");
  const [temperature, setTemperature] = useState(0.3);
  const [isStoryEmpty, setIsStoryEmpty] = useState(false);
  const [error, setError] = useState("");
  const [isReset, setIsReset] = useState(false);
  const [resetSummary, setResetSummary] = useState(false);
  useEffect(() => {
    if (resetSummary) {
      setSummary("");
      setResetSummary(false);
    }
  }, [resetSummary]);

  const handleSummaryClick = async () => {
    if (!story) {
      setIsStoryEmpty(true);

      return;
    }

    setIsStoryEmpty(false); // Reset the error message

    try {
      const response = await fetch("http://localhost:3001/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story, temperature }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        setError(""); // Reset the error message
      } else {
        setError("Error occurred while getting the summary."); // Set the error message
      }
    } catch (error) {
      setError("Error occurred while getting the summary."); // Set the error message
    }
  };

  const renderSummaryAsBulletPoints = () => {
    if (
      !summary ||
      typeof summary !== "string" ||
      summary === "" ||
      resetSummary
    ) {
      return null;
    }

    const bulletPoints = summary
      .split(". ")
      .map((sentence, index) => <li key={index}>{sentence}</li>);

    return <ul>{bulletPoints}</ul>;
  };

  // const handleResetClick = () => {
  //   setIsReset(true);
  //   setStory("");
  // };

  const handleResetClick = () => {
    setStory("");
    setIsReset(true);
    setResetSummary(true);
    setTimeout(() => {
      setIsReset(false);
    }, 0);
  };

  return (
    <div className="container">
      <h1 className="heading my-3 fw-bold">Story Summarizer</h1>
      <form>
        <div className="form-group">
          <textarea
            value={isReset ? "" : story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Enter your story..."
            className={`form-control${isStoryEmpty ? " is-invalid" : ""}`}
            style={{ height: "200px", width: "800px" }}
          />
          {isStoryEmpty && (
            <div className="invalid-feedback">
              Please enter a story before getting the summary.
            </div>
          )}
        </div>
      </form>
      <br />
      <div>
        <button
          type="button"
          className="btn btn-info btn-hover my-3"
          onClick={handleSummaryClick}
        >
          Get Summary (Default)
        </button>
        <button
          type="button"
          className="btn btn-info btn-hover my-3 mx-2"
          onClick={() => {
            setTemperature(0.5);
            handleSummaryClick();
          }}
        >
          Get Summary (Temperature: 0.5)
        </button>
        <button
          type="button"
          className="btn btn-info btn-hover my-3"
          onClick={() => {
            setTemperature(0.7);
            handleSummaryClick();
          }}
        >
          Get Summary (Temperature: 0.7)
        </button>
        <button
          type="button"
          className="btn btn-info btn-hover my-3 mx-2"
          onClick={handleResetClick}
        >
          Reset
        </button>
      </div>
      <h3 className="summary my-5 fw-bold">Summary</h3>
      {error && <div className="text-danger">{error}</div>}
      {renderSummaryAsBulletPoints()}
    </div>
  );
}

export default SummaryComponent;
