const Queue = require("./queue/Queue");
const Entry = require("./queue/Entry");
const YTDL = require("ytdl-core");

class Player {
  constructor(guild){
    this._guild = guild;
    this._queue = new Queue();
    this._connection = null;
    this._dispatcher = null;
    this._nowPlaying = null;
  }
  
  destroy(){
    this._guild = null;
    this._queue = null;
    this._connection = null;
    this._dispatcher = null;
    this._nowPlaying = null;
  }
  
  /* Inside Methods */
  
  getQueue(){
    return this._queue;
  }
  
  getDispatcher(){
    return this._dispatcher;
  }
  
  setDispatcher(dispatcher){
    this._dispatcher = dispatcher;
  }
  
  getConnection(){
    return this._connection;
  }
  
  setConnection(conn){
    this._connection = conn;
    this.next();
  }
  
  addToQueue(entry){
    this._queue.add(entry);
  }
  
  getNextOnQueue(){
    return this._queue.next();
  }
  
  getNowPlaying(){
    return this._nowPlaying;
  }
  
  setNowPlaying(playing){
    this._nowPlaying = playing;
  }
  
  play(entry){
    if(!(entry instanceof Entry)) return;
    
    this.setNowPlaying(entry);
    
    let conn;
    if((conn = this.getConnection()) !== null){
      let dispatcher;
      if((dispatcher = this.getDispatcher()) !== null){
        dispatcher.end("NEXT");
      }

      console.log("Now playing: "+entry.getInfo().getTitle());
      this.setDispatcher(conn.playStream(YTDL(entry.getInfo().getUrl(), {filter: "audioonly"})));

      this.getDispatcher().on("end", reason => {
        console.log("Dispatcher was closed due to", reason, "with the queue:", this.getQueue());
        if(!this.getQueue().isEmpty()){
          this.play(this.getNextOnQueue());
        }else{
          this.getConnection().disconnect();
        }
      });
    }else{
      throw new Error("Bot is not connected to voice channel.");
    }
  }
  
  next(){
    return this.play(this.getNextOnQueue());
  }
  
  skip(){
    let dispatcher;
    if((dispatcher = this.getDispatcher()) !== null){
      dispatcher.end("SKIP");
    }
  }
  
  stop(){
    if(this._guild.voiceConnection){
      this._guild.voiceConnection.disconnect();
    }
    this.getQueue().clear();
  }
}

module.exports = Player;