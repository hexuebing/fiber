import updateNodeElement from "./updateNodeElement"

export default function createDOMElement(virtualDOM){
  let newElement = null
  if(virtualDOM.type === "text"){
    newElement = document.createTextNode(virtualDOM.props.textContent)
  }else{
    // 元素是普通节点
    newElement = document.createElement(virtualDOM.type)
    // 为节点添加属性
    updateNodeElement(newElement, virtualDOM)
  }
  return newElement
}