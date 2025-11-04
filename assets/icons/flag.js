import * as React from "react"
import Svg, { G, Path, Rect } from "react-native-svg"
const FlagSvgImage = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={512}
    viewBox="0 0 135.467 135.467"
    {...props}
  >
    <G transform="translate(-27.107)">
      <Path
        d="M55.254 36.416c0 4.741-54.55 36.236-58.657 33.866-4.106-2.37-4.106-65.361 0-67.732C.703.18 55.254 31.675 55.254 36.416"
        style={{
          fill: "red",
          strokeWidth: 0.264583,
        }}
        transform="matrix(1 0 0 .64468 73.782 15.473)"
      />
      <Rect
        width={14.178}
        height={112.109}
        x={60.644}
        y={11.679}
        rx={5}
        style={{
          fill: "#000",
          strokeWidth: 0.235277,
        }}
      />
    </G>
  </Svg>
)
export default FlagSvgImage
