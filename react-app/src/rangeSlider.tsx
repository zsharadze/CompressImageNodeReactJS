import { memo, useState, useEffect } from "react";

//destructive props
const RangeSlider = ({ classes, onChange, value, ...sliderProps }) => {
  //set initial value to 0 this will change inside useEffect in first render also| or you can directly set useState(value)
  const [sliderVal, setSliderVal] = useState(0);

  // keep mouse state to determine whether i should call parent onChange or not.
  // so basically after dragging the slider and then release the mouse then we will call the parent onChange, otherwise parent function will get call each and every change
  const [mouseState, setMouseState] = useState("");

  useEffect(() => {
    setSliderVal(value); // set new value when value gets changed, even when first render
  }, [value]);

  const changeCallback = (e) => {
    setSliderVal(e.target.value); // update local state of the value when changing
  };

  useEffect(() => {
    if (mouseState === "up") {
      onChange(sliderVal); // when mouse is up then call the parent onChange
    }
  }, [mouseState]);

  function handleSetSliderVal(e) {
    let val = Number(e.target.value);
    if (val < sliderProps.min) {
      setSliderVal(sliderProps.min);
    } else if (val > sliderProps.max) {
      setSliderVal(sliderProps.max);
    } else {
      setSliderVal(val);
    }
  }

  return (
    <>
      <span style={{ verticalAlign: "bottom" }}>
        <input
          type="range"
          value={sliderVal}
          {...sliderProps}
          className={`slider ${classes}`}
          onChange={changeCallback}
          onMouseDown={() => setMouseState("down")} // When mouse down set the mouseState to 'down'
          onMouseUp={() => setMouseState("up")} // When mouse down set the mouseState to 'up' | now we can call the parent onChnage
        />
      </span>
      <span>
        {" "}
        <input
          type="number"
          min="0"
          max="100"
          className="form-control"
          required
          value={sliderVal}
          style={{ marginLeft: "5px", width: "55px", display: "inline-block" }}
          onChange={(e) => handleSetSliderVal(e)}
        />
      </span>
    </>
  );
};

export default memo(RangeSlider);
