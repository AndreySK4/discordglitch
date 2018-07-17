const Player = require("./Player.js");

class PlayerHolder extends Map {
  get(guild, createNew = false){
    if(this.has(guild.id)){
      return super.get(guild.id);
    }else if(!this.has(guild.id) && createNew === true){
      this.set(guild.id, new Player(guild));
      return this.get(guild);
    }else{
      return null;
    }
  }
  
  remove(guild){
    return this.delete(guild.id);
  }
}

module.exports = PlayerHolder;