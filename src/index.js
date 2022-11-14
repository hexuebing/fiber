import React, { render, Component } from './react'
const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello Fiber</p>
    <p>Hello Parent</p>
  </div>
)

// render(jsx, root)

class Greeting extends Component {
  constructor(props){
    super(props)
  }
  render(){
    return <div>class component</div>
  }
}

render(<Greeting></Greeting>, root)