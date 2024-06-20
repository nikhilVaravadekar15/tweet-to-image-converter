/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { z } from "zod";
import { Tweet } from "react-tweet";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

const urlSchema = z
  .string()
  .url()
  .startsWith("https://twitter.com")
  .or(z.string().url().startsWith("https://x.com"));

export default function Home() {
  const [inputUrl, setInputUrl] = React.useState<string>("");
  const [tweetId, settweetId] = React.useState<string>("");

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

  async function handleImageDownload() {
    const element = document.getElementById("print"),
      canvas = await html2canvas(element!),
      data = canvas.toDataURL("image/jpg"),
      link = document.createElement("a");

    link.href = data;
    link.download = `downloaded-image-${tweetId}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const debounceHandler = React.useCallback(useDebounce(setInputUrl, 500), []);

  useEffect(() => {
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
      <div className="w-[80%] md:w-[48%]">
        {tweetId ? (
          <div className="relative w-full flex items-center">
            <>
              <div
                id="print"
                className="p-4 w-[96%] h-[60%] flex items-center justify-center"
              >
                <Tweet id={tweetId} />
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  handleImageDownload();
                }}
                className="absolute rounded-full top-10 -right-2 shadow shadow-blue-300  hover:shadow hover:shadow-blue-500"
              >
                <Download />
              </Button>
            </>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center">
            <h1 className="text-2xl font-black text-center sm:text-2xl md:text-3xl lg:text-4xl">
              Simple
              <span className="mx-2 text-blue-600">tweet-to-image</span>
              converter
            </h1>
            <Input
              type="url"
              placeholder=""
              onChange={(event) => {
                const value: string = event.target.value;

                const result = urlSchema.safeParse(value);
                if (result.success) {
                  debounceHandler(value);
                } else {
                  console.log(result.error.issues);
                }
              }}
              className="block w-full p-6 border-4 rounded-full text-lg focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-black"
            />
          </div>
        )}
      </div>
    </main>
  );
}
