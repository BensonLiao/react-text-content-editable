# react-content-editable [![npm](https://img.shields.io/npm/v/@benson.liao/react-content-editable?color=green)](https://www.npmjs.com/package/@benson.liao/react-content-editable)

A Component for making text editable with input like features (e.g. max length)

## Installation


```
npm i @benson.liao/react-content-editable
```

## Demo

<a href="https://70ff5.csb.app/" target="_blank">demo link</a><br/>
[![Edit blog](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-content-editable-70ff5)

## Usage


```js
const React = require('react');
const {useState} = require('react');
const ContentEditable = require('@benson.liao/react-content-editable').default;

const App = () => {
  const [text, setText] = useState('')

  const onChange = (value) => {
    setText(value)
  }

  return (
    <ContentEditable 
      tag='p'
      maxLength='20'
      onChange={onChange}
      value={text}
    />
  )
}
```

```js
# es6
import React, { useState } from 'react'
import ContentEditable from "@benson.liao/react-content-editable";

const App = () => {
  const [text, setText] = useState('')

  const onChange = (value) => {
    setText(value)
  }

  return (
    <ContentEditable 
      tag='p'
      maxLength='20'
      onChange={onChange}
      value={text}
    />
  )
}
```

### Editable Text
```js
<Editable
  tag="p"
  maxLength='20'
  onChange={onChange}
  value={data}
/>
```


### Editable Text Read only
```js
<Editable
  readOnly
  tag="h1"
  maxLength='20'
  onChange={onChange}
/>
```



## Contributing
We would love some contributions! Check out <a href="https://github.com/pkumar98/react-text-content-editable">this document</a> to get started.

## Todo
Improve onPaste handler

