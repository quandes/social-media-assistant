const express = require("express");

const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Configuration, OpenAIApi } = require("openai");

const database = require("./database");

var jwt = require("jsonwebtoken");
const jwt_secret = "gh45gdh452fgh12dfg1f52g1e5g1df5g";
const cookieParser = require('cookie-parser')

const keyword_extractor = require("keyword-extractor");
const cheerio = require("cheerio");

const port = 3011;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());;
app.use(cors());

app.listen(port, () => {
  console.log(`Applikation erreichbar unter http://localhost:${port}`);
});

const authMiddleware = function (req, res, next) {
  console.log(req.headers);
  if (!req.headers["authentication"]) {
    res.sendStatus(401);
    return;
  }
  req.userId = jwt.decode(req.headers["authentication"]).userId ?? 0 ;
  next();
};

app.get("/", (req, res) => {
  console.log("backend called ");
  res.send("System is running!");
});


app.post("/gpt", authMiddleware, async (req, res) => {
  console.log(`User ID: ${req.userId}`);
  var gptCompletion = await gptRequest(req);
  res.send(gptCompletion);
});

async function gptRequest(req) {
  console.log("prompt: " + req.body.prompt);

  var keywords = "";
  if (req.body.keyword_url) {
    keywords = await getKeywordsFromUrl(req.body.keyword_url);
  }

  const openaiConfig = new Configuration({
    apiKey: req.body.apiKey,
  });
  const openai = new OpenAIApi(openaiConfig);

  let titel = req.body.pragraphTitel;
  var prompt = req.body.prompt;
  let platform = req.body.platform;
  let max_tokens = req.body.max_tokens;
  let temperature = req.body.temperature;
  let stiel = req.body.stiel;

  var promptParts = {
    tags: " füge HashTags zur referenzierung in Sozialen Medien hinzu ",
    style: " und in folgendem Stiel: ",
    titel: " mit: " + titel + "  als Titel. "
  }

  if (platform == "Instagram") {
    if (typeof titel === "string") {
      prompt = "schreibe einen Instagram post über: " + prompt + promptParts.titel + promptParts.style + stiel + 'füge an passenden Stellen eomjis ein.' + promptParts.tags
    } else {
      prompt = "write a Instagram post about: " + prompt + promptParts.style + stiel + 'füge an passenden Stellen eomjis ein.' + promptParts.tags
    }
  }
  if (platform == "Blogartikel") {
    if (typeof titel === "string") {
      prompt = "schreibe einen Blog post über: " + prompt + promptParts.titel + promptParts.style + stiel;
    } else {
      prompt = "write a Blog post about: " + prompt + promptParts.style + stiel + promptParts.tags;
    }
  }
  if (platform == "LinkedIn") {
    if (typeof titel === "string") {
      prompt = "schreibe einen LinkedIn post über: " + prompt + promptParts.titel + promptParts.style + stiel + promptParts.tags;
    }
    else {
      prompt = "write a LinkedIn post about: " + prompt + promptParts.style + stiel + promptParts.tags;
    }
  }
  console.log(prompt)
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: max_tokens,
    top_p: temperature,
    messages: [{ "role": "system", "content": "Du bist ein AI-Programm das automatisch Texte für soziale Medien zu generieren. Deine Aufgaben: Erstellung von Posts, Tweets, Kommentaren und anderen Arten von Texten, die auf den spezifischen Anforderungen und Parametern basieren, die von meinen Benutzern angegeben werden. Generie Die Texte auf deutsch" },
    { role: "user", "content": prompt }],
  });
  var gptCompletion = completion.data.choices[0].message.content.trim();
  console.log("completion: " + gptCompletion);
  await dataToJSON(req.userId, gptCompletion, req.body.prompt, keywords);
  return gptCompletion;
}

async function dataToJSON(userId, gptData, input, keywords) {
  await database.pushHistory({
    userId: userId,
    prompt: input,
    response: gptData,
    keywords: typeof keywords === "string" ? "" : keywords.join(";"),
  });
  return;

}

app.get("/getHistory", authMiddleware, async (req, res) => {
  const history = await database.getHistory(req.userId);
  if (history === false) {
    res.json([]);
    return
  }
  res.json(history);

});

app.post("/specificHistory", async (req, res) => {
  const historyId = req.body.historyIndex;
  const history = await database.getHistoryById(historyId);
  if (history === false) {
    res.json({});
    return
  }
  res.json(history);
});

app.post("/newUser", async (req, res) => {
  const user = await database.register(req.body.email, req.body.password);
  if (user) {
    res.sendStatus(201);
    return;
  }
  res.sendStatus(400);
});

app.post("/userCheckUp", async (req, res) => {
  const result = await database.login(req.body.email, req.body.password);

  if (result) {
    const signedToken = jwt.sign({ userId: result.id }, jwt_secret);
    res.status(201).json({
      token: signedToken,
    });
    return;
  }
  res.sendStatus(401);
});


async function getKeywordsFromUrl(url) {
  //uebergabe der angefragten url
  const { data: html } = await axios.get(url);
  
  //ineressante Komponenten der Webseite
  var title;
  var crawledData,h1,h2, paragraphs = {};

  //Objekt zum halten der geladenen html-page
  const $ = cheerio.load(html);

  //Abruf der header.titel informationen
  title = $("title").text();

  //traversieren der Webseiten nach h1, h2 und paragrapoh Elementen. 
  //Abruf der in den Elementen enthaltenen Informationen.
  $("h1").each((index, elem) => {
    h1[index] = $(elem).text();
  });
  $("h2").each((index, elem) => {
    h2[index] = $(elem).text();
  });
  $("p").each((index, elem) => {
    paragraphs[index] = $(elem).text();
  });

  crawledData["title"] = title;
  crawledData["h1"] = h1;
  crawledData["h2"] = h2;
  crawledData["paragraphs"] = paragraphs;

  var h1String;
  var h2String;
  var paragraphString;
  var combinedString;
  for (var key in h1) {
    h1String += h1[key];
  }
  for (var key in h2) {
    h2String += h2[key];
  }
  for (var key in paragraphs) {
    paragraphString += paragraphs[key];
  }
  combinedString = title + h1String + h2String + paragraphString;

  var crawledSrtingData = JSON.stringify(crawledData);
  crawledSrtingData.replace("\n", "");
  const extraction_result = await keyword_extractor.extract(combinedString, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false,
  });
  console.log(extraction_result);
  //dataToJSON(extraction_result);
  return extraction_result;
}
