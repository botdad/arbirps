import React from 'react'
import ReactDOM from 'react-dom'
// import * as g from './_types/global'
import './index.css'
import App from './App'

global.Buffer = global.Buffer || require('buffer').Buffer

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
