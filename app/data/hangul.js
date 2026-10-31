// Hangul letters: consonants (C), double consonants (D), vowels (V), compound vowels (W)
var C=[
["ㄱ","g/k","가","ga",["soft g or k","g","k"],["M25 25H75V80"]],
["ㄴ","n","나","na",["n","n","n"],["M28 20V75H75"]],
["ㄷ","d/t","다","da",["soft d or t","d","t"],["M28 22H72","M28 22V78H72"]],
["ㄹ","r/l","라","ra",["l","r","l"],["M25 20H72V47","M25 47H72","M25 47V78H75"]],
["ㅁ","m","마","ma",["m","m","m"],["M28 22V78","M28 22H72V78","M28 78H72"]],
["ㅂ","b/p","바","ba",["soft b or p","b","p"],["M28 20V80","M72 20V80","M28 50H72","M28 80H72"]],
["ㅅ","s","사","sa",["s or sh","s or sh","t"],["M50 20C48 45 35 62 20 76","M50 20C52 45 65 62 80 76"]],
["ㅇ","ng","아","a",["silent","silent","ng"],["M50 22A28 28 0 1 0 50 78A28 28 0 1 0 50 22"]],
["ㅈ","j","자","ja",["low ch","j","t"],["M25 22H75","M50 22C48 45 35 62 20 78","M50 42C55 58 65 70 80 78"]],
["ㅊ","ch","차","cha",["ch","ch","t"],["M40 14H60","M25 30H75","M50 30C48 50 35 65 20 80","M50 48C55 60 65 72 80 80"]],
["ㅋ","k","카","ka",["strong k","k","k"],["M25 25H75V80","M25 52H75"]],
["ㅌ","t","타","ta",["strong t","t","t"],["M28 20H72","M28 50H72","M28 20V80H72"]],
["ㅍ","p","파","pa",["strong p","p","p"],["M22 20H78","M38 20V80","M62 20V80","M22 80H78"]],
["ㅎ","h","하","ha",["h","h (often not clear)","t"],["M42 12H58","M25 28H75","M50 44A18 18 0 1 0 50 80A18 18 0 1 0 50 44"]]
];
var D=[["ㄲ","kk","까","kka",["kk","kk","k"],0],["ㄸ","tt","따","tta",["tt","tt","–"],2],["ㅃ","pp","빠","ppa",["pp","pp","–"],5],["ㅆ","ss","싸","ssa",["ss","ss","t"],6],["ㅉ","jj","짜","jja",["jj","jj","–"],8]];
var V=[
["ㅏ","a","아","a",["M40 10V90","M40 50H65"]],
["ㅑ","ya","야","ya",["M40 10V90","M40 35H65","M40 65H65"]],
["ㅓ","eo","어","eo",["M28 50H58","M60 10V90"]],
["ㅕ","yeo","여","yeo",["M28 35H58","M28 65H58","M60 10V90"]],
["ㅣ","i","이","i",["M50 10V90"]],
["ㅗ","o","오","o",["M50 28V58","M15 58H85"]],
["ㅛ","yo","요","yo",["M35 28V58","M65 28V58","M15 58H85"]],
["ㅜ","u","우","u",["M15 42H85","M50 42V72"]],
["ㅠ","yu","유","yu",["M15 30H85","M35 30V70","M65 30V70"]],
["ㅡ","eu","으","eu",["M15 50H85"]],
["ㅐ","ae","애","ae",["M34 10V90","M34 50H54","M58 10V90"]],
["ㅒ","yae","얘","yae",["M32 10V90","M32 35H52","M32 65H52","M56 10V90"]],
["ㅔ","e","에","e",["M18 50H42","M42 10V90","M64 10V90"]],
["ㅖ","ye","예","ye",["M14 35H36","M14 65H36","M38 10V90","M64 10V90"]]
];
var W=[["ㅘ","wa","와","wa","ㅗ","ㅏ"],["ㅙ","wae","왜","wae","ㅗ","ㅐ"],["ㅚ","oe","외","oe","ㅗ","ㅣ"],["ㅝ","wo","워","wo","ㅜ","ㅓ"],["ㅞ","we","웨","we","ㅜ","ㅔ"],["ㅟ","wi","위","wi","ㅜ","ㅣ"],["ㅢ","ui","의","ui","ㅡ","ㅣ"]];


// Example words
var EX={
"ㄱ":{name:["기역","gi-yeok"],pos:[["고기","gogi","meat"],["가게","gage","store"],["약","yak","medicine"]]},
"ㄴ":{name:["니은","ni-eun"],pos:[["나비","nabi","butterfly"],["하나","hana","one"],["손","son","hand"]]},
"ㄷ":{name:["디귿","di-geut"],pos:[["도시","dosi","city"],["바다","bada","sea"],["믿","mit","stem of 믿다, to believe"]]},
"ㄹ":{name:["리을","ri-eul"],pos:[["라디오","radio","radio"],["오리","ori","duck"],["물","mul","water"]]},
"ㅁ":{name:["미음","mi-eum"],pos:[["마음","maeum","heart"],["어머니","eomeoni","mother"],["김","gim","seaweed"]]},
"ㅂ":{name:["비읍","bi-eup"],pos:[["바지","baji","pants"],["가방","gabang","bag"],["밥","bap","rice"]]},
"ㅅ":{name:["시옷","si-ot"],pos:[["소리","sori","sound"],["가수","gasu","singer"],["빗","bit","comb"]]},
"ㅇ":{name:["이응","i-eung"],pos:[["우유","uyu","milk"],["나이","nai","age"],["공","gong","ball"]]},
"ㅈ":{name:["지읒","ji-eut"],pos:[["자동차","jadongcha","car"],["오징어","ojingeo","squid"],["낮","nat","daytime"]]},
"ㅊ":{name:["치읓","chi-eut"],pos:[["치마","chima","skirt"],["어차피","eochapi","anyway"],["꽃","kkot","flower"]]},
"ㅋ":{name:["키읔","ki-euk"],pos:[["코","ko","nose"],["재킷","jaekit","jacket"],["부엌","bueok","kitchen"]]},
"ㅌ":{name:["티읕","ti-eut"],pos:[["토마토","tomato","tomato"],["파티","pati","party"],["밭","bat","field"]]},
"ㅍ":{name:["피읖","pi-eup"],pos:[["포도","podo","grape"],["우표","upyo","stamp"],["숲","sup","forest"]]},
"ㅎ":{name:["히읗","hi-eut"],pos:[["하늘","haneul","sky"],["아홉","ahop","nine"],["좋","jot","stem of 좋다, to be good"]]}
};

EX["ㄲ"]={name:["쌍기역","ssang-gi-yeok"],pos:[["까치","kkachi","magpie"],["토끼","tokki","rabbit"],["밖","bak","outside"]]};
EX["ㄸ"]={name:["쌍디귿","ssang-di-geut"],pos:[["떡","tteok","rice cake"],["이따가","ittaga","later"],"none"]};
EX["ㅃ"]={name:["쌍비읍","ssang-bi-eup"],pos:[["빵","ppang","bread"],["오빠","oppa","older brother (said by a woman)"],"none"]};
EX["ㅆ"]={name:["쌍시옷","ssang-si-ot"],pos:[["쌀","ssal","rice (raw)"],["아저씨","ajeossi","middle-aged man",2],["있","it","stem of 있다, to be there"]]};
EX["ㅉ"]={name:["쌍지읒","ssang-ji-eut"],pos:[["짜장면","jjajangmyeon","black bean noodles"],["이쪽","ijjok","this side"],"none"]};
var VEX={
"ㅏ":[["아기","agi","baby"],["나무","namu","tree"],["바다","bada","sea"]],
"ㅑ":[["야구","yagu","baseball"],["야채","yachae","vegetable"],["야간","yagan","night time"]],
"ㅓ":[["어머니","eomeoni","mother"],["거미","geomi","spider"],["어제","eoje","yesterday"]],
"ㅕ":[["여자","yeoja","woman"],["여기","yeogi","here"],["여우","yeou","fox"]],
"ㅗ":[["코","ko","nose"],["모자","moja","hat"],["오리","ori","duck"]],
"ㅛ":[["요리","yori","cooking"],["교사","gyosa","teacher"],["쇼핑","syoping","shopping"]],
"ㅜ":[["우유","uyu","milk"],["구두","gudu","shoes"],["두부","dubu","tofu"]],
"ㅠ":[["유리","yuri","glass"],["휴지","hyuji","tissue"],["우유","uyu","milk"]],
"ㅡ":[["스키","seuki","ski"],["드라마","deurama","drama"],["그림","geurim","picture"]],
"ㅣ":[["이마","ima","forehead"],["기차","gicha","train"],["치마","chima","skirt"]],
"ㅐ":[["개","gae","dog"],["새","sae","bird"],["배","bae","pear, boat, stomach"]],
"ㅒ":[["얘기","yaegi","talk, story"],["얘","yae","this child"],["걔","gyae","that child"]],
"ㅔ":[["네","ne","yes"],["세수","sesu","washing the face"],["가게","gage","store"]],
"ㅖ":[["시계","sigye","clock, watch"],["예의","yeui","manners"],["계단","gyedan","stairs"]],
"ㅘ":[["사과","sagwa","apple"],["과자","gwaja","snack"],["화장실","hwajangsil","toilet"]],
"ㅙ":[["왜","wae","why"],["돼지","dwaeji","pig"]],
"ㅚ":[["회사","hoesa","company"],["외국","oeguk","foreign country"],["되다","doeda","to become"]],
"ㅝ":[["뭐","mwo","what"],["추워요","chuwoyo","(it is) cold"],["더워요","deowoyo","(it is) hot"]],
"ㅞ":[["웨이터","weiteo","waiter"],["스웨터","seuweteo","sweater"]],
"ㅟ":[["위","wi","top, above"],["귀","gwi","ear"],["쥐","jwi","mouse"]],
"ㅢ":[["의사","uisa","doctor"],["의자","uija","chair"],["회의","hoeui","meeting"]]
};
