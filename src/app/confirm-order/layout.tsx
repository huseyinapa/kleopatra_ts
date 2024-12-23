"use client";

import React, { useEffect, useState } from "react";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [load, setLoad] = useState(true);
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const handleLoad = () => {
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setLoad(false);
      },
      loadTime > 1000 ? 0 : 1000 - loadTime
    );

    return () => clearTimeout(timeout);
  }, [loadTime]);

  return (
    <div data-theme="garden">
      {load ? (
        <div className="min-w-fit">
          {/* <Header />
          min-h-[calc(100vh-500px)] */}
          <div className="h-screen flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeDasharray="15"
                strokeDashoffset="15"
                strokeLinecap="round"
                strokeWidth="2"
                d="M12 3C16.9706 3 21 7.02944 21 12"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.3s"
                  values="15;0"
                />
                <animateTransform
                  attributeName="transform"
                  dur="1s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
            </svg>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default MainLayout;
