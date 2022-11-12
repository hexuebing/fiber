import { TaskQueue } from '../Misc'

const taskQueue = new TaskQueue()

export default function render(element, dom){
  
  taskQueue.push({
    dom,
    props: {
      children: element
    }
  })

  console.log(taskQueue.pop())
}