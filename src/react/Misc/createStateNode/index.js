import {createDOMElement} from '../../DOM'
import {createReactInstance} from '../createReactInstance'

export default function createStateNode(fiber){
  if(fiber.tag === "host_component"){
    return createDOMElement(fiber)
  }else{
    return createReactInstance(fiber)
  }
}