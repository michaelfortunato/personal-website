import { useState } from "react";
import Description from "@/components/Description";
import Name from "@/components/Name";

export default function Hero(props: { triggerNameEnter: boolean }) {
  const [nameEntered, setNameEntered] = useState(false);

  return (
    <div className="flex h-[90vh] items-center justify-center overflow-hidden">
      <div>
        <div className="relative top-[16%]">
          <Name
            firstName="Michael"
            lastName="Fortunato"
            startAnimation={props.triggerNameEnter}
            onAnimationFinish={setNameEntered}
          />
          {nameEntered ? <Description /> : null}
        </div>
      </div>
    </div>
  );
}
