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
    return <div><h1>{this.props.title}</h1>class component</div>
  }
}

// render(<Greeting title="title"></Greeting>, root)

function FunctionComponent(props) {
  return <div><h1>{props.title}</h1>function component</div>
}

render(<FunctionComponent title={'title'}/>, root)