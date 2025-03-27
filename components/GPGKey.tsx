import React, { useEffect, useRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCopyToClipboard, useIsMounted } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Fingerprint, KeyRound, KeySquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { CheckIcon, DownloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Copy from "@geist-ui/icons/copy";
import GNUIcon from "@/public/Official_gnu.svg";
import { motion } from "framer-motion";

const mPubID = `rsa4096 2025-03-27 [SC] [expires: 2026-03-27]`;
const mPubFingerprint = `D7E18BB5FDB3851CB7F7F0EF8B87187D74CC41FC`;
const uid = `[ultimate] Michael Newman Fortunato (Tacitus) <michael.n.fortunato@gmail.com>`;
const subPubID = `rsa4096 2025-03-27 [E] [expires: 2026-03-27]`;
const subPubFingerprint = ``;

const publicKeyExport = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=al8q
-----END PGP PUBLIC KEY BLOCK-----
`;

const publicKeyEntry = `pub   rsa4096 2025-03-27 [SC] [expires: 2026-03-27]
      D7E18BB5FDB3851CB7F7F0EF8B87187D74CC41FC
uid           [ultimate] Michael Newman Fortunato (Tacitus) <michael.n.fortunato@gmail.com>
sub   rsa4096 2025-03-27 [E] [expires: 2026-03-27]`
;

import Check from "@geist-ui/icons/check";
const CopyButton: React.ForwardRefExoticComponent<
  {
    textToCopy: string;
    handleCopyPromise: (copyPromise: Promise<boolean>) => void;
  } & React.ComponentProps<typeof Button> &
    React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(
  ({ className, textToCopy, handleCopyPromise, ...props }, ref) => {
    const [copiedText, setCopiedText] = useCopyToClipboard();
    const [showCheck, setShowCheck] = useState(false);
    const timer = useRef<any>(null);

    useEffect(() => {
      if (showCheck) {
        timer.current = setTimeout(() => {
          setShowCheck(false);
        }, 1000);
      } else {
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
      }
      return () => {
        timer.current && clearTimeout(timer.current);
      };
    }, [showCheck]);

    return (
      <Button
        ref={ref}
        {...props}
        variant="ghost"
        size="icon"
        className={cn("active:text-black", className)}
        onClick={(e) => {
          if (!showCheck) {
            handleCopyPromise(setCopiedText(textToCopy));
          }
          setShowCheck(!showCheck);
        }}
      >
        {showCheck ? <Check width={24} height={24} /> : <Copy />}
      </Button>
    );
  },
);
CopyButton.displayName = "CopyButton";

function GPGKeyEntry() {
  return (
    <div className="grid grid-flow-col grid-rows-5 gap-x-4 gap-y-2">
      <div className="row-span-5 grid grid-rows-subgrid">
        <div>
          <Badge variant={"outline"}>
            <span className="flex gap-1">
              <span>pub</span>
              <KeySquare size={15} strokeWidth={1} />
            </span>
          </Badge>
        </div>
        <div className="row-start-2 mt-1 flex flex-row-reverse">
          <Fingerprint strokeWidth={1} size={15} />
        </div>
        <div className="row-start-3 whitespace-nowrap">
          {" "}
          {/*  Keeps mnf on same line*/}
          <span>uid</span>
          <Image
            className="ml-1 inline"
            src={GNUIcon}
            width={15}
            height={15}
            alt="bundle size image"
          />
          <span>/</span>
          <span className="font-moniker text-xs font-bold italic">mnf</span>
        </div>
        <div className="row-start-4">
          <Badge variant={"outline"}>
            <span className="flex gap-1">
              <span>sub</span>
              <KeySquare size={15} strokeWidth={1} />
            </span>
          </Badge>
        </div>
        <div className="row-start-5 mt-1 flex flex-row-reverse">
          <Fingerprint strokeWidth={1} size={15} />
        </div>
      </div>
      <div className="col-start-3 col-end-9">{mPubID}</div>
      <div className="col-start-3 col-end-9">{mPubFingerprint}</div>
      <div className="col-start-6 col-end-9 whitespace-nowrap">{uid}</div>
      <div className="col-start-3 col-end-9">{subPubID}</div>
      <div className="col-start-3 col-end-9">{subPubFingerprint}</div>
    </div>
  );
}

function Terminal() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex h-full max-h-[inherit] w-full max-w-[inherit] flex-col divide-y divide-zinc-300 rounded bg-card">
      <div className="flex items-center rounded-t border-b-zinc-200 bg-zinc-200 px-4 py-1 text-accent/75">
        <div className="flex flex-auto gap-2">
          <div className="relative">
            <Button
              variant="default"
              className="prose w-fit cursor-pointer rounded bg-current bg-zinc-200 p-2 text-sm text-accent/75 hover:bg-accent/15 hover:text-black"
              onClick={() => setSelected(0)}
            >
              PGP Key
            </Button>
            {selected == 0 && (
              <div className="absolute flex w-full justify-center">
                <motion.hr className="h-2 w-2/4" />
              </div>
            )}
          </div>
          <div className="relative">
            <Button
              variant="default"
              className="prose w-fit cursor-pointer rounded bg-current bg-zinc-200 p-2 text-sm text-accent/75 hover:bg-accent/15 hover:text-black"
              onClick={() => setSelected(1)}
            >
              Metadata
            </Button>
            {selected == 1 && (
              <div className="absolute flex w-full justify-center">
                <motion.hr className="h-2 w-2/4" />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-grow flex-row-reverse gap-2">
          <TooltipProvider>
            <Tooltip open={false} /* Disable tooltip */>
              <TooltipTrigger asChild>
                <CopyButton
                  className="hover:bg-accent/15 hover:text-black"
                  textToCopy={selected == 0 ? publicKeyExport : publicKeyEntry}
                  handleCopyPromise={(hello) =>
                    hello
                      .then(() =>
                        toast({
                          title:
                            selected == 0
                              ? "Copied PGP Key To Clipboard!"
                              : "Copied PGP Metadata To Clipboard!",
                          className: "flex justify-center",
                          duration: 1000,
                        }),
                      )
                      .catch((e) => {
                        console.log(e);
                        toast({
                          title: "Could not copy to clipboard",
                          className: "flex justify-center",
                          duration: 1000,
                        });
                      })
                  }
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip open={false} /* Disable tooltip */>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/15 hover:text-black"
                  asChild
                >
                  <Link href="https://keys.openpgp.org/vks/v1/by-fingerprint/D7E18BB5FDB3851CB7F7F0EF8B87187D74CC41FC">
                    <DownloadIcon width={24} height={24} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Download from OpenPGP</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ScrollArea className="h-full max-h-[inherit] w-full max-w-[inherit] flex-grow p-4 pl-8 pt-0 antialiased">
        {selected == 0 ? (
          <pre className="prose">
            <code>{publicKeyExport}</code>
          </pre>
        ) : (
          <div className="pt-2">
            <GPGKeyEntry />
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function GPGKey() {
  return (
    <div className="max-h-[80vh] overflow-hidden rounded-t p-0">
      <Terminal />
    </div>
  );
}

export default GPGKey;
