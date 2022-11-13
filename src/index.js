import React, {render} from './react'
const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello Fiber</p>
    <p>Hello Parent</p>
  </div>
)

render(jsx, root)