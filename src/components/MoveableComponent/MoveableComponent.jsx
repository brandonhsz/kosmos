import React, { useState, useEffect, useRef } from "react";
import Moveable from "react-moveable";
import ImageComponent from "../ImageComponent/ImageComponent";
import DeleteButton from "../DeleteButton/DeleteButton";
import { useFetch } from "../../hooks"
import { photoAdapter } from "../../adapters"

const Component = ({
    updateMoveable,
    top,
    left,
    width,
    height,
    index,
    color,
    id,
    setSelected,
    isSelected = false,
    updateEnd,
    parentRef,
    indexComponent,
    removeMoveable
}) => {
    const [nodoReferencia, setNodoReferencia] = useState({
        top,
        left,
        width,
        height,
        index,
        color,
        id,
    });
    const [photo, setPhoto] = useState({})
    const [guideLinesX, setGuideLinesX] = useState([])
    const [guideLinesY, setGuideLinesY] = useState([])
    const { callEndpoint, loading } = useFetch()

    const ref = useRef(null)
    const moveableRef = useRef(null)
    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();
    useEffect(() => {
        handleRender();

    }, []);

    const handleRender = async () => {
        const photoResponse = await callEndpoint(`https://jsonplaceholder.typicode.com/photos/${indexComponent}`)
        setPhoto(photoAdapter(photoResponse))
    };

    /**
     * Event handler for element dragging.
     * @param {object} e - Drag event object.
     * @property {number} e.clientX - X-coordinate of the drag event.
     * @property {number} e.clientY - Y-coordinate of the drag event.
     * @description Handles the dragging of the element, updates guide lines, selection, and calls the updateMoveable function.
     */
    const onDrag = (e) => {
        setGuideLinesX((prevGuideLinesX) => [...prevGuideLinesX, e.clientX]);
        setGuideLinesY((prevGuideLinesY) => [...prevGuideLinesY, e.clientY]);
        setSelected(id);
        updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            color,
        });
    };


    /**
     * Event handler for the end of element dragging.
     * @description Handles the end of element dragging, updates the selection and the nodoReferencia state.
     */
    const onDragEnd = () => {
        setSelected(false);
        setNodoReferencia({
            top,
            left,
            width,
            height,
            index,
            color,
            id,
        });
    };


    /**
     * Event handler for resizing the element.
     * @param {Object} e - The resize event object.
     * @param {number} e.width - The new width of the element.
     * @param {number} e.height - The new height of the element.
     * @param {Object} e.drag - The drag information during resizing.
     * @param {Array} e.drag.beforeTranslate - The translation values before the resize.
     * @description Handles the resizing of the element, updating its dimensions, the reference node, and the moveable.
     */
    const onResize = async (e) => {
        // Update width and height
        let newWidth = e.width;
        let newHeight = e.height;

        const positionMaxTop = top + newHeight;
        const positionMaxLeft = left + newWidth;

        // Ensure the element doesn't exceed parent bounds
        if (positionMaxTop > parentBounds?.height)
            newHeight = parentBounds?.height - top;
        if (positionMaxLeft > parentBounds?.width)
            newWidth = parentBounds?.width - left;

        // Update the moveable with new dimensions
        updateMoveable(id, {
            top,
            left,
            width: newWidth,
            height: newHeight,
            color,
        });

        // Update reference node
        const beforeTranslate = e.drag.beforeTranslate;

        ref.current.style.width = `${e.width}px`;
        ref.current.style.height = `${e.height}px`;

        let translateX = beforeTranslate[0];
        let translateY = beforeTranslate[1];

        ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

        setNodoReferencia({
            ...nodoReferencia,
            translateX,
            translateY,
            top: top + translateY < 0 ? 0 : top + translateY,
            left: left + translateX < 0 ? 0 : left + translateX,
        });
    };



    /**
     * Event handler for the end of the resizing process.
     * @param {Object} e - The resize event object.
     * @param {Object} e.lastEvent - The last event information during resizing.
     * @param {number} e.lastEvent.width - The final width of the element.
     * @param {number} e.lastEvent.height - The final height of the element.
     * @description Handles the end of the resizing process, updating the element's dimensions, the moveable, and the reference node.
     */
    const onResizeEnd = async (e) => {
        let newWidth = e.lastEvent?.width;
        let newHeight = e.lastEvent?.height;

        const positionMaxTop = top + newHeight;
        const positionMaxLeft = left + newWidth;

        // Ensure the element doesn't exceed parent bounds
        if (positionMaxTop > parentBounds?.height)
            newHeight = parentBounds?.height - top;
        if (positionMaxLeft > parentBounds?.width)
            newWidth = parentBounds?.width - left;
        const absoluteTop = top;
        const absoluteLeft = left;

        updateMoveable(
            id,
            {
                top: absoluteTop,
                left: absoluteLeft,
                width: newWidth,
                height: newHeight,
                color,
            },
            true
        );

        setNodoReferencia({
            top,
            left,
            width,
            height,
            index,
            color,
            id,
        });
    };



    return (
        <>

            <div
                ref={ref}
                className="draggable"
                id={"component-" + id}
                style={{
                    position: "absolute",
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    background: color,
                }}
                onClick={() => setSelected(id)}
            >
                {
                    loading ? <p>Loading...</p> :
                        (
                            <>
                                <ImageComponent img={photo.url} alt={photo.title} />
                                <DeleteButton removeMoveable={removeMoveable} id={id} />
                            </>
                        )
                }
            </div>

            <Moveable
                ref={moveableRef}
                target={ref.current}
                resizable
                draggable
                onResize={onResize}
                onResizeEnd={onResizeEnd}
                keepRatio={false}
                throttleResize={1}
                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                edge={false}
                zoom={1}
                origin={false}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
                snappable={true}
                verticalGuidelines={guideLinesY}
                horizontalGuidelines={guideLinesX}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
            />
        </>
    );
};

export default Component;