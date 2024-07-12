"use client";
import { IconButton } from "@mui/material";
import { ReactElement, ReactNode, useState } from "react";
import FlipIcon from "@mui/icons-material/Flip";

export function StyledTile({
  props,
  children,
}: {
  props?: any;
  children: ReactNode;
}) {
  return (
    <div className="min-h-96 rounded bg-neutral-50 p-3 shadow-md">
      {children}
    </div>
  );
}

export function TileFactory(
  title: string,
  leftHandComponent: ReactElement,
  rightHandComponent: ReactElement,
  link: string,
) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <StyledTile>
      <div className="flex flex-col gap-5">
        <div className="p2 flex">
          <div className="flex-1">
            <h2 className="p-4 text-5xl">{title}</h2>
          </div>
          <div className="flex flex-1 flex-row-reverse">
            <IconButton aria-label="View full">
              <FlipIcon />
            </IconButton>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 p-4">{leftHandComponent}</div>
          <div className="flex-1">{rightHandComponent}</div>
        </div>
      </div>
    </StyledTile>
  );
}
