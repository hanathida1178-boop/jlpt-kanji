
import { Deck } from './types';

export const N4_KANJI_DATA = [
  { id: 1, kanji: "私", meaning: "ကျွန်ုပ် (I/Me)", onyomi: "シ", kunyomi: "わたし", examples: [{ word: "私", reading: "watashi", mean: "ကျွန်ုပ်" }, { word: "私立", reading: "shiritsu", mean: "ပုဂ္ဂလိက" }] },
  { id: 2, kanji: "親", meaning: "မိဘ (Parent)", onyomi: "シン", kunyomi: "おや", examples: [{ word: "両親", reading: "ryoushin", mean: "မိဘနှစ်ပါး" }, { word: "親切", reading: "shinsetsu", mean: "ကြင်နာသော" }] },
  { id: 3, kanji: "切", meaning: "ဖြတ်သည် (Cut)", onyomi: "セツ", kunyomi: "きる", examples: [{ word: "大切", reading: "taisetsu", mean: "အရေးကြီးသော" }, { word: "切手", reading: "kitte", mean: "တံဆိပ်ခေါင်း" }] },
  { id: 4, kanji: "手", meaning: "လက် (Hand)", onyomi: "シュ", kunyomi: "て", examples: [{ word: "歌手", reading: "kashu", mean: "အဆိုတော်" }, { word: "上手", reading: "jouzu", mean: "ကျွမ်းကျင်သော" }] },
  { id: 5, kanji: "家", meaning: "အိမ် (House)", onyomi: "カ/ケ", kunyomi: "いえ/や", examples: [{ word: "家族", reading: "kazoku", mean: "မိသားစု" }, { word: "家主", reading: "yanushi", mean: "အိမ်ရှင်" }] },
  { id: 6, kanji: "族", meaning: "မျိုးနွယ် (Tribe/Family)", onyomi: "ゾク", kunyomi: "-", examples: [{ word: "家族", reading: "kazoku", mean: "မိသားစု" }, { word: "親族", reading: "shinzoku", mean: "ဆွေမျိုး" }] },
  { id: 7, kanji: "母", meaning: "အမေ (Mother)", onyomi: "ボ", kunyomi: "はは", examples: [{ word: "お母さん", reading: "okaasan", mean: "အမေ" }, { word: "母校", reading: "bokou", mean: "ကျောင်းတော်" }] },
  { id: 8, kanji: "父", meaning: "အဖေ (Father)", onyomi: "フ", kunyomi: "ちち", examples: [{ word: "お父さん", reading: "otousan", mean: "အဖေ" }, { word: "父母", reading: "fubo", mean: "မိဘ" }] },
  { id: 9, kanji: "兄", meaning: "အစ်ကို (Older Brother)", onyomi: "キョウ", kunyomi: "あに", examples: [{ word: "お兄さん", reading: "oniisan", mean: "အစ်ကို" }, { word: "兄弟", reading: "kyoudai", mean: "ညီအစ်ကို" }] },
  { id: 10, kanji: "姉", meaning: "အစ်မ (Older Sister)", onyomi: "シ", kunyomi: "あね", examples: [{ word: "お姉さん", reading: "oneesan", mean: "အစ်မ" }, { word: "姉妹", reading: "shimai", mean: "ညီအစ်မ" }] },
  { id: 11, kanji: "弟", meaning: "ညီ/မောင် (Younger Brother)", onyomi: "ダイ", kunyomi: "おとうと", examples: [{ word: "弟子", reading: "deshi", mean: "တပည့်" }, { word: "義弟", reading: "gitei", mean: "ယောက္ခထီး" }] },
  { id: 12, kanji: "妹", meaning: "ညီမ/နှမ (Younger Sister)", onyomi: "マイ", kunyomi: "いもうと", examples: [{ word: "姉妹", reading: "shimai", mean: "ညီအစ်မ" }] },
  { id: 13, kanji: "勉", meaning: "ကြိုးစားသည် (Exertion)", onyomi: "ベン", kunyomi: "つと.める", examples: [{ word: "勉強", reading: "benkyou", mean: "စာသင်သည်" }] },
  { id: 14, kanji: "強", meaning: "သန်မာသော (Strong)", onyomi: "キョウ", kunyomi: "つよ.い", examples: [{ word: "勉強", reading: "benkyou", mean: "စာသင်သည်" }, { word: "強力", reading: "kyouryoku", mean: "အားကောင်းသော" }] },
  { id: 15, kanji: "道", meaning: "လမ်း (Road/Way)", onyomi: "ドウ", kunyomi: "みち", examples: [{ word: "道路", reading: "douro", mean: "လမ်းမကြီး" }, { word: "茶道", reading: "sadou", mean: "လက်ဖက်ရည်ဖျော်နည်း" }] },
  { id: 16, kanji: "目", meaning: "မျက်စိ (Eye)", onyomi: "モク", kunyomi: "め", examples: [{ word: "目的", reading: "mokuteki", mean: "ရည်ရွယ်ချက်" }, { word: "目次", reading: "mokuji", mean: "မာတိကာ" }] },
  { id: 17, kanji: "耳", meaning: "နား (Ear)", onyomi: "ジ", kunyomi: "みみ", examples: [{ word: "耳鼻科", reading: "jibika", mean: "နားနှာခေါင်းလည်ချောင်းဌာန" }] },
  { id: 18, kanji: "口", meaning: "ပါးစပ် (Mouth)", onyomi: "コウ", kunyomi: "くち", examples: [{ word: "人口", reading: "jinkou", mean: "လူဦးရေ" }, { word: "入口", reading: "iriguchi", mean: "အပေါက်" }] },
  { id: 19, kanji: "足", meaning: "ခြေထောက် (Foot/Leg)", onyomi: "ソク", kunyomi: "あし", examples: [{ word: "遠足", reading: "ensoku", mean: "အပန်းဖြေခရီး" }, { word: "足りる", reading: "tariru", mean: "လုံလောက်သည်" }] },
  { id: 20, kanji: "立", meaning: "ရပ်သည် (Stand)", onyomi: "リツ", kunyomi: "た.つ", examples: [{ word: "国立", reading: "kokuritsu", mean: "နိုင်ငံတော်ပိုင်" }, { word: "建立", reading: "kenryu", mean: "တည်ဆောက်သည်" }] },
  // Adding more N4 standard Kanji (Condensed for performance but covering core items)
  { id: 21, kanji: "体", meaning: "ခန္ဓာကိုယ် (Body)", onyomi: "タイ", kunyomi: "からだ", examples: [{ word: "体力", reading: "tairyoku", mean: "ကိုယ်ကာယခွန်အား" }] },
  { id: 22, kanji: "頭", meaning: "ခေါင်း (Head)", onyomi: "トウ", kunyomi: "あたま", examples: [{ word: "頭痛", reading: "zutsuu", mean: "ခေါင်းကိုက်ခြင်း" }] },
  { id: 23, kanji: "顔", meaning: "မျက်နှာ (Face)", onyomi: "ガン", kunyomi: "かお", examples: [{ word: "洗顔", reading: "sengan", mean: "မျက်နှာသစ်ခြင်း" }] },
  { id: 24, kanji: "声", meaning: "အသံ (Voice)", onyomi: "セイ", kunyomi: "こえ", examples: [{ word: "声明", reading: "seimei", mean: "ထုတ်ပြန်ချက်" }] },
  { id: 25, kanji: "心", meaning: "နှလုံးသား (Heart/Mind)", onyomi: "シン", kunyomi: "こころ", examples: [{ word: "心配", reading: "shinpai", mean: "စိတ်ပူသည်" }] },
  { id: 26, kanji: "思", meaning: "ထင်သည်/တွေးသည် (Think)", onyomi: "シ", kunyomi: "おも.う", examples: [{ word: "思い出", reading: "omoide", mean: "အမှတ်တရ" }] },
  { id: 27, kanji: "知", meaning: "သိသည် (Know)", onyomi: "チ", kunyomi: "し.る", examples: [{ word: "知識", reading: "chishiki", mean: "ဗဟုသုတ" }] },
  { id: 28, kanji: "答", meaning: "အဖြေ (Answer)", onyomi: "トウ", kunyomi: "こた.える", examples: [{ word: "回答", reading: "kaitou", mean: "အဖြေလွှာ" }] },
  { id: 29, kanji: "考", meaning: "စဉ်းစားသည် (Consider)", onyomi: "コウ", kunyomi: "かんが.える", examples: [{ word: "思考", reading: "shikou", mean: "အတွေးအခေါ်" }] },
  { id: 30, kanji: "楽", meaning: "ပျော်ရွှင်သော/လွယ်ကူသော (Enjoy)", onyomi: "ガク/ラク", kunyomi: "たの.しい", examples: [{ word: "音楽", reading: "ongaku", mean: "ဂီတ" }, { word: "楽", reading: "raku", mean: "သက်တောင့်သက်သာ" }] },
  { id: 31, kanji: "歌", meaning: "သီချင်း (Song)", onyomi: "カ", kunyomi: "うた", examples: [{ word: "歌手", reading: "kashu", mean: "အဆိုတော်" }] },
  { id: 32, kanji: "音", meaning: "အသံ (Sound)", onyomi: "オン", kunyomi: "おと", examples: [{ word: "発音", reading: "hatsuon", mean: "အသံထွက်" }] },
  { id: 33, kanji: "学", meaning: "ပညာသင်သည် (Study)", onyomi: "ガク", kunyomi: "まな.ぶ", examples: [{ word: "学生", reading: "gakusei", mean: "ကျောင်းသား" }] },
  { id: 34, kanji: "校", meaning: "ကျောင်း (School)", onyomi: "コウ", kunyomi: "-", examples: [{ word: "小学校", reading: "shougakkou", mean: "မူလတန်းကျောင်း" }] },
  { id: 35, kanji: "教", meaning: "သင်ကြားသည် (Teach)", onyomi: "キョウ", kunyomi: "おし.える", examples: [{ word: "教室", reading: "kyoushitsu", mean: "စာသင်ခန်း" }] },
  { id: 36, kanji: "室", meaning: "အခန်း (Room)", onyomi: "シツ", kunyomi: "-", examples: [{ word: "茶室", reading: "chashitsu", mean: "လက်ဖက်ရည်ခန်း" }] },
  { id: 37, kanji: "習", meaning: "သင်ယူသည် (Learn)", onyomi: "シュウ", kunyomi: "なら.う", examples: [{ word: "予習", reading: "yoshuu", mean: "ကြိုတင်လေ့ကျင့်ခြင်း" }] },
  { id: 38, kanji: "英", meaning: "အင်္ဂလိပ် (English)", onyomi: "エイ", kunyomi: "-", examples: [{ word: "英語", reading: "eigo", mean: "အင်္ဂလိပ်စာ" }] },
  { id: 39, kanji: "国", meaning: "နိုင်ငံ (Country)", onyomi: "コク", kunyomi: "くに", examples: [{ word: "韓国", reading: "kankoku", mean: "ကိုးရီးယား" }] },
  { id: 40, kanji: "地", meaning: "မြေပြင် (Earth)", onyomi: "チ/ジ", kunyomi: "-", examples: [{ word: "地下鉄", reading: "chikatetsu", mean: "မြေအောက်ရထား" }] }
];

// Helper to chunk the data into separate decks
const chunkArray = (arr: any[], size: number) => 
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const chunks = chunkArray(N4_KANJI_DATA, 20);

export const DEFAULT_DECKS: Deck[] = chunks.map((cards, index) => ({
  id: `n4-core-v2-p${index + 1}`,
  title: `N4 Core Kanji Part ${index + 1}`,
  cards: cards
}));
