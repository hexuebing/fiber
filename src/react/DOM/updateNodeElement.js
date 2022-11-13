/**
 * 
 * @param {*} newElement DOM对象
 * @param {*} virtualDOM 虚拟dom对象
 * @param {*} oldVirtualDOM 老的虚拟对象
 */
 export default function updateNodeElement(newElement, virtualDOM, oldVirtualDOM = {}){
  // 获取对象对应的属性
  const newProps = virtualDOM.props || {}
  const oldProps = oldVirtualDOM.props || {}
  // 遍历新的属性
  for (const propsName in newProps) {
    const newPropsValue = newProps[propsName];
    const oldPropsValue = oldProps[propsName];
    // 判断不等于老的就更新/添加
    if(newPropsValue !== oldPropsValue){
      if(propsName.startsWith('on')){
        const eventName = propsName.toLowerCase().slice(2)
        newElement.addEventListener(eventName, newPropsValue)
        // 删除原先的事件处理函数
        if(oldPropsValue){
          newElement.removeEventListener(eventName, oldPropsValue)
        }
      }else if(propsName === 'value' || propsName === 'checked'){
        // 单独处理value和checked
        newElement[propsName] = newPropsValue
      }else if(propsName !== 'children'){
        // 剩余非children字段
        newElement.setAttribute(propsName === 'className' ? 'class' : propsName, newPropsValue)
      }
    }
    
  }

  // 遍历久的属性
  for (const propsName in oldProps) {
    const oldPropsValue = oldProps[propsName]
    // 判断属性被删除
    if (!Object.hasOwnProperty.call(newProps, propsName)) {
      if(propsName.startsWith('on')){
        const eventName = propsName.toLowerCase().slice(2)
        newElement.removeEventListener(eventName, oldPropsValue)
      }else if(propsName !== "children"){
        // class需要特殊处理，value和checked未能删除
        newElement.removeAttribute(propsName === 'className' ? 'class' : propsName)
      }
    }
  }
}