/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import "./App.css";
import React from "react";
import { urlSchema } from "./zod";
import { Tweet } from "react-tweet";
import { Download } from "lucide-react";
import RootLayout from "./components/layouts/RootLayout";
import { exportComponentAsPNG } from "react-component-export-image";

function App() {
  const componentRef = React.useRef<HTMLDivElement>(null);
  const [tweetId, settweetId] = React.useState<string>("");
  const [inputUrl, setInputUrl] = React.useState<string>("");

  function useDebounce(fn: Function, delay: number) {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const debounceHandler = React.useCallback(useDebounce(setInputUrl, 500), []);

  React.useEffect(() => {
    if (inputUrl) {
      const url = new URL(inputUrl);

      const regex = /\/status\/(\d+)/;
      const match = url.pathname.match(regex);
      if (match) {
        const tweetId = match[1];
        settweetId(tweetId);
      }
    }
  }, [inputUrl]);

  return (
    <RootLayout>
      <div className="h-full w-full flex flex-col gap-4 items-center justify-center overflow-x-hidden">
        <div className="w-[80%] md:w-[64%]">
          {tweetId ? (
            <div className="relative w-full flex items-center">
              <div
                ref={componentRef}
                className="p-4 w-[96%] h-[60%] flex items-center justify-center"
              >
                <Tweet id={tweetId} />
              </div>
              <button
                onClick={() => {
                  exportComponentAsPNG(componentRef, {
                    fileName: `converted-tweet-to-image-${tweetId}`,
                  });
                }}
                className="absolute h-12 w-16 -bottom-4 right-0 rounded-full flex items-center justify-center shadow shadow-blue-300 hover:shadow hover:shadow-blue-500 sm:bottom-10 sm:-right-8 md:bottom-12 md:right-28"
              >
                <Download />
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 items-center justify-center">
              <h1 className="w-full text-center flex flex-col items-center justify-center text-4xl font-black sm:flex-row sm:text-3xl md:text-4xl lg:text-5xl">
                <span>Simple</span>
                <span className="mx-2 text-blue-600">tweet-to-image</span>
                <span>converter</span>
              </h1>
              <input
                type="url"
                onChange={(event) => {
                  const value: string = event.target.value;
                  const result = urlSchema.safeParse(value);
                  if (result.success) {
                    debounceHandler(value);
                  }
                }}
                className="block w-full p-3 border-4 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[80%]"
              />
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}

export default App;
