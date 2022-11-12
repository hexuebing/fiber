import { TaskQueue } from '../Misc'

const taskQueue = new TaskQueue()
const subTask = null

const getFirstTask = () => {}

const executeTask = (fiber) => {}

const performTask = (deadline) => {
  if(!subTask) {
    // 任务为空去获取任务列表的第一个任务
    subTask = getFirstTask()
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