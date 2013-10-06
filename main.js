var blanks = [];
var libs = [];
var users = [];
var requests = {};
var counter = 0;

init();

//add users to users array. Need their phone number
function addUser(phoneNumber) {
	users.push(phoneNumber);
	sendWord(users[users.length - 1]);
}

//send unsent or timedout word to users
function sendWord(user) {

	if () {
		requests[user] = blanks[counter];
	}

	//code to send word to selected user

}

//get word from user and put it into corresponding libs array
function receiveWord() {


	if (counter == 27) {
		var textLib = printTextLib();
		//send text lib to voicemail
		//send text to browser
	}
}

//Create text lib from user submitted words
function printTextLib() {

	var story = "Your startup name: " +
	libs[0] +
	". Have you ever wanted to " +
	libs[1] +
	" all sorts of " +
	libs[2] +
	" with friends, family, colleagues, or even " +
	libs[3] +
	", but didn't know how? Maybe you were just strolling the sidewalks of " +
	libs[4] +
	" past your favorite " +
	libs[5] +
	" bakery when you wished you could pull out your i" +
	libs[6] +
	" and use it to quickly " +
	libs[7] +
	" all your latest " +
	libs[8] +
	" and post it to your " +
	libs[9] +
	"? " +
	libs[0] +
	" is the answer. The fact is, we live in a world where " +
	libs[10] +
	" will revolutionize " +
	libs[11] +
	", and pretty soon you'll be able to " +
	libs[12] +
	" anything you want through the cloud. All this " +
	libs[13] +
	" is already changing the way we " +
	libs[14] +
	", but who has the tools to keep up with it? " +
	libs[0] +
	" is that tool. With our beautiful, user-friendly interface, you'll find that managing all your " +
	libs[15] +
	" is easier than ever-and " +
	libs[16] +
	"! Utilizing the power of " +
	libs[17] +
	" services with all the connectivity of " +
	libs[18] +
	", we can help you free yourself from tyranny of " +
	libs[19] +
	". In this rapidly " +
	libs[20] +
	" world of ours, it's hard to find the time to " +
	libs[21] +
	" or keep track of all the " +
	libs[22] +
	". " +
	libs[0] +
	" changes that. It puts the power of " +
	libs[23] +
	" at your fingertips. " +
	libs[24] +
	". " +
	libs[25] +
	". " +
	libs[26] +
	".";

	return story;

}

function init() {
  var blanks = [
    "Misspelled version of real word, ending in -ly or -io",
    "Verb",
    "Plural Noun",
    "Minor Celebrity",
    "Gentrified Neighborhood",
    "Obscure Ethnicity",
    "Noun",
    "Verb ending in -ate",
    "Trivial stuff you like",
    "Social media profile no one reads)",
    "Gerund starting with \"crowd\"",
    "Failing Industry",
    "Verb that Implies Creativity",
    "Noun form of Verb Ending in -ate",
    "Boring Daily Task",
    "Unmanageable thing",
    "Adjective",
    "Slightly Intimidating Acronym",
    "Previous Startup with Record-Breaking IPO",
    "First-World Problem",
    "Euphemistic Gerund",
    "Verb Involving Face-to-Face Interaction with Humans",
    "Data No One Needs to Keep Track of Except Advertisers",
    "Invasive, Data-Mining GPS-Based Service",
    "Serious Verb",
    "Fun Verb",
    "Verb form of Startup Name"
  ];

	$('#blank').html(blanks[0]);
}
