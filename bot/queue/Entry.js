const YouTube = require("../YouTube");
const EntryInfo = require("./EntryInfo");

class Entry {
  static get YOUTUBE_REGEX(){return /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/}
  
  constructor(info, creator){
    this.info = new EntryInfo(info);
    this.creator = creator;
  }
  
  getInfo(){
    return this.info;
  }
  
  getCreator(){
    return this.creator;
  }
  
  static fromMessage(client, query, message){
    return new Promise((resolve, reject) => {
      if(Entry.YOUTUBE_REGEX.test(query)){
        let parts = Entry.YOUTUBE_REGEX.exec(query);
        YouTube.getInfoFor(parts[5])
          .then(info => {
            resolve({entry: new Entry(info, message.author), msg: null});
          })
          .catch(e => reject(new Error("Failed getting info for "+parts[5]+" due to: "+e.message)));
      }else{
        let emojis = ["🇦", "🇧", "🇨", "🇩", "🇪"];
        let data = {};
        let i = 0;
        YouTube.search(query)
          .then(results => {
            results = results.map(res => {
              data[emojis[i]] = res;
              return `${emojis[i++]} [${res.channel}] ${res.title} - ${res.duration}`;
            });
          
            message.reply("Results:\n"+results.join("\n")).then(msg => {
              for(let j = 0; j < i; j++){
                (async () => {
                  await msg.react(emojis[j]);
                })();
              }
              
              let cb = function(reaction, user){
                if(reaction.message === msg && emojis.indexOf(reaction.emoji.name) !== -1 && user === message.author){
                  client.removeListener("messageReactionAdd", cb);
                  msg.clearReactions();
                  resolve({entry: new Entry(data[reaction.emoji.name], user), msg: msg});
                }
              };
              
              client.on("messageReactionAdd", cb);
            });
          
          })
          .catch(e => reject(new Error("Failed searching for "+query+" due to: "+e.message)));
      }
    });
  }
}

module.exports = Entry;