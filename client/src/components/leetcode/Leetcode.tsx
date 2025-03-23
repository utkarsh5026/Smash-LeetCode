import React, { useEffect, useMemo, useState } from "react";
import ProblemDetail from "./questions/ProblemDetail";
import Problems from "./table/Problems";
import { useLocation } from "react-router-dom";

const Leetcode: React.FC = () => {
  const location = useLocation();

  const problemName = useMemo(() => {
    const parts = location.pathname.split("/");
    return parts.length > 2 ? parts[parts.length - 1] : "";
  }, [location.pathname]);

  console.log(problemName);

  const [showProblems, setShowProblems] = useState<boolean>(!problemName);

  useEffect(() => {
    setShowProblems(!problemName);
  }, [problemName]);

  return (
    <div>
      {!showProblems && problemName && (
        <ProblemDetail problemName={problemName} />
      )}
      {showProblems && <Problems />}
    </div>
  );
};

export default Leetcode;
