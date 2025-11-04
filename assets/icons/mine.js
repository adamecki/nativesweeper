import * as React from "react"
import Svg, { Circle, Rect, G } from "react-native-svg"
const MineSvgImage = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={512}
    height={512}
    viewBox="0 0 135.467 135.467"
    {...props}
  >
    <Circle
      cx={67.733}
      cy={67.733}
      r={42.927}
      style={{
        fill: "#000",
        fillRule: "evenodd",
        strokeWidth: 0.191413,
      }}
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
    <Rect
      width={14.178}
      height={112.109}
      x={60.644}
      y={-123.788}
      rx={5}
      style={{
        fill: "#000",
        strokeWidth: 0.235277,
      }}
      transform="rotate(90)"
    />
    <G transform="rotate(-45 67.733 67.733)">
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
      <Rect
        width={14.178}
        height={112.109}
        x={60.644}
        y={-123.788}
        rx={5}
        style={{
          fill: "#000",
          strokeWidth: 0.235277,
        }}
        transform="rotate(90)"
      />
    </G>
  </Svg>
)
export default MineSvgImage
