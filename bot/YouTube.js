const request = require("request");
const { URLSearchParams } = require("url");

class YouTube {
  static getYouTubeAPIUrl(action, parts, params = {}){
    params = new URLSearchParams(params).toString();
    params = params === "" ? "" : `${params}&`;
    return `https://www.googleapis.com/youtube/v3/${action}?part=${parts}&${params}key=${process.env.YOUTUBE_API_TOKEN}`;
  }
  
  static search(query, max = 5){
    let url = YouTube.getYouTubeAPIUrl("search", "snippet", {q: query, maxResults: max, type: "video"});
    return new Promise((resolve, reject) => {
      request({url: url, json: true}, (err, res, body) => {
        if(err){
          reject(err);
          return;
        }
        if(body.pageInfo.totalResults === 0){
          resolve([]);
          return;
        }
        
        let data = body.items.filter(i => {return i.id.kind === "youtube#video"});
        
        let results = [];
        
        data.forEach(item => {
          YouTube.getInfoFor(item.id.videoId)
            .then(res => results.push(res))
            .then(() => {
              if(results.length === data.length){
                resolve(results);
              }
            })
            .catch(e => reject(e));
        });
      });
    });
  }
  
  static getInfoFor(id){
    let url = YouTube.getYouTubeAPIUrl("videos", "snippet,contentDetails", {id: id});
    return new Promise((resolve, reject) => {
      request({url: url, json: true}, (err, res, body) => {
        if(err){
          reject(err);
          return;
        }
        if(body.items[0].kind !== "youtube#video"){
          reject(new Error("Result type was not a video"));
          return;
        }
        if(!body.items[0]){
          reject(new Error("Video not found"));
          return;
        }
        
        let data = body.items[0];
        let info = {};
        info.id = data.id;
        info.title = data.snippet.title;
        info.channel = data.snippet.channelTitle;
        info.thumbnail = data.snippet.thumbnails.medium.url;
        info.duration = YouTube.parseDuration(data.contentDetails.duration);
        info.url = `https://youtube.com/watch?v=${data.id}`;
        
        resolve(info);
      });
    });
  }
  
  static parseDuration(dur){
    const regex = /^P(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?$/g;
    
    let [d, h, m, s] = regex.exec(dur).slice(1).map(v => Number(v));
    
    d = (Number.isNaN(d) ? 0 : d * 24);
    h = (Number.isNaN(h) ? d : h + d);
    m = (Number.isNaN(m) ? 0 : m);
    s = (Number.isNaN(s) ? 0 : s);
    
    function fix(x){
      return x.toString().length === 1 ? `0${x}` : x.toString();
    }
    
    return [fix(h), fix(m), fix(s)].join(":");
  }
}

module.exports = YouTube;