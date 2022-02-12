const emoji = new Map();
emoji.set(":)", "🙂");
emoji.set(":D" , "😁"),
emoji.set(":(", "☹️");
emoji.set("<3", "❤️");
emoji.set(":p", "😛");

export function EmojiConvert(string) {
  	let resultString = ""
    let words = string.split(' ')
    for (let i in words) {
        if (emoji.get(words[i]) !== undefined) {
          words[i] = emoji.get(words[i]);
        }
      	resultString += words[i] + " ";
    } 
  	return resultString;
}