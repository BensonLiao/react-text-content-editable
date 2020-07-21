import styled from "styled-components";

export const Wrapper = styled.div.attrs(({extendStyle}) => ({
  style: extendStyle
}))`
  display: flex;
  width: ${({width}) => width};
  flex: 1 1 auto;
`;

export const RootWrapper = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  max-width: 100%;
  flex: 0 1 auto;
`;

export const InputContainer = styled.div`
  width: ${({width}) => width};
  text-align: left;
  outline: none;
`;
export const InputWrapper = styled.div`
  width: ${({width}) => width};
  * {
    outline: none;
  }
  .text {
    ${({isOnFocus, ellipseOnBlur}) => isOnFocus ?
    '' :
    ellipseOnBlur && (`overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;`)}
    background-color: transparent;
    width: ${({width}) => width};
    text-align: left;
    transition: border-color 0.2s ease-in-out 0s;
    border: ${({readOnly}) => readOnly ? "2px solid white" : "2px solid black"};
    border-radius: 3px;
    margin-bottom: 0px
  }
  .textarea {
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  ::-webkit-scrollbar-thumb {
    width: 0;
  }
  ::-webkit-scrollbar-track {
    width: 0;
  }
  ::-webkit-scrollbar-thumb:horizontal {
    width: 0;
  }
`;
