// Adapted from Magic UI's Shine Border (MIT), https://magicui.design/r/shine-border.json
// Plain CSS replaces Tailwind utilities so this works in Create React App.
import React from "react";

export function ShineBorder({ borderWidth = 1, duration = 14, shineColor = "#8b5cf6" }) {
  return <div aria-hidden="true" className="rp-shine-border" style={{
    "--rp-shine-duration": `${duration}s`,
    backgroundImage: `radial-gradient(transparent,transparent,${Array.isArray(shineColor) ? shineColor.join(",") : shineColor},transparent,transparent)`,
    backgroundSize: "300% 300%",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    padding: `${borderWidth}px`,
  }} />;
}
