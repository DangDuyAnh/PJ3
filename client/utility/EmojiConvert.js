const emoji = new Map();
emoji.set(":)", "đ");
emoji.set(":D" , "đ"),
emoji.set(":(", "âšī¸");
emoji.set("<3", "â¤ī¸");
emoji.set(":p", "đ");

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