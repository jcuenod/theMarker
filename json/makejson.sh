#!/bin/bash

# book: $book,
# chapter: $chapter,
# verse: $verse,


chapterJson=""
currentVerse=0
word=0
flatIndex=0
currentChapter=0
book=0
while read -r line  # For as many lines as the input file has ...
do
    book=$((10#${line:0:2}))
    chapter=$((10#${line:2:2}))
    verse=$((10#${line:4:2}))
    ((flatIndex++))
    if [ $verse = $currentVerse ]
    then
        ((word++))
    else
        if [ ${#verseJson} -gt 0 ]
        then
            verseJson="$verseJson, "
        fi
        verseJson="$verseJson {
            \"verse\": $currentVerse,
            \"words\": [$wordJson]
        }"
        currentVerse=$verse
        wordJson=""
        word=0
    fi
    if [ $chapter != $currentChapter ]
    then
        if [ ${#chapterJson} -gt 0 ]
        then
            chapterJson="$chapterJson, "
        fi
        chapterJson="$chapterJson {
            \"chapter\": $currentChapter,
            \"verses\": [$verseJson]
        }"

        currentChapter=$chapter
        verseJson=""
    fi

    # echo "$word"

    morphologyOne=$(echo $line| cut -d' ' -f 2)
    morphologyTwo=$(echo $line| cut -d' ' -f 3)
    wordInText=$(echo $line| cut -d' ' -f 4)
    lemma=$(echo $line| cut -d' ' -f 7)
    # echo "$wordInText"
    # echo "$lemma"


    if [ ${#wordJson} -gt 0 ]
    then
        wordJson="$wordJson, "
    fi
    wordJson="$wordJson {
        \"flatIndex\": $flatIndex,
        \"wordIndexInVerse\": $word,
        \"lemma\": \"$lemma\",
        \"wordInText\": \"$wordInText\",
        \"morphologyOne\": \"$morphologyOne\",
        \"morphologyTwo\": \"$morphologyTwo\"
    }"
done < "$1"

if [ ${#verseJson} -gt 0 ]
then
    verseJson="$verseJson, {
        \"verse\": $currentVerse,
        \"words\": [$wordJson]
    }"
fi
if [ ${#chapterJson} -gt 0 ]
then
    chapterJson="$chapterJson, {
        \"chapter\": $currentChapter,
        \"verses\": [$verseJson]
    }"
fi
bookJson="{
    \"book\": $book,
    \"chapters\": [$chapterJson]
}"
echo $bookJson
# INPUT='someletters_12345_moreleters.ext'
# SUBSTRING=$(echo $INPUT| cut -d' ' -f 2)
# echo $SUBSTRING

exit
