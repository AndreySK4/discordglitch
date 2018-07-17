/**
 * CommandClient
 * have custom commands for your bot
 * @author eDroid
 */
class CommandClient {
  constructor(client, prefix = "/"){
    this.client = client;
		this._prefix = prefix;
		this._commands = new Map();
    this._init();
	}
  
  _init(){
    this.client.on("message", message => {
      this._handle(message);
    });
  }
  
  _handle(message){
		if(!message.content.startsWith(this.prefix)) return;
		let args = message.content.split(" ");
		let command = args.shift().substr(1).toLowerCase();
		if(!this._commands.has(command)) return;
		this._commands.get(command)(args, message);
	}

	register(name, callable){
		if((typeof name !== "string") || (typeof callable !== "function")) return false;
		if(this._commands.has(name)) return false;
		this._commands.set(name, callable);
		return true;
	}

	unregister(name){
		return this._commands.delete(name);
	}
  
  get prefix(){
    return this._prefix;
  }
}

module.exports = function(client, prefix){
  client.commands = new CommandClient(client, prefix);
  
  return client;
};