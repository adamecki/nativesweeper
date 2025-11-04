import * as React from "react"
import Svg, { Text, TSpan } from "react-native-svg"

const fillColor = ["blue", "green", "red", "blue", "green", "red", "blue", "green", "red"];

const NumberIcon = (props, number) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'100%'}
    viewBox="0 0 264.583 264.583"
    {...props}
  >
    <Text
      xmlSpace="preserve"
      x={64.724}
      y={206.408}
      style={{
        fontSize: "203.2px",
        textAlign: "start",
        writingMode: "lr-tb",
        direction: "ltr",
        textAnchor: "start",
        fill: fillColor[number-1],
        strokeWidth: 0.264583,
      }}
    >
      <TSpan
        x={64.724}
        y={206.408}
        style={{
          fontSize: "203.2px",
          strokeWidth: 0.264583,
          fill: fillColor[number-1],
        }}
      >
        {`${number}`}
      </TSpan>
    </Text>
  </Svg>
)
export default NumberIcon
