import React, { useState } from "react";
import rabbitImg from "../assets/rabbit.svg";
import cheetahImg from "../assets/cheetah.svg";
import tortoiseImg from "../assets/tortoise.svg";
import meterlineimg from "../assets/meterline.svg";
import dotimg from "../assets/dott.svg";

const SPEED_ITEMS = [
  { label: "Slow", img: tortoiseImg },
  { label: "Medium", img: rabbitImg },
  { label: "Fast", img: cheetahImg },
];

const SpeedSelector = ({
  onSelect,
  selected: propSelected,
  horizontal = false,
  floated = true,
}) => {
  const [localSelected, setLocalSelected] = useState("Slow");
  const selected = propSelected !== undefined ? propSelected : localSelected;

  const handleSelect = (value) => {
    if (propSelected === undefined) setLocalSelected(value);
    if (onSelect) onSelect(value);
  };

  const getRotationAndFill = () => {
    switch (selected) {
      case "Slow":
        return { needleRotate: -45, fillRotate: -137 };
      case "Medium":
        return { needleRotate: 0, fillRotate: -90 };
      case "Fast":
        return { needleRotate: 45, fillRotate: 0 };
      default:
        return { needleRotate: -45, fillRotate: -137 };
    }
  };

  const { needleRotate, fillRotate } = getRotationAndFill();

  // All sizing/layout values derived from the orientation flag — single render tree below
  const gaugeW = horizontal ? 52 : 80;
  const gaugeH = horizontal ? 26 : 40;
  const gaugeR = horizontal ? 30 : 40; // border-radius for arc layers
  const innerTop = horizontal ? 8 : 12; // white inner arc top offset
  const innerWGap = horizontal ? 16 : 25; // calc(100% - X) for inner arc width
  const innerHGap = horizontal ? 5 : 8; // calc(100% - X) for inner arc height
  const needleH = horizontal ? 20 : 30;
  const needleW = horizontal ? 3 : 5;
  const dotW = horizontal ? 7 : 10;
  const iconW = horizontal ? 28 : 34;
  const labelSize = horizontal ? "11px" : "16px";
  const gaugeMB = horizontal ? 0 : "20px";
  const itemPad = horizontal ? "6px 10px" : "10px 0";
  const itemMinW = horizontal ? "52px" : undefined;
  const itemBR = horizontal ? "12px" : "16px";
  const iconMB = horizontal ? "3px" : "5px";

  return (
    <div
      style={{
        // horizontal: flows as a row  |  floated vertical: absolute to card  |  inline vertical: normal flow column
        ...(!horizontal && floated
          ? {
              position: "absolute",
              right: "20px",
              top: "59%",
              transform: "translateY(-50%)",
            }
          : {}),
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        alignItems: "center",
        gap: horizontal ? "6px" : undefined,
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        padding: horizontal ? "8px 10px" : "0 5px",
      }}
    >
      {/* Gauge — shared between both orientations, scaled via variables */}
      <div
        style={{
          position: "relative",
          width: `${gaugeW}px`,
          height: `${gaugeH}px`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: gaugeMB,
          flexShrink: 0,
        }}
      >
        {/* White base */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: `${gaugeR}px`,
            borderTopRightRadius: `${gaugeR}px`,
          }}
        />

        {/* Orange fill arc */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "conic-gradient(from -90deg at 50% 100%, orange 0deg, orange 180deg, white 180deg, white 360deg)",
            borderTopLeftRadius: `${gaugeR}px`,
            borderTopRightRadius: `${gaugeR}px`,
            transform: `rotate(${fillRotate}deg)`,
            transformOrigin: "50% 100%",
            transition: "transform 0.4s ease",
            zIndex: 1,
          }}
        />

        {/* Gray track */}
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            borderTopLeftRadius: `${gaugeR}px`,
            borderTopRightRadius: `${gaugeR}px`,
            backgroundColor: "#eeeff1",
          }}
        />

        {/* White inner arc (donut cutout) */}
        <div
          style={{
            position: "absolute",
            top: `${innerTop}px`,
            width: `calc(100% - ${innerWGap}px)`,
            height: `calc(100% - ${innerHGap}px)`,
            borderTopLeftRadius: `${gaugeR}px`,
            borderTopRightRadius: `${gaugeR}px`,
            backgroundColor: "#fff",
            zIndex: 2,
          }}
        />

        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            left: "50%",
            transform: `translateX(-50%) rotate(${needleRotate}deg)`,
            transformOrigin: "bottom center",
            transition: "transform 0.4s ease",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={meterlineimg}
            alt="needle"
            style={{ width: `${needleW}px`, height: `${needleH}px` }}
          />
          <img
            src={dotimg}
            alt="dot"
            style={{ width: `${dotW}px`, marginTop: "-1px" }}
          />
        </div>
      </div>

      {/* Speed options — column on desktop, row on mobile */}
      <div
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          alignItems: "center",
          gap: horizontal ? "4px" : "10px",
          width: horizontal ? undefined : "100%",
        }}
      >
        {SPEED_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => handleSelect(item.label)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: horizontal ? undefined : "100%",
              minWidth: itemMinW,
              textAlign: "center",
              borderRadius: itemBR,
              padding: itemPad,
              background:
                selected === item.label
                  ? "linear-gradient(180deg, #fff3e0, #ffe0b2)"
                  : "transparent",
              transition: "background 0.3s",
            }}
          >
            <img
              src={item.img}
              alt={item.label}
              style={{ width: `${iconW}px`, marginBottom: iconMB }}
            />
            <div
              style={{
                fontSize: labelSize,
                fontWeight: "600",
                color: selected === item.label ? "#333" : "#555",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeedSelector;
