export default function createElement (type, props, ...children){
  // console.log(children, [].concat(...children))
  // 接收剩余参数如果是数组，那么直接使用数组将会被包裹一层数组
  const childElement = [].concat(...children).reduce((result, child) => {
    if(child !== true && child !== false && child !== null){
      if(child instanceof Object){
        result.push(child)
      }else{
        // 文本节点专门转化为一个对象
        result.push(createElement('text', { textContent: child}))
      }
    }
    return result
  }, [])
  return {
    type,
    props: Object.assign({}, props, {children: childElement})
  }
}