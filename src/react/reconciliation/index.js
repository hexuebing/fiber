import { TaskQueue, formatArray, createStateNode } from '../Misc'

const taskQueue = new TaskQueue()
let subTask = null

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
      tag: "host_component",
      effects: [],
      effects: "placement",
      stateNode: null
    }

    newFiber.stateNode = createStateNode(newFiber)

    if(index === 0){
      // 第一个节点作为父节点的child
      fiber.child = newFiber
    }else{
      // 当前节点作为上一个兄弟节点的 sibling
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber // 为兄弟节点的上一个节点赋值当前节点
    index++
  }
}

const executeTask = (fiber) => {
  reconcileChildren(fiber, fiber.props.children)
  console.log(fiber)
}

const performTask = (deadline) => {
  if(!subTask) {
    // 任务为空去获取任务列表的第一个任务
    subTask = getFirstTask()
    console.log(subTask)
  }
  while (subTask && deadline.timeRemaining() > 1){
    // 执行任务
    subTask = executeTask(subTask)
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