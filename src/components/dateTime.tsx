import React, { useState, useEffect } from "react";

const DateTime: React.FC = () => {
  const [timeNow, setTimeNow] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().toLocaleString();
      setTimeNow(now);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <div className="font-semibold text-lg">{timeNow}</div>;
};

export default DateTime;
