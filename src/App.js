import React, { useState, useRef } from "react";
import Component from "./components/MoveableComponent/MoveableComponent.jsx";
import ButtonAddMoveable from "./components/ButtonAddMoveable/ButtonAddMoveable.js";
const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const parentRef = useRef(null);
  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const removeMoveable = (id) => {
    const updatedMoveables = moveableComponents.filter(
      (moveable) => moveable.id !== id
    );
    setMoveableComponents(updatedMoveables);
  };

  return (
    <main style={{ height : "100vh", width: "100vw" }}>
      <ButtonAddMoveable addMoveable={addMoveable} />
      <div
        id="parent"
        ref={parentRef}
        style={{
          position: "relative",
          background: "black",
          height: "90vh",
          width: "90vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            indexComponent={index + 1}
            parentRef={parentRef}
            updateMoveable={updateMoveable}
            setSelected={setSelected}
            isSelected={selected === item.id}
            removeMoveable={removeMoveable}
          />
        ))}
      </div>
    </main>
  );
};

export default App;


