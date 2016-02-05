var highlightColours = ["SteelBlue", "Aqua", "MediumTurquoise", "PaleTurquoise", "CadetBlue", "LightSteelBlue", "SkyBlue", "Lime", "GreenYellow", "LimeGreen", "PaleGreen", "OliveDrab", "SeaGreen", "ForestGreen", "Crimson", "FireBrick", "OrangeRed", "IndianRed", "LightCoral", "Salmon", "LightSalmon", "DarkOrange", "Gold", "Khaki", "DarkKhaki", "PaleGoldenrod", "Moccasin", "PeachPuff", "BlueViolet", "Purple", "Thistle", "Plum", "Violet", "MediumOrchid", "MediumPurple"];

var bibleData;
var dictionaryData;

var $form = $("<div>");
var dataDisplayed = [];
var highlightCounter = 0;

var formStructure = [
	{"name": "person", "elements": [{"value": "1", "option": "1st"}, {"value": "2", "option": "2nd"}, {"value": "3", "option": "3rd"}]},
	{"name": "tense", "elements": [{"value": "P", "option": "present"}, {"value": "I", "option": "imperfect"}, {"value": "F", "option": "future"}, {"value": "A", "option": "aorist"}, {"value": "X", "option": "perfect"}, {"value": "Y", "option": "pluperfect"}]},
	{"name": "voice", "elements": [{"value": "A", "option": "active"}, {"value": "M", "option": "middle"}, {"value": "P", "option": "passive"}]},
	{"name": "mood", "elements": [{"value": "I", "option": "indicative"}, {"value": "D", "option": "imperative"}, {"value": "S", "option": "subjunctive"}, {"value": "O", "option": "optative"}, {"value": "N", "option": "infinitive"}, {"value": "P", "option": "participle"}]},
	{"name": "case", "elements": [{"value": "N", "option": "nominative"}, {"value": "G", "option": "genitive"}, {"value": "D", "option": "dative"}, {"value": "A", "option": "accusative"}]},
	{"name": "number", "elements": [{"value": "S", "option": "singular"}, {"value": "P", "option": "plural"}]},
	{"name": "gender", "elements": [{"value": "M", "option": "masculine"}, {"value": "F", "option": "feminine"}, {"value": "N", "option": "neuter"}]},
	{"name": "degree", "elements": [{"value": "C", "option": "comparative"}, {"value": "S", "option": "superlative"}]}
];
var partsOfSpeech = {
	"A-": "Adjective",
	"C-": "Conjunction",
	"D-": "Adverb",
	"I-": "Interjection",
	"N-": "Noun",
	"P-": "Preposition",
	"RA": "Definite Article",
	"RD": "Demonstrative Pronoun",
	"RI": "Interrogative/Indefinite Pronoun",
	"RP": "Personal Pronoun",
	"RR": "Relative Pronoun",
	"V-": "Verb",
	"X-": "Particle"
};

function displaydata(object, destination, extended)
{
	var position = {
		"wordIndexInVerse": $(object).attr("data-word-index-in-verse"),
		"verseNumber": $(object).parent().attr("data-verse-number"),
		"chapterNumber": $(object).parent().parent().attr("data-chapter-number")
	};
	var dataChapter = $.grep(bibleData.chapters, function(e){ return e.chapter == position.chapterNumber; })[0];
	var dataVerse = $.grep(dataChapter.verses, function(e){ return e.verse == position.verseNumber; })[0];
	var dataWord = $.grep(dataVerse.words, function(e){ return e.wordIndexInVerse == position.wordIndexInVerse; })[0];

	if (dataWord.lemma)
	{
		if (!extended)
		{
			$(destination).html(dataWord.lemma);
		}
		else {
			var $posTitle = $("<h1>").text("Part of Speech");
			var $parsingTitle = $("<h1>").text("Parsing");
			var $parsingDetails = $("<div>");
			var findObjectWithValue = function(obj, value) {
				return $.grep(obj, function(e){ return e.value == value; })[0];
			};
			if (dataWord.morphologyTwo !== "--------")
			{
				for (var i = 0; i < 8; i++) {
					var ci = dataWord.morphologyTwo[i];
					if (ci == '-')
						continue;
					var detail = findObjectWithValue(formStructure[i].elements, ci);
					$parsingDetails.append($("<b>").text(formStructure[i].name.toUpperCase() + ": "))
					.append(detail.option)
					.append($("<br>"));
				}
				$(".parsingData").empty().append($posTitle)
					.append($("<div>").text(partsOfSpeech[dataWord.morphologyOne]))
					.append($parsingTitle)
					.append($parsingDetails);
			}
			else {
				$(".parsingData").empty().append($posTitle)
					.append($("<div>").text(partsOfSpeech[dataWord.morphologyOne]));
			}
			$(destination).html(dataWord.lemma);
		}
	}
	return dataWord;
}

function inArray(elem, array) {
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}
	return -1;
}

function showLoad()
{
	var $select = $("<select>");
	$select.append("<option value='matthew'>Matthew</option>");
	$select.append("<option value='mark'>Mark</option>");
	$select.append("<option value='luke'>Luke</option>");
	$select.append("<option value='john'>John</option>");
	$select.append("<option value='acts'>Acts</option>");
	$select.append("<option value='galatians'>Galatians</option>");
	$.MessageBox({
		message : "Choose an Option:",
		buttonDone  : "Prepare to Mark",
		buttonFail  : "Cancel",
		input   : $select
	}).done(function(data){
		$(".loadingOverlay").show();
		$(".referenceBook").text(data);
		$.getJSON("json/" + data + ".json", function(data){
			$(".contentmain").empty();
			$("#chapterButtons").empty();
			bibleData = data;
			data.chapters.forEach(function(chapter){
				if (chapter.verses.length === 1)
					return;
				var $chElement = $("<p>")
					.addClass("chapter")
					.attr("data-chapter-number", chapter.chapter)
					.append($("<a>").attr("name", "ch" + chapter.chapter));
				chapter.verses.forEach(function(verse){
					var $vElement = $("<span>")
						.addClass("verse")
						.attr("data-verse-number", verse.verse);
					verse.words.forEach(function(word){
						$vElement.append(
							$("<span>")
							  .append(word.wordInText + ' ')
							  .addClass("wordItself")
							  .attr("data-word-index-in-verse", word.wordIndexInVerse)
							  .attr("data-lemma", word.lemma)
							  .attr("data-morphology-one", word.morphologyOne)
							  .attr("data-morphology-two", word.morphologyTwo)
						);
					});
					$chElement.append($vElement);
				});
				$(".contentmain").append($chElement);
				$("#chapterButtons").append(
					$("<a>").attr("href", "#ch" + chapter.chapter)
					.text(chapter.chapter)
					.addClass("chapterLink")
				);
			});
			$(".loadingOverlay").fadeOut();
		});
	});
}
function buildForm()
{
	var $txtlemma = $("<input>")
		.attr("type", "text")
		.attr("name", "lemma")
		.attr("placeholder", "any lemma")
		.addClass("u-full-width")
		.on("click", function(){
			$(this).val(dataDisplayed.lemma);
			this.select();
		});
	$form.empty()
		 .append($txtlemma)
		 .append($("<br>"));

	formStructure.forEach(function(e){
		var $select = $("<select>").attr("name", e.name).addClass("u-full-width");
		$select.append($("<option style='display:none;'>").val(".").text(e.name).attr("selected", ""));
		$select.append($("<option>").val(".").text("any"));
		e.elements.forEach(function(e){
			$select.append($("<option>").val(e.value).text(e.option));
		});
		$form.append($select);
	});

	$(".highlightOptions").append($form);
}

$(document).ready(function() {
	$(".contentmain").css("top", $("#mkhead").outerHeight());
	$.getJSON("json/dictionary.json", function(data){
		dictionaryData = data;
	});
	showLoad();
	buildForm();
}).on("click", ".loadNewBook", function(){
	showLoad();
}).on("click", ".wordItself", function(){
	dataDisplayed = displaydata($(this), ".static.dataDisplayer", true);
}).on("mouseover", ".verse > span", function(e) {
	var verseNumber = $(e.target).parent().attr("data-verse-number");
	var chapterNumber = $(e.target).parent().parent().attr("data-chapter-number");
	$(".referenceVerse").html(chapterNumber + ":" + verseNumber);
	// displaydata($(this), ".dynamic.dataDisplayer", false);
}).on("click", ".btnHighlightSomething", function() {
	var $formElements = $form.children().filter(":input");
	var formData = {};
	$($formElements).each(function () {
		formData[this.name] = $(this).val();
	});
	var regex = "";
	formStructure.forEach(function(e){
		regex += formData[e.name];
	});
	console.log(formData.collectionName);
	console.log(formData.lemma);
	console.log(regex);
	var $words = $(".wordItself");
	if (regex != "........")
	$words = $words.filter(":regex(data-morphology-two," + regex + ")");
	if (formData.lemma !== "")
	$words = $words.filter("[data-lemma='" + formData.lemma + "']");
	$words.css("background-color", highlightColours[highlightCounter++]);
	$words.addClass("regexHighlighted");
	$words.attr("data-highlight-index", highlightCounter);
}).on("click", ".showDefinition", function(){
	var $title = $("<h1>").text(dataDisplayed.lemma);
	var $msg = $("<p>").text(dictionaryData[normalizePolytonicGreekToLowerCase(dataDisplayed.lemma)].definition);
	$msg.prepend($("<b>").text("Definition: "));
	$.MessageBox({
		message: $("<div>").addClass("definition").append($title).append($msg)
	});
}).on("click", ".regexHighlighted", function(){
	var highlightIndex = $(this).attr("data-highlight-index");
	$.MessageBox({
		buttonDone  : "Yes",
		buttonFail  : "No",
		message     : "Would you like to clear these highlights?"
	}).done(function(){
		$(".regexHighlighted").filter("[data-highlight-index=" + highlightIndex + "]")
			.removeAttr("style")
			.removeClass("regexHighlighted");
	});
});


jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

$(function() {

    var $sidebar   = $(".sidebar"),
        $window    = $(window),
        offset     = $sidebar.offset(),
        topPadding = 35;

	var stillScrollingTimer;
    $window.scroll(function() {
		window.clearTimeout(stillScrollingTimer);
		stillScrollingTimer = window.setTimeout(function(){
	        if ($window.scrollTop() > offset.top) {
	            $sidebar.stop().animate({
	                marginTop: $window.scrollTop() - offset.top + topPadding
	            });
	        } else {
	            $sidebar.stop().animate({
	                marginTop: 0
	            });
	        }
		}, 100);
    });

});

function normalizePolytonicGreekToLowerCase(text) {
	text = text.replace(/[ΆΑάἀἁἂἃἄἅἆἇὰάᾀᾁᾂᾃᾄᾅᾆᾇᾰᾱᾲᾳᾴᾶᾷἈἉἊἋἌἍἎἏᾈᾉᾊᾋᾌᾍᾎᾏᾸᾹᾺΆᾼ]/g,'α');
	text = text.replace(/[ΈΕέἐἑἒἓἔἕὲέἘἙἚἛἜἝῈΈ]/g,'ε');
	text = text.replace(/[ΉΗήἠἡἢἣἤἥἦἧὴήᾐᾑᾒᾓᾔᾕᾖᾗῂῃῄῆῇἨἩἪἫἬἭἮἯᾘᾙᾚᾛᾜᾝᾞᾟῊΉῌ]/g,'η');
	text = text.replace(/[ΊΪΙίΐἰἱἲἳἴἵἶἷὶίῐῑῒΐῖῗἸἹἺἻἼἽἾἿῘῙῚΊ]/g,'ι');
	text = text.replace(/[ΌΟόὀὁὂὃὄὅὸόὈὉὊὋὌὍῸΌ]/g,'ο');
	text = text.replace(/[ΎΫΥΰϋύὐὑὒὓὔὕὖὗὺύῠῡῢΰῦῧὙὛὝὟῨῩῪΎ]/g,'υ');
	text = text.replace(/[ΏΩώὠὡὢὣὤὥὦὧὼώᾠᾡᾢᾣᾤᾥᾦᾧῲῳῴῶῷὨὩὪὫὬὭὮὯᾨᾩᾪᾫᾬᾭᾮᾯῺΏῼ]/g,'ω');
	text = text.replace(/[ῤῥῬ]/g,'ρ');
	return text.toLowerCase();
}
