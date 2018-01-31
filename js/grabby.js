
//wa[r]/n
//wa[r]" "
function grabby(argument) {
	var word = argument;
	var length = argument.length;
	var beginSTR;
	var endSTR;

	for (var i = 0; i <= argument.length; i++) {
		if ((argument[i] != " ") && (argument[i + 1] != " ")) {
			beginSTR = i;
			break;
		}
	}

	for (var i = beginSTR; i <= argument.length; i++) {
		if ((argument[i] != " ") && (argument[i + 1] == " ")) {
			endSTR = i + 1;
			break;
		}
		else {
			if(!(argument[i + 1])) {
				endSTR = i + 1;
				break;
			}
		}
	}

	console.log(beginSTR);
	console.log(endSTR);
	word = argument.substring(beginSTR, endSTR);
	console.log(word);
}