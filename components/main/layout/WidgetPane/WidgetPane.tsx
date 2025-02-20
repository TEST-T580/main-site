import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { WidgetContext } from "../layout";
import styles from "./WidgetPane.module.scss";

export const WidgetPane: React.FC = () => {
  const followThreshold = 20;
  const closeThreshold = 140;
  const [initialY, setInitialY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [widgetOpen, setWidgetOpen] = useContext(WidgetContext);
  const Widget = dynamic<{}>(
    () => import("../../widget/components/Widget").then((mod) => mod.Widget),
    {
      ssr: false,
    },
  );

  // On initial load, have no animation
  // Then reset on render
  // This is to prevent jancky initial page load where the pane flies over the screen
  const [paneStyle, setPaneStyle] = useState<any>({ transition: "none" });
  useEffect(() => setPaneStyle({}), []);

  const delta = currentY - initialY;

  if (widgetOpen && dragging)
    setPaneStyle({
      transform: `translateY(${Math.max(delta - followThreshold, 0)}px)`,
      transition: "none",
    });

  return (
    <div
      className={`${styles.widgetPane} ${widgetOpen ? styles.widgetPaneOpen : null}`}
      style={paneStyle}
    >
      <div
        className={styles.widgetPaneHeader}
        onTouchStart={(e) => {
          setInitialY(e.touches[0].clientY);
          setCurrentY(e.touches[0].clientY);
          setDragging(true);
        }}
        onTouchMove={(e) => {
          setCurrentY(e.touches[0].clientY);
          return false;
        }}
        onTouchEnd={(e) => {
          setDragging(false);
          if (delta > closeThreshold) {
            setWidgetOpen(false);
          }
          setInitialY(0);
          setCurrentY(0);
        }}
      ></div>
      <div className={styles.widgetPaneContent}>
        <Widget />
      </div>
    </div>
  );
};
