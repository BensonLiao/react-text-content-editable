/* eslint-disable react/boolean-prop-naming */
import React, {createRef, useState} from 'react';
import PropTypes from 'prop-types';
import {isStyledComponent} from 'styled-components';
import {Wrapper, RootWrapper, InputContainer, InputWrapper} from './style';

const getCaretPosition = editableDiv => {
  let caretPos = 0;
  let sel;
  let range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode === editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() === editableDiv) {
      const tempEl = document.createElement('span');
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      const tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint('EndToEnd', range);
      caretPos = tempRange.text.length;
    }
  }

  return caretPos;
};

const placeCaretAtPos = (el, pos = 0) => {
  el.focus();
  let sel;
  if (window.getSelection) {
    sel = window.getSelection();
    const textNode = sel.focusNode.firstChild || sel.focusNode;
    sel.collapse(textNode, Math.min(textNode.length, pos));
  } else if (document.getSelection) {
    sel = document.getSelection();
    // IE <= 8
    if (sel.type !== 'Control') {
      const range = sel.createRange();
      range.move('character', pos);
      range.select();
    }
  }
};

const imeInputDisableHandler = event => {
  const sel = window.getSelection();
  // Remember the selection status before calling removeAllRanges
  const textNode = sel.focusNode;
  const caretPos = sel.focusOffset;
  if (sel.type !== 'Range') {
    event.preventDefault();
    sel.removeAllRanges();
    setTimeout(() => {
      sel.collapse(textNode || event.target, caretPos);
    }, 20);
  }
};

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
  const [borderBottom, setBorderBottom] = useState('2px solid white');
  const [inputWidth, setInputWidth] = useState(width);
  const [InputHeight, setInputHeight] = useState(height);
  const [isOnFocus, setOnFocus] = useState(false);

  const onFocus = () => {
    setOnFocus(true);
    if (!readOnly) {
      setInputWidth(width);
      setInputHeight(height);
      setBorderBottom('2px solid #1DA1F1');
    }

    if (value >= maxLength) {
      inputRef.current.addEventListener('compositionstart', imeInputDisableHandler);
    }
  };

  const onBlur = () => {
    setOnFocus(false);
    setBorderBottom('none');
    setInputHeight('auto');
    setInputWidth('auto');
    inputRef.current.removeEventListener('compositionstart', imeInputDisableHandler);
  };

  const onInput = e => {
    // Make event persistent to access previous property without being nullified
    e.persist();
    const selection = window.getSelection && window.getSelection();
    let caretPos = getCaretPosition(inputRef.current);
    const rem = Number(maxLength) - inputRef.current.innerText.length;
    if (rem < 0 && selection.type !== 'Range') {
      inputRef.current.innerText = value;
      caretPos = caretPos <= 1 ? caretPos : caretPos - 1;
      inputRef.current.addEventListener('compositionstart', imeInputDisableHandler);
    } else if (!e.nativeEvent.isComposing) {
      const {textContent} = e.currentTarget;
      inputRef.current.innerText = textContent;
      inputRef.current.removeEventListener('compositionstart', imeInputDisableHandler);
    }

    placeCaretAtPos(inputRef.current, caretPos);
    onChange(inputRef.current.innerText);
  };

  const onPaste = e => {
    const selection = window.getSelection && window.getSelection();
    let caretPos = getCaretPosition(inputRef.current);
    const {textContent} = e.currentTarget;
    const pastedText = e.clipboardData.getData('text/plain') || '';
    // If anchorOffset is greater than focusOffset that means user are select from right to left
    const selectionStart = selection.anchorOffset < selection.focusOffset ?
      selection.anchorOffset : selection.focusOffset;
    const selectionEnd = selection.anchorOffset < selection.focusOffset ?
      selection.focusOffset : selection.anchorOffset;
    const newContent = textContent.substring(0, selectionStart || 0) +
      pastedText +
      textContent.substring(selectionEnd || 0);
    const rem = Number(maxLength) - newContent.length;
    if (rem <= 0) {
      e.preventDefault();
      if (selection.type === 'Range') {
        const mData = textContent.substring(0, selectionStart || 0) +
          pastedText.slice(0, selectionEnd - selectionStart) +
          textContent.substring(selectionEnd || 0);
        inputRef.current.innerText = mData;
      } else {
        const availableSpace = Number(maxLength) - textContent.length;
        const mData = textContent.substring(0, selectionStart || 0) +
          pastedText.slice(0, availableSpace) +
          textContent.substring(selectionEnd || 0);
        inputRef.current.innerText = mData;
        caretPos += availableSpace;
      }

      onChange(inputRef.current.innerText);
      placeCaretAtPos(inputRef.current, caretPos);
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
              ref={inputRef}
              className={type}
              contentEditable={!readOnly}
              style={{
                height: InputHeight === 'auto' ? 'auto' : `${InputHeight}px`,
                border: borderBottom,
                minWidth: minWidth
              }}
              dangerouslySetInnerHTML={{__html: data.replace(/\n/g, '<br/>')}}
              onFocus={onFocus}
              onBlur={onBlur}
              onInput={onInput}
              onPaste={onPaste}
            />
          </InputWrapper>
        </InputContainer>
      </RootWrapper>
    </MainWrapper>
  );
};

Editable.defaultProps = {
  type: 'text',
  value: '',
  width: 'auto',
  height: 'auto',
  minWidth: 'auto',
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
