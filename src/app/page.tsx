"use client";

import React from "react";
import { urlSchema } from "@/zod";
import { Tweet } from "react-tweet";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exportComponentAsPNG } from "react-component-export-image";

export default function Home() {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <main className="h-screen w-screen flex flex-col gap-4 items-center justify-center overflow-x-hidden">
      <div className="w-[80%] md:w-[64%]">
        {tweetId ? (
          <div className="relative w-full flex items-center">
            <>
              <div
                ref={componentRef}
                className="p-4 w-[96%] h-[60%] flex items-center justify-center"
              >
                <Tweet id={tweetId} />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  exportComponentAsPNG(componentRef);
                }}
                className="absolute rounded-full top-10 -right-2 shadow shadow-blue-300 hover:shadow hover:shadow-blue-500"
              >
                <Download />
              </Button>
            </>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <h1 className="w-full text-center flex flex-col items-center justify-center text-4xl font-black sm:flex-row sm:text-3xl md:text-4xl lg:text-5xl">
              <span>Simple</span>
              <span className="mx-2 text-blue-600">tweet-to-image</span>
              <span>converter</span>
            </h1>
            <Input
              type="url"
              onChange={(event) => {
                const value: string = event.target.value;
                const result = urlSchema.safeParse(value);
                if (result.success) {
                  debounceHandler(value);
                }
              }}
              className="block w-full p-6 border-4 rounded-full text-lg focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[80%]"
            />
          </div>
        )}
      </div>
    </main>
  );
}
