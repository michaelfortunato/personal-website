import { useEffect, useState } from "react";
import Gridline from "./Gridline";

const MIN_DURATION = 250;
const MIN_DELAY = 1300;

function timing(
  avgDuration: number,
  avgDelay: number,
  randomize: boolean = false,
) {
  const duration = MIN_DURATION + avgDuration * (false ? Math.random() : 1);
  const delay = MIN_DELAY + avgDelay * (randomize ? Math.random() : 1); // avgDelay + 200 * randn_bm();
  return { duration, delay };
}

export default function Grid(props: any) {
  const [rowConfigs, setRowConfigs] = useState<
    | {
        isDot: boolean;
        duration: number;
        delay: number;
        fixedPos: any;
        floatingPos: number;
      }[]
    | null
  >(null);
  const [colConfigs, setColConfigs] = useState<
    | {
        isDot: boolean;
        duration: number;
        delay: number;
        fixedPos: any;
        floatingPos: number;
      }[]
    | null
  >(null);
  const [numColLines, setNumColLines] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const numRowLines = props.numLines;
  const spacing = 100 / numRowLines;

  const position = (
    i: any,
    isRow: any,
    width: any,
    height: any,
    spacing: number,
  ) => {
    const newSpacing = isRow ? spacing : (height / width) * spacing;
    const fixedPos = props.offset + newSpacing * i;
    const floatingPos = 100 * (props.random ? Math.random() : 0);
    return { fixedPos, floatingPos };
  };

  const configuration = (
    i: number,
    isRow: boolean,
    width: number,
    height: number,
  ) => {
    const pos_conf = position(i, isRow, width, height, spacing);
    const time_conf = timing(props.avgDuration, props.avgDelay, props.random);
    return { ...pos_conf, ...time_conf, isDot: true };
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const rconfigs: any = {};
    const cconfigs: any = {};
    const nrlines = props.numLines;
    const nclines = Math.floor((width / height) * props.numLines) + 1;
    let gridEnterTimeout = 0;
    for (let i = 1; i <= nrlines; ++i) {
      rconfigs[i] = configuration(i, true, width, height);
      gridEnterTimeout = Math.max(
        gridEnterTimeout,
        rconfigs[i].duration + rconfigs[i].delay,
      );
    }
    for (let i = 1; i <= nclines; ++i) {
      cconfigs[i] = configuration(i, false, width, height);
      gridEnterTimeout = Math.max(
        gridEnterTimeout,
        cconfigs[i].duration + cconfigs[i].delay,
      );
    }

    setNumColLines(nclines);
    setRowConfigs(rconfigs);
    setColConfigs(cconfigs);
    setWidth(width);
    setHeight(height);

    setTimeout(() => props.setTriggerNameEnter(true), gridEnterTimeout + 500);
    setTimeout(() => props.setTriggerGridExit(true), gridEnterTimeout + 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {width !== 0 && height !== 0 && (
        <div className="absolute left-0 top-0 z-[1] h-screen w-screen overflow-hidden">
          {[...Array(numRowLines)].map((_, i) => (
            <Gridline
              key={i}
              isRow
              width={width}
              height={height}
              // We can assert this as non null because of the
              // width and height guard above
              {...(
                rowConfigs as {
                  isDot: boolean;
                  duration: number;
                  delay: number;
                  fixedPos: any;
                  floatingPos: number;
                }[]
              )[i + 1]}
            />
          ))}
          {[...Array(numColLines)].map((_, i) => (
            <Gridline
              key={i + props.numLines}
              isRow={false}
              width={width}
              height={height}
              {...(
                colConfigs as {
                  isDot: boolean;
                  duration: number;
                  delay: number;
                  fixedPos: any;
                  floatingPos: number;
                }[]
              )[i + 1]}
            />
          ))}
        </div>
      )}
    </>
  );
}
