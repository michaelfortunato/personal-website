import { useEffect, useMemo, useState } from "react";
import Letter from "./Letter";
import { LayoutGroup } from "framer-motion";

function buildConfigs(name: string) {
  return name.split("").map((char) => configSetup(char));
}
function configSetup(char: string) {
  return {
    char: char,
    XOffsetEnter: randomArcPoint(38).x, //((index % 2) == 0) ? 25 : -25;
    YOffsetEnter: randomArcPoint(38).y, // ((index % 2) == 0) ? -75 : 75;
    enterDuration: 450,
    enterDelay: 3500,
  };
}

function randomArcPoint(radius: number) {
  const theta = 2 * Math.random() * Math.PI;
  return { x: radius * Math.cos(theta), y: radius * Math.cos(theta) };
}

interface NameProps {
  firstName: string;
  lastName: string;
  startAnimation: boolean;
  onAnimationFinish: (status: boolean) => void;
}

export default function Name(props: NameProps) {
  const firstNameConfigs = useMemo(
    () => buildConfigs(props.firstName),
    [props.firstName],
  );
  const lastNameConfigs = useMemo(
    () => buildConfigs(props.lastName),
    [props.lastName],
  );
  const [isClient, setIsClient] = useState(false);
  const { onAnimationFinish } = props;

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      onAnimationFinish(true);
    }, 3950);
  }, [onAnimationFinish]);

  return (
    <>
      {isClient && (
        <div className="relative flex justify-center overflow-visible pt-[2%] text-center text-[56px] text-[#264653]">
          <div className="flex gap-6">
            <div className="inline-block">
              <LayoutGroup>
                {props.firstName.split("").map((_, index) => (
                  <Letter
                    key={index}
                    triggerNameEnter={props.startAnimation}
                    {...(firstNameConfigs[index] as any)}
                  />
                ))}
              </LayoutGroup>
            </div>
            <div className="inline-block">
              <LayoutGroup>
                {props.lastName.split("").map((_, index) => (
                  <Letter
                    key={index + 7}
                    triggerNameEnter={props.startAnimation}
                    {...(lastNameConfigs[index] as any)}
                  />
                ))}
              </LayoutGroup>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
