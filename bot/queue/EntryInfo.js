class EntryInfo {
  constructor(info){
    this.id = info.id || null;
    this.title = info.title || null;
    this.channel = info.channel || null;
    this.thumbnail = info.thumbnail || null;
    this.duration = info.duration || null;
    this.url = info.url || null;
  }
  
  getId(){
    return this.id;
  }
  
  setId(id){
    this.id = id;
    return this;
  }
  
  getTitle(){
    return this.title;
  }
  
  setTitle(title){
    this.title = title;
    return this;
  }
  
  getChannel(){
    return this.channel;
  }
  
  setChannel(channel){
    this.channel = channel;
    return this;
  }
  
  getThumbnail(){
    return this.thumbnail;
  }
  
  setThumbnail(thumbnail){
    this.thumbnail = thumbnail;
    return this;
  }
  
  getDuration(){
    return this.duration;
  }
  
  setDuration(duration){
    this.duration = duration;
    return this;
  }
  
  getUrl(){
    return this.url;
  }
  
  setUrl(url){
    this.url = url;
    return this;
  } 
}

module.exports = EntryInfo;