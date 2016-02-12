var highlightColours = ["SteelBlue", "Aqua", "MediumTurquoise", "PaleTurquoise", "CadetBlue", "LightSteelBlue", "SkyBlue", "Lime", "GreenYellow", "LimeGreen", "PaleGreen", "OliveDrab", "SeaGreen", "ForestGreen", "Crimson", "FireBrick", "OrangeRed", "IndianRed", "LightCoral", "Salmon", "LightSalmon", "DarkOrange", "Gold", "Khaki", "DarkKhaki", "PaleGoldenrod", "Moccasin", "PeachPuff", "BlueViolet", "Purple", "Thistle", "Plum", "Violet", "MediumOrchid", "MediumPurple"];

var bibleData;
var $aboutDialog;
var dictionaryData;
var textSize;
var textSizeArray = ["smallest", "small", "", "big", "bigger", "biggest"];

var $form = $("<div>");
var dataDisplayed = [];
var highlightCounter = 0;
var viewportHeight;

var bookList = [{ "value": "matthew", "bookName": "Matthew" },
	{ "value": "mark", "bookName": "Mark" },
	{ "value": "luke", "bookName": "Luke" },
	{ "value": "john", "bookName": "John" },
	{ "value": "acts", "bookName": "Acts" },
	{ "value": "romans", "bookName": "Romans" },
	{ "value": "1corinthians", "bookName": "1 Corinthians" },
	{ "value": "2corinthians", "bookName": "2 Corinthians" },
	{ "value": "galatians", "bookName": "Galatians" },
	{ "value": "ephesians", "bookName": "Ephesians" },
	{ "value": "philippians", "bookName": "Philippians" },
	{ "value": "colossians", "bookName": "Colossians" },
	{ "value": "1thessalonians", "bookName": "1 Thessalonians" },
	{ "value": "2thessalonians", "bookName": "2 Thessalonians" },
	{ "value": "1timothy", "bookName": "1 Timothy" },
	{ "value": "2timothy", "bookName": "2 Timothy" },
	{ "value": "titus", "bookName": "Titus" },
	{ "value": "philemon", "bookName": "Philemon" },
	{ "value": "hebrews", "bookName": "Hebrews" },
	{ "value": "james", "bookName": "James" },
	{ "value": "1peter", "bookName": "1 Peter" },
	{ "value": "2peter", "bookName": "2 Peter" },
	{ "value": "1john", "bookName": "1 John" },
	{ "value": "2john", "bookName": "2 John" },
	{ "value": "3john", "bookName": "3 John" },
	{ "value": "jude", "bookName": "Jude" },
	{ "value": "revelation", "bookName": "Revelation" }
];

var parsingDefintionObject = [
	{"name": "person", "elements": [{"value": "1", "option": "1st"}, {"value": "2", "option": "2nd"}, {"value": "3", "option": "3rd"}]},
	{"name": "tense", "elements": [{"value": "P", "option": "present"}, {"value": "I", "option": "imperfect"}, {"value": "F", "option": "future"}, {"value": "A", "option": "aorist"}, {"value": "X", "option": "perfect"}, {"value": "Y", "option": "pluperfect"}]},
	{"name": "voice", "elements": [{"value": "A", "option": "active"}, {"value": "M", "option": "middle"}, {"value": "P", "option": "passive"}]},
	{"name": "mood", "elements": [{"value": "I", "option": "indicative"}, {"value": "D", "option": "imperative"}, {"value": "S", "option": "subjunctive"}, {"value": "O", "option": "optative"}, {"value": "N", "option": "infinitive"}, {"value": "P", "option": "participle"}]},
	{"name": "case", "elements": [{"value": "N", "option": "nominative"}, {"value": "G", "option": "genitive"}, {"value": "D", "option": "dative"}, {"value": "A", "option": "accusative"}, {"value": "V", "option": "vocative"}]},
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
			var $posTitle = $("<div>").addClass("definitionTitle").text("Part of Speech");
			var $parsingTitle = $("<div>").addClass("definitionTitle").text("Parsing");
			var $parsingDetail = $("<div>").addClass("definitionDetail");
			var findObjectWithValue = function(obj, value) {
				return $.grep(obj, function(e){ return e.value == value; })[0];
			};
			if (dataWord.morphologyTwo !== "--------")
			{
				for (var i = 0; i < 8; i++) {
					var ci = dataWord.morphologyTwo[i];
					if (ci == '-')
						continue;
					var detail = findObjectWithValue(parsingDefintionObject[i].elements, ci);
					$parsingDetail.append($("<b>").text(parsingDefintionObject[i].name.toUpperCase() + ": "))
					.append(detail.option)
					.append($("<br>"));
				}
				var $posDetail = $("<div>").addClass("definitionDetail").text(partsOfSpeech[dataWord.morphologyOne]);
				$(".parsingData").empty().append($posTitle)
					.append($posDetail)
					.append($parsingTitle)
					.append($parsingDetail);
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
	bookList.forEach(function(book){
		$select.append("<option value='" + book.value + "'>" + book.bookName + "</option>");
	});
	$.MessageBox({
		message : "Choose an Option:",
		buttonDone  : "Prepare to Mark",
		buttonFail  : "Cancel",
		input   : $select
	}).done(function(data){
		var bookName = data;
		$(".loadingOverlay").show();
		$.getJSON("json/" + data + ".json", function(data){
			$(window).scrollTop(0);
			$(".contentmain").empty();
			$("#chapterButtons").empty();
			$(".referenceBook").text($.grep(bookList, function(b){ return b.value == bookName; })[0].bookName);
			$(".referenceVerse").text("");
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
						(word.wordInText + " ").split(/([\u0370-\u03FF\u1F00-\u1FFF]+)/).forEach(function(bit){
							if (bit.match(/[\u0370-\u03FF\u1F00-\u1FFF]+/))
							{
								$vElement.append(
									$("<span>")
										.append(bit)
										.addClass("wordItself")
										.attr("data-word-index-in-verse", word.wordIndexInVerse)
										.attr("data-lemma", word.lemma)
										.attr("data-morphology-one", word.morphologyOne)
										.attr("data-morphology-two", word.morphologyTwo)
								);
							}
							else
							{
								$vElement.append(bit);
							}
						});
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
			window.setTimeout(setVerseRange, 400);
			$(".loadingOverlay").fadeOut();
		});
	});
}
function buildForm()
{
	var $txtlemma = $("<input>")
		.attr("type", "text")
		.attr("name", "lemma")
		.attr("placeholder", "lexical form (any)")
		.addClass("u-full-width")
		.on("click", function(){
			$(this).val(dataDisplayed.lemma);
			this.select();
		});
	$form.empty()
		 .append($txtlemma)
		 .append($("<br>"));

	parsingDefintionObject.forEach(function(e){
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

	if (!FontDetect.isFontLoaded('SBL BibLit') && !FontDetect.isFontLoaded('SBL Greek'))
	{
		$.MessageBox({
			message: "It's not required but you should really consider installing the SBL Biblit font for good looking Greek...<br />and if it doesn't look good, well that's your dumb fault isn't it?"
		});
	}
	showLoad();
	$aboutDialog = $(".aboutDialog").detach();
	buildForm();

	textSize = localStorage.getItem("textSize");
	textSize = typeof textSize == "undefined" ? 2 : textSize;
	$("#fontSizeSelector").val(textSize);
	$(".contentmain").addClass(textSizeArray[textSize]);

	var $sidebar	= $(".sidebar"),
		$window		= $(window),
		offset		= $sidebar.offset(),
		topPadding	= 35,
		ticking		= false;
	viewportHeight = $window.height();

	$window.on("scroll", debounce(function(){
		if(!ticking) {
			requestAnimationFrame(function(){
				var newScrollTop = $window.scrollTop();
				var currentOffset = parseInt($sidebar.css("marginTop"), 10);
				if (Math.abs(newScrollTop - currentOffset) > viewportHeight)
				{
					$sidebar.css("marginTop", currentOffset > newScrollTop ? newScrollTop + viewportHeight : newScrollTop - viewportHeight);
				}
				if (newScrollTop > offset.top) {
					$sidebar.stop().animate({
						marginTop: newScrollTop - offset.top + topPadding
					});
				} else {
					$sidebar.stop().animate({
						marginTop: 0
					});
				}
				ticking = false;
			});
			ticking = true;
			setVerseRange();
		}
	}, 250));
	trapScroll({ onScrollEnd: function(){} });
}).on("click", ".loadNewBook", function(){
	showLoad();
}).on("click", ".wordItself", function(){
	dataDisplayed = displaydata($(this), ".static.dataDisplayer", true);
	$(".selectedWord").removeClass("selectedWord");
	$(this).addClass("selectedWord");
}).on("mouseover", ".verse > span", function(e) {
	// var verseNumber = $(e.target).parent().attr("data-verse-number");
	// var chapterNumber = $(e.target).parent().parent().attr("data-chapter-number");
	// $(".referenceVerse").html(chapterNumber + ":" + verseNumber);
	// displaydata($(this), ".dynamic.dataDisplayer", false);
}).on("click", ".btnHighlightSomething", function() {
	var $formElements = $form.children().filter(":input");
	var formData = {};
	$($formElements).each(function () {
		formData[this.name] = $(this).val();
	});
	var regex = "";
	parsingDefintionObject.forEach(function(e){
		regex += formData[e.name];
	});
	// console.log(formData.collectionName);
	// console.log(formData.lemma);
	// console.log(regex);
	var $words = $(".wordItself");
	if (formData.lemma !== "")
		$words = $words.filter("[data-lemma='" + formData.lemma + "']");
	if (regex != "........")
		$words = $words.filter(":regex(data-morphology-two," + regex + ")");
	$words.css("background-color", highlightColours[highlightCounter++]);
	$words.addClass("regexHighlighted");
	$words.attr("data-highlight-index", highlightCounter);

	$searchResults = $(".searchResults ul");
	$searchResults.empty();
	$words.each(function(){
		var chapterNum = $(this).parent().parent().attr("data-chapter-number"),
			verseNum = $(this).parent().attr("data-verse-number"),
			$tmpreference = $("<span>").addClass("vref")
				.text(chapterNum + ":" + verseNum),
			$liEl = $("<li>")
				.append($tmpreference)
				.append($("<span>").addClass("vword").text($(this).text()))
				.data("wordAnchor", this);
		$searchResults.append($liEl);
	});
}).on("click", ".showAbout", function(){
	$.MessageBox({
		message: $aboutDialog,
		top: "5%"
	});
}).on("click", ".showDefinition", function(){
	showDefinition(dataDisplayed.lemma);
}).on("click", ".regexHighlighted", function(){
	var highlightIndex = $(this).attr("data-highlight-index");
	$.MessageBox({
		buttonDone  : "Yes",
		buttonFail  : "No",
		message	 : "Would you like to clear these highlights?"
	}).done(function(){
		$(".regexHighlighted").filter("[data-highlight-index=" + highlightIndex + "]")
			.removeAttr("style")
			.removeClass("regexHighlighted");
	});
}).on("click", ".chapterLink", function(){
	var newTop = $("[name='" + $.attr(this, 'href').substring(1) + "']").offset().top - 34;
	scrollSomewhere(newTop);
	return false;
}).on("change", "#fontSizeSelector", function(){
	var oldTextSize = textSize;
	textSize = +$(this).val();
	var $topLeftWord = getExtremeElement();
	requestAnimationFrame(function(){
		$(".contentmain").removeClass(textSizeArray[oldTextSize]).addClass(textSizeArray[textSize]);
		window.setTimeout(function() {
			requestAnimationFrame(function(){
				scrollToWord($topLeftWord, 0);
			});
		}, 300);
	});
	localStorage.setItem("textSize", textSize);
}).on("click", ".searchResults li", function(){
	scrollToWord($(this).data("wordAnchor"));
}).on("click", ".innerDefinitionAnchor", function(){
	$("#messagebox_button_done").trigger("click");
	showDefinition($(this).text());
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

function setVerseRange()
{
	var element = getExtremeElement(false);
	if (element <= 0)
	{
		$(".referenceVerse").html("");
	}
	else {
		var earliestPoint = $(element).parent().parent().attr("data-chapter-number") + ":" + $(element).parent().attr("data-verse-number");
		element = getExtremeElement(true);
		var latestPoint = $(element).parent().parent().attr("data-chapter-number") + ":" + $(element).parent().attr("data-verse-number");
		var message = earliestPoint == "undefined:undefined" ? (latestPoint == "undefined:undefined" ? "" : latestPoint) : earliestPoint + (latestPoint == "undefined:undefined" ? "" : "-" + latestPoint);
		$(".referenceVerse").html(earliestPoint + "-" + latestPoint);
	}
}
function getExtremeElement(invertDirection){

	if ($(".contentmain").is(':empty'))
		return 0;
	var contentRect = $(".contentmain")[0].getBoundingClientRect();
	var leftmost = contentRect.left;
	var rightmost = contentRect.left + contentRect.width;
	//25 and 50 are just magic numbers derived through testing
	var topmost = contentRect.top < 0 ? 50 : contentRect.top;
	var bottommost = contentRect.bottom > viewportHeight ? viewportHeight - 25 : contentRect.bottom;

	var options = {
		'xDefault': !invertDirection ? leftmost : rightmost,
		'yDefault': !invertDirection ? topmost : bottommost,
		'xMax': !invertDirection ? rightmost : leftmost,
		'yMax': !invertDirection ? bottommost : topmost,
		'xDelta': !invertDirection ? 30 : -30,
		'yDelta': !invertDirection ? 12 : -12,
	};
	var element,
		x = options.xDefault,
		y = options.yDefault, i = 0;
	do {
		element = document.elementFromPoint(x, y);
		x += options.xDelta;
		if ((x >= options.xMax && !invertDirection) || (x <= options.xMax && invertDirection))
		{
			x = options.xDefault;
			y += options.yDelta;
			if ((y > options.yMax && !invertDirection) || (y < options.yMax && invertDirection))
			{
				console.log("fatal error finding point...");
				return -1;
			}
		}
	} while (!$(element).hasClass("wordItself"));
	return element;
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function scrollSomewhere(where)
{
	$('html, body').animate({ scrollTop: where }, 300, "linear");
}
function scrollToWord(word, offset)
{
	offset = (typeof offset == "undefined") ? (viewportHeight * 0.2) : offset + 34; //34 is the height of the menu bar thing
	scrollSomewhere($(word).offset().top - offset);
}

function showDefinition(lemma)
{
	var $title = $("<div>").addClass("definitionTitle").text(lemma);
	var lemmaDefinition = dictionaryData[normalizePolytonicGreekToLowerCase(lemma)].definition;
	var $msg = $("<p>");
	lemmaDefinition.split(/([\u0370-\u03FF\u1F00-\u1FFF]+)/).forEach(function(l){
		if (l.match(/[\u0370-\u03FF\u1F00-\u1FFF]+/))
		{
			$msg.append($("<a>", {
				"href": "#",
				"class": "innerDefinitionAnchor",
				"text": l
			}));
		}
		else {
			$msg.append(l);
		}
	});
	$msg.prepend($("<b>").text("Definition: "));
	$.MessageBox({
		message: $("<div>").addClass("definition").append($title).append($msg)
	});
}
