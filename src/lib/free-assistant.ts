export type FreeReplyLanguage = "auto" | "ur" | "hi" | "pa" | "en" | "roman-ur";

const REPLIES = {
  en: {
    welcome: "Hello! I am AI Buddy. I can explain the app, its free features and how to share it. For new writing or complex questions, the full AI model must be connected.",
    features: "AI Buddy's planned tools include multilingual chat, basic business and music promotion drafts, customer-reply drafts and simple software planning. Some advanced features are still being built, so I will not claim they are live until tested.",
    pricing: "The basic demo is intended to be free for testing. Customer packages and prices are not activated yet. The owner will confirm a price before any paid work. No payment is being taken here.",
    share: "To invite someone, copy the AI Buddy website link and share it with them on WhatsApp, Facebook or email. They open the link in their browser. AI Buddy does not send messages to people automatically.",
    promo: "✨ Meet AI Buddy! A friendly digital helper for everyday questions, simple business ideas and marketing drafts. Try the demo and tell us what should improve. Open the website to test it. Features may be limited while we build and test the service.",
    provider: "This request needs the full AI model, which is not connected right now. The free helper can answer app, demo and package questions and prepare a few fixed promotional templates. No paid service will be switched on automatically.",
  },
  hi: {
    welcome: "नमस्ते! मैं AI Buddy हूँ। मैं ऐप, मुफ्त सुविधाओं और इसे शेयर करने का तरीका समझा सकता हूँ। नए लेखन और मुश्किल सवालों के लिए असली AI मॉडल का कनेक्शन चाहिए।",
    features: "AI Buddy में हिंदी-उर्दू चैट, छोटे कारोबार और संगीत के प्रचार के ड्राफ्ट, ग्राहक के जवाब और छोटे सॉफ्टवेयर की योजना शामिल करने का लक्ष्य है। कुछ सुविधाएँ अभी बन रही हैं; जाँच होने से पहले मैं उन्हें चालू नहीं बताऊँगा।",
    pricing: "शुरुआती डेमो टेस्ट के लिए मुफ्त रखने का प्लान है। ग्राहक पैकेज और कीमतें अभी चालू नहीं हैं। किसी भी पैसे वाले काम से पहले मालिक कीमत बताएगा। यहाँ कोई भुगतान नहीं लिया जा रहा।",
    share: "किसी को बुलाने के लिए AI Buddy वेबसाइट का लिंक कॉपी करके WhatsApp, Facebook या ईमेल पर भेजें। वे लिंक खोलकर ब्राउज़र में टेस्ट कर सकते हैं। AI Buddy अपने आप किसी को मैसेज नहीं भेजता।",
    promo: "✨ मिलिए AI Buddy से! रोज़मर्रा के सवालों, छोटे बिज़नेस आइडिया और मार्केटिंग मैसेज के ड्राफ्ट बनाने वाला डिजिटल साथी। डेमो आज़माएँ और बताएँ कि क्या बेहतर होना चाहिए। वेबसाइट खोलकर टेस्ट करें। बनाते और जाँचते समय कुछ सुविधाएँ सीमित हो सकती हैं।",
    provider: "इस सवाल के लिए असली AI मॉडल चाहिए, जो अभी जुड़ा नहीं है। फ्री हेल्पर ऐप, डेमो और पैकेज के सवालों के जवाब और कुछ तय प्रचार मैसेज बना सकता है। कोई पैसे वाली सेवा अपने आप चालू नहीं होगी।",
  },
  ur: {
    welcome: "السلام علیکم! میں AI Buddy ہوں۔ میں ایپ، مفت سہولتوں اور اسے شیئر کرنے کا طریقہ سمجھا سکتا ہوں۔ نئے اور مشکل سوالات کے لیے اصل AI ماڈل کا کنکشن ضروری ہے۔",
    features: "AI Buddy میں اردو ہندی چیٹ، چھوٹے کاروبار اور موسیقی کی تشہیر کے مسودے، گاہکوں کے جواب اور سادہ سافٹ ویئر کی منصوبہ بندی شامل کرنے کا ارادہ ہے۔ کچھ سہولتیں ابھی بن رہی ہیں؛ ٹیسٹ سے پہلے انہیں فعال نہیں کہوں گا۔",
    pricing: "ابتدائی ڈیمو ٹیسٹ کے لیے مفت رکھنے کا منصوبہ ہے۔ گاہکوں کے پیکج اور قیمتیں ابھی فعال نہیں۔ کسی بھی معاوضے والے کام سے پہلے مالک قیمت بتائے گا۔ یہاں کوئی ادائیگی نہیں لی جا رہی۔",
    share: "کسی کو بلانے کے لیے AI Buddy ویب سائٹ کا لنک کاپی کرکے WhatsApp، Facebook یا ای میل پر بھیجیں۔ وہ لنک کھول کر براؤزر میں ٹیسٹ کر سکتے ہیں۔ AI Buddy خودکار طور پر کسی کو پیغام نہیں بھیجتا۔",
    promo: "✨ AI Buddy سے ملیے! روزمرہ سوالات، چھوٹے کاروباری آئیڈیاز اور مارکیٹنگ پیغامات کے مسودے بنانے والا ڈیجیٹل مددگار۔ ڈیمو آزمائیں اور بتائیں کیا بہتر ہونا چاہیے۔ ویب سائٹ کھول کر ٹیسٹ کریں۔ کچھ سہولتیں ابھی تیاری اور جانچ کے مرحلے میں محدود ہو سکتی ہیں۔",
    provider: "اس سوال کے لیے اصل AI ماڈل درکار ہے جو ابھی منسلک نہیں۔ مفت مددگار ایپ، ڈیمو اور پیکج کے سوالات کے جواب اور چند تیار تشہیری پیغامات دے سکتا ہے۔ کوئی معاوضے والی سروس خودکار طور پر فعال نہیں ہوگی۔",
  },
  "roman-ur": {
    welcome: "Assalam-o-Alaikum! Main AI Buddy hoon. Main app, free features aur share karne ka tareeqa samjha sakta hoon. Naye aur mushkil sawalon ke liye real AI model ka connection chahiye.",
    features: "AI Buddy mein Urdu-Hindi chat, chhote business aur music promotion drafts, customer replies aur simple software planning shamil karne ka plan hai. Kuch features abhi ban rahe hain; test se pehle unhein live nahi kahunga.",
    pricing: "Shuru ka demo test ke liye free rakhne ka plan hai. Customer packages aur prices abhi active nahi. Kisi paid kaam se pehle owner price batayega. Yahan koi payment nahi li ja rahi.",
    share: "Kisi ko invite karne ke liye AI Buddy website ka link copy karke WhatsApp, Facebook ya email par bhejein. Woh link browser mein khol kar test kar sakte hain. AI Buddy khud se kisi ko message nahi bhejta.",
    promo: "✨ AI Buddy se miliye! Rozmarra sawalon, chhote business ideas aur marketing messages ke drafts banane wala digital helper. Demo azmayein aur batayein kya behtar hona chahiye. Website khol kar test karein. Kuch features abhi banne aur test hone tak limited ho sakte hain.",
    provider: "Is sawal ke liye real AI model chahiye jo abhi connect nahi. Free helper app, demo aur packages ke sawalon ke jawab aur kuch tayyar promotional messages de sakta hai. Koi paid service khud se on nahi hogi.",
  },
} as const;

function languageKey(language: FreeReplyLanguage) {
  return language === "ur" || language === "hi" || language === "roman-ur" ? language : "en";
}

/** A predictable, no-provider helper for basic AI Buddy FAQs and a fixed promo draft. */
export function getFreeAssistantReply(message: string, language: FreeReplyLanguage = "auto"): string | null {
  const value = message.toLocaleLowerCase();
  const copy = REPLIES[languageKey(language)];
  if (/^(hi|hello|hey|salam|assalam|السلام|سلام|नमस्ते|ہیلو|ہائے)/iu.test(value.trim())) return copy.welcome;
  if (/(what can (you|it) do|features|کیا کر سکتے|کیا سہولت|کون سے فیچر|क्या कर सकते|कौन सी सुविधा|features kya)/iu.test(value)) return copy.features;
  if (/(price|pricing|package|charges|cost|قیمت|پیکج|کتنے پیسے|कितना पैसा|कीमत|पैकेज)/iu.test(value)) return copy.pricing;
  if (/(share|invite|send.*link|link.*send|لوگوں تک|شیئر|لنک بھیج|लिंक भेज|शेयर)/iu.test(value)) return copy.share;
  if (/(promot|marketing post|advertis|تشہیر|پروموشن|مارکیٹنگ پوسٹ|प्रचार|मार्केटिंग पोस्ट|विज्ञापन)/iu.test(value)) return copy.promo;
  return null;
}

export function getFreeProviderUnavailableReply(language: FreeReplyLanguage = "auto") {
  return REPLIES[languageKey(language)].provider;
}
