import { TaskQueue, formatArray, createStateNode, getTag } from '../Misc'

const taskQueue = new TaskQueue()
let subTask = null
let pendingCommit = null // 存储root节点的fiber对象

// 拿到effects，去渲染真实的dom对象
const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if(item.effectTag === 'placement'){
      item.parent.stateNode.appendChild(item.stateNode)
    }
  });
}

const getFirstTask = () => {
  const task = taskQueue.pop()
  /**
   * 返回最外层节点的fiber对象
   */
  return {
    props: task.props,
    stateNode: task.dom, // 节点的dom对象 或 组件实例对象
    tag: "host_root", // 节点标记，对类型的分类
    effects: [], // 存储需要更改的fiber对象
    child: null, // 当前fiber对象的 子级 fiber
  }
}

const reconcileChildren = (fiber, children) => {
  const childrenArr = formatArray(children)
  
  let index = 0
  let len = childrenArr.length
  let element = null // 当前子节点
  let newFiber = null
  let prevFiber = null
  
  while(index < len){
    element = childrenArr[index]
    newFiber = {
      type: element.type,
      props: element.props,
      effects: [],
      effectTag: "placement",
      stateNode: null
    }

    newFiber.tag = getTag(element)
    newFiber.stateNode = createStateNode(newFiber)

    if(index === 0){
      // 第一个节点作为父节点的child
      fiber.child = newFiber
    }else{
      // 当前节点作为上一个兄弟节点的 sibling
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber // 为兄弟节点的上一个节点赋值当前节点
    newFiber.parent = fiber // 为每个子节点指定父节点
    index++
  }
}

const executeTask = (fiber) => {
  reconcileChildren(fiber, fiber.props.children)
  /**
   * 如果有子级节点，返回子级节点
   * 将这个子级节点作为父级节点
   */
  if(fiber.child){
    return fiber.child
  }
  
  // // 如果没有子级，看是否有兄弟节点，没有就退回上返回父级，但是下面实现无法退回到父
  // if(fiber.sibling){
  //   return fiber.sibling
  // }

  /**
   * 左侧节点构建完毕，开始构建其他节点
   */
  let curExecuteFiber = fiber
  while(curExecuteFiber.parent){
    curExecuteFiber.parent.effects = curExecuteFiber.parent.effects.concat(
      curExecuteFiber.effects.concat([curExecuteFiber])
    )
    // 查看退回的父级是否有兄弟
    if(curExecuteFiber.sibling){
      return curExecuteFiber.sibling
    }
    // 退回到父级
    curExecuteFiber = curExecuteFiber.parent
  }

  // 执行到这里说明所有的节点都构建fiber对象完毕了
  pendingCommit = curExecuteFiber // root节点的fiber对象
}

const performTask = (deadline) => {
  if(!subTask) {
    // 任务为空去获取任务列表的第一个任务
    subTask = getFirstTask()
  }
  while (subTask && deadline.timeRemaining() > 1){
    // 执行任务
    subTask = executeTask(subTask)
  }

  if(pendingCommit){
    commitAllWork(pendingCommit)
  }

  // 如果任务存在，或者任务队列中还有任务
  if(subTask || !taskQueue.isEmpty()){
    requestIdleCallback(performTask)
  }
}

export default function render(element, dom){
  // 1. 往任务队列中添加任务
  taskQueue.push({
    dom,
    props: {
      children: element
    }
  })

  // 2. 在浏览器空闲时执行任务
  requestIdleCallback(performTask)
}