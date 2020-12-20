const genId = (function () {
  let i = 0;
  return function () {
    return i++;
  };
})();

const defaultFormValue = (setter, messageSetter = () => {}) => (e) => {
  e.target.setCustomValidity("");
  messageSetter("");
  setter(e.target.value);
};

function resizeTextareaToFitContent(element) {
  const scrolltop = element.scrolltop;
  element.style.height = "";
  element.style.height = element.scrollHeight + "px";
  element.scrolltop = scrolltop;
}

const moveScroll = (element, initialMousePosition) => {
  let scrollPosition = {
    // The current scroll
    left: element.scrollLeft,
    top: element.scrollTop,
  };
  return (event) => {
    // How far the mouse has been moved
    const dx = event.clientX - initialMousePosition.x;
    const dy = event.clientY - initialMousePosition.y;

    // Scroll the element
    element.scrollTop = scrollPosition.top - dy;
    element.scrollLeft = scrollPosition.left - dx;
    element.style.cursor = "grabbing";
    element.style.userSelect = "none";
  };
};

const releaseScroll = (event, element) => {
  element.style.removeProperty("cursor");
  element.style.removeProperty("user-select");
};

const mouseUpHandler = (element, moveHandler, afterRelease) => (event) => {
  document.removeEventListener("mousemove", moveHandler);
  afterRelease(event, element);
};

const mouseDrag = (buttonNumber, selector, onMove, afterRelease = () => {}) => (event) => {
  if (event.button === buttonNumber) {
    const initialMousePosition = {
      // Get the current mouse position
      x: event.clientX,
      y: event.clientY,
    };

    const element = document.querySelector(selector);

    const moveHandler = onMove(element, initialMousePosition);
    const upHandler = mouseUpHandler(element, moveHandler, afterRelease);

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler, { once: true });

    event.stopPropagation();
    event.preventDefault();
    event.cancelBubble = false;
    return false;
  }
};

module.exports = {
  mouseDrag: mouseDrag,
  moveScroll: { onMove: moveScroll, afterRelease: releaseScroll },
  genId: genId,
  defaultFormValue,
  resizeTextareaToFitContent,
};
