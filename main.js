

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

	blanks[0] = "Misspelled version of real word, ending in -ly or -io";
	blanks[1] = "Verb";
	blanks[2] = "Plural Noun";
	blanks[3] = "Minor Celebrity";
	blanks[4] = "Gentrified Neighborhood";
	blanks[5] = "Obscure Ethnicity";
	blanks[6] = "Noun";
	blanks[7] = "Verb ending in -ate";
	blanks[8] = "Trivial stuff you like";
	blanks[9] = "Social media profile no one reads)";
	blanks[10] = "Gerund starting with \"crowd\"";
	blanks[11] = "Failing Industry";
	blanks[12] = "Verb that Implies Creativity";
	blanks[13] = "Noun form of Verb Ending in -ate";
	blanks[14] = "Boring Daily Task";
	blanks[15] = "Unmanageable thing";
	blanks[16] = "Adjective";
	blanks[17] = "Slightly Intimidating Acronym";
	blanks[18] = "Previous Startup with Record-Breaking IPO";
	blanks[19] = "First-World Problem";
	blanks[20] = "Euphemistic Gerund";
	blanks[21] = "Verb Involving Face-to-Face Interaction with Humans";
	blanks[22] = "Data No One Needs to Keep Track of Except Advertisers";
	blanks[23] = "Invasive, Data-Mining GPS-Based Service";
	blanks[24] = "Serious Verb";
	blanks[25] = "Fun Verb";
	blanks[26] = "Verb form of Startup Name";

	$('#blank').html(blanks[0]);
}