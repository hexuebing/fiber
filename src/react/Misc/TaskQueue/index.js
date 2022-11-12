export default class TaskQueue {
  constructor(){
    this.taskQueue = []
  }

  push(item){
    this.taskQueue.push(item)
  }

  pop(){
    return this.taskQueue.shift()
  }

  isEmpty(){
    return this.taskQueue.length === 0
  }
}