//how to highlight all:
// Subjunctives:       $(":regex(data-morphology-two,^...S)").css("background-color", "red") //2APS-P--
// Future Indicatives: $(":regex(data-morphology-two,^.F.I)").css("background-color", "blue") //2FMI-P--

var primarycolours = ["SteelBlue", "Aqua", "MediumTurquoise", "PaleTurquoise", "CadetBlue", "LightSteelBlue", "SkyBlue"];
var secondarycolours = ["Lime", "GreenYellow", "LimeGreen", "PaleGreen", "OliveDrab", "SeaGreen", "ForestGreen"];
var tertiarycolours = ["Crimson", "FireBrick", "OrangeRed", "IndianRed", "LightCoral", "Salmon", "LightSalmon"];
var fourthcolours = ["DarkOrange", "Gold", "Khaki", "DarkKhaki", "PaleGoldenrod", "Moccasin", "PeachPuff"];
var fifthcolours = ["BlueViolet", "Purple", "Thistle", "Plum", "Violet", "MediumOrchid", "MediumPurple"];

var bibleData;

function highlight()
{
	$(".highlight").css("background-color", "transparent");
	$(".highlight").removeClass("highlight");

	textboxids = ["#primaryhighlight", "#secondaryhighlight", "#tertiaryhighlight", "#fourthhighlight", "#fifthhighlight"];
	colourarrays = [primarycolours, secondarycolours, tertiarycolours, fourthcolours, fifthcolours];

	for (var i in textboxids)
	{
		highlightHelper($(textboxids[i]).val().split(";"), colourarrays[i]);
		localStorage.setItem(textboxids[i], $(textboxids[i]).val());

		if ($(textboxids[i]).val().split(";").length > colourarrays[i].length)
			$(textboxids[i] + "_warning").css("visibility", "visible");
		else
			$(textboxids[i]+ "_warning").css("visibility", "hidden");
	}
}

function highlightHelper(numbers, colours)
{
	for (var val in numbers)
	{
		if (numbers[val])
		{
			$("span[strongsnumber='"+ numbers[val] + "']").css("background-color", colours[val % colours.length]);
			$("span[strongsnumber='"+ numbers[val] + "']").addClass("highlight");
		}
	}
}

function displaydata(object, destination)
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
		$(destination).text(dataWord.lemma);
	}
}

function inArray(elem, array) {
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}
	return -1;
}

function clearHighlights()
{
	$("#primaryhighlight").val("");
	$("#secondaryhighlight").val("");
	$("#tertiaryhighlight").val("");
	$("#fourthhighlight").val("");
	$("#fifthhighlight").val("");
	highlight();
}


$(document).ready(function() {

	$.getJSON("json/matthew.json", function(data){
		bibleData = data;
		data.chapters.forEach(function(chapter){
			if (chapter.verses.length === 1)
				return;
			var $chElement = $("<p>")
				.addClass("chapter")
				.attr("data-chapter-number", chapter.chapter);
			chapter.verses.forEach(function(verse){
				var $vElement = $("<span>")
					.addClass("verse")
					.attr("data-verse-number", verse.verse);
				verse.words.forEach(function(word){
					$vElement.append(
						$("<span>")
						  .append(word.wordInText + ' ')
						  .attr("data-word-index-in-verse", word.wordIndexInVerse)
						  .attr("data-lemma", word.lemma)
						  .attr("data-morphology-one", word.morphologyOne)
						  .attr("data-morphology-two", word.morphologyTwo)
					);
				});
				$chElement.append($vElement);
			});
			$(".contentmain").append($chElement);
		});
	});

	$("#primaryhighlight").val(localStorage.getItem("#primaryhighlight"));
	$("#secondaryhighlight").val(localStorage.getItem("#secondaryhighlight"));
	$("#tertiaryhighlight").val(localStorage.getItem("#tertiaryhighlight"));
	$("#fourthhighlight").val(localStorage.getItem("#fourthhighlight"));
	$("#fifthhighlight").val(localStorage.getItem("#fifthhighlight"));

	$(".contentmain").css("top", $("#mkhead").outerHeight());
	highlight();

	//$('span[tag^="N-N"]').css("background-color", "#4fa");
	//$('span[tag^="V-P"]').css("background-color", "#843");
	//$('span[tag^="V-PAM-3S"]').css("background-color", "#f88");

	$("#loading").css("display", "none");


}).on("click", "span", function(){
	displaydata($(this), "#staticdatadisplayer");

	if ($(this).attr("strongsnumber"))
	{
		highlightDestination = $("input[name=autoadd]:checked").attr("value");
		if (highlightDestination != "null")
		{
			strongsnumber = $(this).attr("strongsnumber");

			//remove from textbox if there already
			removed = false;
			arr = [$("#primaryhighlight").val().split(";"), $("#secondaryhighlight").val().split(";"), $("#tertiaryhighlight").val().split(";"), $("#fourthhighlight").val().split(";"), $("#fifthhighlight").val().split(";")];
			for (var i in arr)
			{
				if (arr[i].length > 0)
				{
					if (inArray(strongsnumber, arr[i]) >= 0)
					{
						arr[i].splice(inArray(strongsnumber, arr[i]), 1);
						removed = true;
					}
				}
			}

			if (!removed)
			{
					prepend = "";
					//alert ($(highlightDestination).val().substr(-1));
					if ($(highlightDestination).val() !== "")
						prepend = $(highlightDestination).val() + ";";
					//else if ()
						//prepend = ( != ";" ? )
					$(highlightDestination).val(prepend + strongsnumber);
					//ADd a check to remove duplicates
					highlight();
				}
			else
			{
				$("#primaryhighlight").val(arr[0].join(";"));
				$("#secondaryhighlight").val(arr[1].join(";"));
				$("#tertiaryhighlight").val(arr[2].join(";"));
				$("#fourthhighlight").val(arr[3].join(";"));
				$("#fifthhighlight").val(arr[4].join(";"));
				highlight();
			}
		}
	}
}).on("mouseover", ".verse > span", function(e) {
	var verseNumber = $(e.target).parent().attr("data-verse-number");
	var chapterNumber = $(e.target).parent().parent().attr("data-chapter-number");

	$("#location").html(chapterNumber + ":" + verseNumber);

	displaydata($(this), "#dynamicdatadisplayer");
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
