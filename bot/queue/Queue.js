class Queue {
  constructor(){
    this._queue = [];
  }
  
  add(entry){
    this._queue.push(entry);
  }
  
  next(){
    return this._queue.shift();
  }
  
  clear(){
    this._queue = [];
  }
  
  isEmpty(){
    return this._queue.length === 0;
  }
  
  asArray(){
    return Array.from(this._queue); // create a copy
  }
  
  get length(){
    return this._queue.length;
  }
}

module.exports = Queue;