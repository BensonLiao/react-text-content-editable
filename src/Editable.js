import React, { createRef, useState } from "react";
import PropTypes from "prop-types";
import { isStyledComponent } from 'styled-components';
import { Wrapper, RootWrapper, InputContainer, InputWrapper } from "./style";
const Editable = ({
  onChange,
  type,
  maxLength,
  height,
  width,
  value,
  readOnly,
  tag,
  minWidth,
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
    setBorderBottom("2px solid white");
    setInputHeight("auto");
    setInputWidth("auto");
  };
  const onInput = e => {
    const { textContent } = e.currentTarget;
    const rem = Number(maxLength) - inputRef.current.innerText.length;
    if (rem <= 0) {
      const slicedText = textContent.slice(0, Number(maxLength));
      inputRef.current.innerText = slicedText;
      placeCaretAtEnd(inputRef.current);
      onChange(slicedText);
    } else {
      onChange(textContent);
    }
  };
  const onPaste = e => {
    const rem = Number(maxLength) - inputRef.current.innerText.length;
    const selection = window.getSelection && window.getSelection() || '';
    const isSelectedAll = selection.toString().length === inputRef.current.innerText.length || false;
    if (rem <= 0) {
      e.preventDefault();
      const {textContent} = e.currentTarget;
      const text = e.clipboardData.getData('text/plain');
      const fullText = isSelectedAll ? text : textContent + text;
      const mData = fullText.slice(0, Number(maxLength));
      inputRef.current.innerText = mData;
    }
  };
  const MainWrapper = customWrapper && isStyledComponent(customWrapper) ? customWrapper : Wrapper;
  const CustomTag = `${tag}`;
  return (
    <MainWrapper extendStyle={customWrapper && !isStyledComponent(customWrapper) && customWrapper.props.style}>
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
  width: "auto",
  height: "auto",
  type: "text",
  value: "",
  readOnly: false,
  ellipseOnBlur: false,
  innerRef: null,
  customWrapper: null
};

Editable.propTypes = {
  value: PropTypes.string,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  ellipseOnBlur: PropTypes.bool,
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  customWrapper: PropTypes.oneOfType([PropTypes.object, PropTypes.element])
};

export default Editable;
