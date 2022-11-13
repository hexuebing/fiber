import {createDOMElement} from '../../DOM'

export default function createStateNode(fiber){
  if(fiber.tag === "host_component"){
    return createDOMElement(fiber)
  }
}