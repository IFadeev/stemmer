/* Porter stemmer in Javascript for Russian. Programmer: http://gsgen.ru/ */
var PorterStemRu = function() {
	var Stem_Cache = {};
	//var VOWEL = 'аеиоуыэюя';
	var PERFECTIVEGROUND = '((ив|ивши|ившись|ыв|ывши|ывшись)|(([ая])(в|вши|вшись)))$';
	var REFLEXIVE = '(с[яь])$';
	var ADJECTIVE = '(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|еых|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$';
	var PARTICIPLE = '((ивш|ывш|ующ)|(([ая])(ем|нн|вш|ющ|щ)))$';
	var VERB = '((ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|ел|ела|ели|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)|(([ая])(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)))$';
	var NOUN = '(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$';
	var RVRE = '^(.*?[аеиоуыэюя])(.*)$';
	var DERIVATIONAL = '.*[^аеиоуыэюя]+[аеиоуыэюя].*(о)сть?$';
	var DER = 'ость?$';
	var SUPERLATIVE = '(ейше|ейш)$';
	var I = 'и$';
    var P = 'ь$';
    var NN = 'нн$';

	var RV = '';
	var this_obj = this;
	this_obj.Stem_Caching = 0;
	
	function smarty_replace(str, regexp_str, to) {
		var orig = str;
		var test_match_arr;
		var regexp = new RegExp(regexp_str, '');
		var test_regexp_str = '([ая])(в|вши|вшись|ем|нн|вш|ющ|щ|ла|на|ете|йте|ли|й|л|н|ло|но|ет|ют|ны|ть|ешь|нно)$';
		test_regexp = new RegExp(test_regexp_str, '');
		if(str) {
			str = str.replace(regexp, function(str_match) {
				test_match_arr = test_regexp.exec(orig);
				if(test_match_arr != null && str_match == test_match_arr[0]) {
				// Имитация незапоминающих скобок
					to += test_match_arr[1];
				}
				return to;
			});
		}
		RV = str;
		return orig !== str;
	}
	function m_test(str, regexp_str) {
		var regexp = new RegExp(regexp_str, '');
		return regexp.test(str);
	}
	this_obj.stem_word = function(word) {
		word = word.toLowerCase();
		word = word.replace('ё', 'е');	// замена ё на е, чтобы учитывалась как одна и та же буква
		/* # Check cache of stemmed words */
		if (this_obj.Stem_Caching && Stem_Cache[word]) {
			return Stem_Cache[word];
		}
		var stem = word;
		var start = '';
		RV = '';
		var regexp;
		var parser_result = [];
		var i = 0;
		do {
			regexp = new RegExp(RVRE, '');
			parser_result = [];
			parser_result = stem.match(regexp);
			if(parser_result == null) {
				break;
			}
			start = parser_result[1];
			RV = parser_result[2];
			if (!RV) {
				break;
			}
			/* # Step 1 */
			if (!smarty_replace(RV, PERFECTIVEGROUND, '')) {
				smarty_replace(RV, REFLEXIVE, '');
				if (smarty_replace(RV, ADJECTIVE, '')) {
					smarty_replace(RV, PARTICIPLE, '');
				} else {
					if (!smarty_replace(RV, VERB, ''))
						smarty_replace(RV, NOUN, '');
				}
			}
			/* # Step 2 */
			smarty_replace(RV, I, '');
			/* # Step 3 */
			if (m_test(RV, DERIVATIONAL)) {
				smarty_replace(RV, DER, '');
			}
			/* # Step 4 */
			if (!smarty_replace(RV, P, '')) {
				smarty_replace(RV, SUPERLATIVE, '');
				smarty_replace(RV, NN, 'н');
			}
			stem = start + RV;
		} while(false);
		if (this_obj.Stem_Caching) {
			Stem_Cache[word] = stem;
		}
		return stem;
	}
	this_obj.clear_stem_cache = function() {
		Stem_Cache = [];
	}
}

/* Sample of using Porter stemmer in Javascript */
/*
var stemmer = new PorterStemRu();
stemmer.Stem_Caching = 1; // 0|1 вкл/выкл кэш
console.log(stemmer.stem_word('Профпригодность'));
console.log(stemmer.stem_word('Просматривала'));
stemmer.clear_stem_cache(); // Чистим кэш
*/