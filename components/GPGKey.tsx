import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCopyToClipboard } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const mPubID = `rsa4096/1B35E71D2AD7D44E 2024-04-18 [SC] [expires: 2025-04-18]`;
const mPubFingerprint = `B3C97C24E201EF1777ABFF0B1B35E71D2AD7D44E`;
const uid = `[ultimate] Michael Newman Fortunato (Hadrian) <michael.n.fortunato@gmail.com>`;
const subPubID = `rsa4096/6E20758D549A7D0F 2024-04-18 [E] [expires: 2025-04-18]`;
const subPubFingerprint = `      994CE1164CB34E4973FA56556E20758D549A7D0F`;

const publicKeyExport = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=Pe0b
-----END PGP PUBLIC KEY BLOCK-----
`;

const publicKeyEntry = `pub   rsa4096/1B35E71D2AD7D44E 2024-04-18 [SC] [expires: 2025-04-18]
      B3C97C24E201EF1777ABFF0B1B35E71D2AD7D44E
uid                 [ultimate] Michael Newman Fortunato (Hadrian) <michael.n.fortunato@gmail.com>
sub   rsa4096/6E20758D549A7D0F 2024-04-18 [E] [expires: 2025-04-18]
      994CE1164CB34E4973FA56556E20758D549A7D0F
`;
const CopyButton: React.FC<
  {
    text: string;
    handleCopyPromise: (copyPromise: Promise<boolean>) => void;
  } & React.ComponentProps<typeof Button>
> = ({ className, text, handleCopyPromise, ...props }) => {
  const [copiedText, setCopiedText] = useCopyToClipboard();
  return (
    <Button
      onClick={() => handleCopyPromise(setCopiedText(text))}
      variant="outline"
      size="icon"
      className={cn("active:bg-card active:text-black", className)}
    >
      <Copy />
    </Button>
  );
};

CopyButton.displayName = "CopyButton";
function GPGKey() {
  const { toast } = useToast();
  return (
    <div className="h-full max-h-[80vh] w-full max-w-[inherit] overflow-hidden rounded p-8 outline outline-background">
      <div className="relative h-full max-h-[80vh] w-full max-w-[inherit] rounded outline-background">
        <div className="absolute right-0 top-0 z-50">
          <CopyButton
            className="bg-card"
            text={publicKeyExport}
            handleCopyPromise={(hello) =>
              hello
                .then(() =>
                  toast({
                    title: "Copied GPG Key Clipboard!",
                    className: "flex justify-center",
                    duration: 1000,
                  }),
                )
                .catch((e) => console.log(e))
            }
          />
        </div>
        <ScrollArea className="h-full max-h-[inherit] w-full max-w-[inherit]">
          <pre className="select-all">{publicKeyExport}</pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default GPGKey;
