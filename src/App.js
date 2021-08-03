import React, { Fragment } from "react";
import { Stage, Layer, Circle, Rect, Transformer } from "react-konva";

const Shape = ({ shapeProps, isSelected, onSelect, onChange,rectangles, widthValue }) => {
  //konva functionality
  const shapeRef = React.useRef();
  const trRef = React.useRef();



  React.useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, shapeProps]);
  

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const initialRectangle = [
  //initial rectangle with height and width of 100
  {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    fill: "blue",
    id: "rect1"
  },
];

  

const App = () => {
  //set states
  const [heightValue,setHeightValue] = React.useState("");
  const [widthValue, setWidthValue] = React.useState("");
  const [rectangles, setRectangles] = React.useState(initialRectangle);
  const [selectedId, selectShape] = React.useState("rect1");
  const [widthError, setwidthError] = React.useState(false);
  const [heightError,setheightError] = React.useState(false);




  const handleSubmitWidth = (e) => {
    //prevent autorefresh
    e.preventDefault();

    if(!isNaN(parseFloat(widthValue))) {
      setwidthError(false);
      const rects = rectangles;
      rects[0]["width"] = parseFloat(widthValue);
      setRectangles(rects);
     
     
    } else {
      //user input was not a number. show error
      setwidthError(true)
    }
 
  }

  const handleSubmitHeight = (e) => {
    //prevent autorefresh
    e.preventDefault();
    if (!isNaN(parseFloat(heightValue))){
      setheightError(false);
      const rects = rectangles;
      rects[0]["height"] = parseFloat(heightValue);
      setRectangles(rects);
  } else {
    //user input was not a number. show error
    setheightError(true);
  }
}

  return (
  //design page
  <Fragment>
    {/* ask for user input */}
    <form  onSubmit={handleSubmitWidth}>
        <label>
          Input width dimension here:
          <input type="text" value={widthValue}  onChange={input => {
    setWidthValue(input.target.value);
  }} 
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {(widthError===true) ? <p>Please enter a numeric value!</p> : <p></p>}

      {/* ask for user input */}
      <form  onSubmit={handleSubmitHeight}>
        <label>
          Input height dimension here:
          <input type="text" value={heightValue}  onChange={input => {
          setHeightValue(input.target.value);
        }} 
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {(heightError===true) ? <p>Please enter a numeric value!</p> : <p></p>}

    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={e => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          selectShape("rect1");
        }
      }}
    >

      <Layer>
              {/* draw the rectangle */}
              <Shape
              key={0}
              shapeProps={rectangles[0]}
              isSelected={rectangles[0].id === selectedId}
              onSelect={() => {
                selectShape(rectangles[0].id);
              }}
              
              onChange={newAttrs => {
                const rects = rectangles.slice();
                rects[0] = newAttrs;
                setRectangles(rects);
              }}
          
            />  
      </Layer>
    </Stage>
  </Fragment>
    
  );
};

export default App;




