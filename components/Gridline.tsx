import type { CSSProperties } from "react";

type GridlineProps = {
  isRow: boolean;
  width: number;
  height: number;
  duration: number;
  delay: number;
  fixedPos: number;
  floatingPos: number;
  isDot?: boolean;
};

function Gridline(props: GridlineProps) {
  const circleSize = 10; // in pixels
  const circleXScaling = (props.width / circleSize) * 2;
  const circleYScaling = (props.height / circleSize) * 2;

  const style: CSSProperties & Record<string, string | number> = {
    width: circleSize,
    height: circleSize,
    left: props.isRow ? `${props.floatingPos}vw` : `${props.fixedPos}vw`,
    top: props.isRow ? `${props.fixedPos}vh` : `${props.floatingPos}vh`,
    animationDuration: `${props.duration / 1000}s`,
    animationDelay: `${props.delay / 1000}s`,
    "--mf-gridline-scale-x": circleXScaling,
    "--mf-gridline-scale-y": circleYScaling,
  };

  return (
    <div
      className={`mf-gridline ${props.isRow ? "mf-gridline--row" : "mf-gridline--col"}`}
      style={style}
      aria-hidden="true"
    />
  );
}

Gridline.displayName = "Gridline";

export default Gridline;
