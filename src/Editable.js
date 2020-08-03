import React, { createRef, useState } from "react";
import PropTypes from "prop-types";
import { isStyledComponent } from 'styled-components';
import { Wrapper, RootWrapper, InputContainer, InputWrapper } from "./style";
const Editable = ({
  type,
  onChange,
  value,
  tag,
  maxLength,
  height,
  width,
  minWidth,
  readOnly,
  ellipseOnBlur,
  innerRef,
  customWrapper
}) => {
  const inputRef = innerRef || createRef();
  const [data] = useState(value);
  const [borderBottom, setBorderBottom] = useState("2px solid white");
  const [inputWidth, setInputWidth] = useState(width);
  const [InputHeight, setInputHeight] = useState(height);
  const [isOnFocus, setOnFocus] = useState(false);
  const placeCaretAtEnd = el => {
    el.focus();
    if (window.getSelection && document.createRange) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.body && document.body.createTextRange) {
      const textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  };
  const onFocus = () => {
    setOnFocus(true);
    if (!readOnly) {
      setInputWidth(width);
      setInputHeight(height);
      setBorderBottom("2px solid #1DA1F1");
    }
  };

  const onBlur = () => {
    setOnFocus(false);
    setBorderBottom("none");
    setInputHeight("auto");
    setInputWidth("auto");
  };
  const onInput = e => {
    const { textContent } = e.currentTarget;
    const rem = +maxLength - inputRef.current.innerText.length;
    if (rem <= 0) {
      const slicedText = textContent.slice(0, +maxLength);
      inputRef.current.innerText = slicedText;
      placeCaretAtEnd(inputRef.current);
      onChange(slicedText);
    } else {
      onChange(textContent);
    }
  };
  const onPaste = e => {
    const selection = window.getSelection && window.getSelection();
    const {textContent} = e.currentTarget;
    const pastedText = e.clipboardData.getData('text/plain');
    const newContent = textContent.substring(0, selection.anchorOffset) +
      pastedText +
      textContent.substring(selection.focusOffset);
    const rem = +maxLength - newContent.length;
    if (rem <= 0) {
      e.preventDefault();
      const mData = newContent.slice(0, +maxLength);
      inputRef.current.innerText = mData;
      placeCaretAtEnd(inputRef.current);
    }
  };
  const MainWrapper = customWrapper && isStyledComponent(customWrapper) ? customWrapper : Wrapper;
  const CustomTag = `${tag}`;
  return (
    <MainWrapper width={width} extendStyle={customWrapper && !isStyledComponent(customWrapper) && customWrapper.props.style}>
      <RootWrapper>
        <InputContainer width={width}>
          <InputWrapper width={inputWidth} readOnly={readOnly} isOnFocus={isOnFocus} ellipseOnBlur={ellipseOnBlur}>
            <CustomTag
              className={type}
              ref={inputRef}
              contentEditable={!readOnly}
              onFocus={onFocus}
              onBlur={onBlur}
              onInput={onInput}
              onPaste={onPaste}
              style={{
                height: InputHeight === "auto" ? "auto" : `${InputHeight}px`,
                border: borderBottom,
                minWidth: minWidth
              }}
              dangerouslySetInnerHTML={{ __html: data.replace(/\n/g, "<br/>") }}
            />
          </InputWrapper>
        </InputContainer>
      </RootWrapper>
    </MainWrapper>
  );
};

Editable.defaultProps = {
  type: "text",
  value: "",
  width: "auto",
  height: "auto",
  minWidth: "auto",
  readOnly: false,
  ellipseOnBlur: false,
  innerRef: null,
  customWrapper: null
};

Editable.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  tag: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  minWidth: PropTypes.string,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  readOnly: PropTypes.bool,
  ellipseOnBlur: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  customWrapper: PropTypes.oneOfType([PropTypes.object, PropTypes.element])
};

export default Editable;
