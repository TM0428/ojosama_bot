var Extreme = new Array('暑くて死にそう:desuwa:', 'アイスでも食べたいですわね', '日傘でも差しましょうか', 'クーラーは人権でしてよ', '外出したくない:desuwa:', 'こんな日は家で優雅に過ごすべき:desuwa:', '避暑地は無いのかしら');
var Special = new Array('無理い゛い゛い゛い゛い゛・・・:desuwa:', ':ojosama_bot::is::melt:', '暑くて死にそう:desuwa:', 'クーラーは人権でしてよ', '外出したくない:desuwa:', 'こんな日は家で優雅に過ごすべき:desuwa:', '避暑地に逃げますわ');

function main() {
  PosttraQ(makemessage());
  PosttraQ(GetGC_TD());
  PosttraQ(get_traininfo());
  PosttraQ(GetGC_syuukai());
}

function get_traininfo() {
  var url = "https://transit.yahoo.co.jp/traininfo/area/4/";
  var response = UrlFetchApp.fetch(url).getContentText();
  var parser = Parser.data(response).from('<div class="elmTblLstLine">').to('</div>').iterate();
  //var Meguro_line = response.indexOf("東急目黒線");
  //const Tokyu = 5;
  var output = "";
  const item = parser.filter(function(t){
    return t.indexOf('東急目黒線') !== -1;
  })[0];
  Logger.log(item);
  var list = Parser.data(item).from('<tr>').to('</tr>').iterate();
  for(var i=0;i< list.length;i++){
    var data = list[i];
    if(data.indexOf('東急目黒線') !== -1 && data.indexOf('平常運転') === -1){
      output += "目黒線に問題が発生していそうですの。確認してくださいまし。https://transit.yahoo.co.jp/traininfo/detail/113/0/\n"
    }
    if(data.indexOf('東急田園都市線') !== -1 && data.indexOf('平常運転') === -1){
      output += "田園都市線に問題が発生していそうですの。確認してくださいまし。https://transit.yahoo.co.jp/traininfo/detail/114/0/\n"
    }
    if(data.indexOf('東急大井町線') !== -1 && data.indexOf('平常運転') === -1){
      output += "大井町線に問題が発生していそうですの。確認してくださいまし。https://transit.yahoo.co.jp/traininfo/detail/115/0/\n"
    }
  }


/*
  for(var i = 0;i < parser.length;i++){
    var item = parser[i];
    if(item.indexOf('東急目黒線') !== -1){
      var list = Parser.data(item).from('<tr>').to('</tr>').iterate();
      Logger.log(list);
      for(data in list){
        //data = '<td><a href="https://transit.yahoo.co.jp/traininfo/detail/112/0/">東急東横線</a></td>\n<td>平常運転</td>\n<td>事故・遅延情報はありません</td>'
        if(data.indexOf('東急目黒線') !== -1 && data.indexOf('平常運転') === -1){
          output += "目黒線に問題が発生していそうですの。確認してくださいまし。https://transit.yahoo.co.jp/traininfo/detail/113/0/\n"
        }
        if(data.indexOf('東急田園都市線') !== -1 && data.indexOf('平常運転') === -1){
          output += "田園都市線に問題が発生していそうですの。確認してくださいまし。https://transit.yahoo.co.jp/traininfo/detail/114/0/\n"
        }
        if(data.indexOf('東急大井町線') !== -1 && data.indexOf('平常運転') === -1){
          output += "大井町線に問題が発生していそうですの。確認してくださいまし。https://transit.yahoo.co.jp/traininfo/detail/115/0/\n"
        }
      }
    }
  }
  */
  Logger.log(output);
  return output;
}

function PosttraQ(inputtext) {
  var prop = PropertiesService.getScriptProperties();
  
  const url = prop.getProperty("q_url");
  const secret_key = prop.getProperty("secret_key");
  
  if(inputtext == ""){
    return;
  }
  
  var signature = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_1,inputtext,secret_key, Utilities.Charset.UTF_8);
  var sign = signature.reduce(function(str,chr){
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length==1?'0':'') + chr;
  },'');
  var options =
  {
    'method' : 'post',
    'payload' : inputtext,
    'contentType': 'text/plain',
    'charset' : 'utf-8',
    "headers": {
        "X-TRAQ-Signature": sign ,
        // "X-TRAQ-Channel-Id" : "153c3c4a-5f02-42f5-97f4-460d02e2c39b"
    }
  };
  UrlFetchApp.fetch(url, options);
  Logger.log(inputtext);
}

function makemessage() {
  const prop = PropertiesService.getScriptProperties();
  const key = prop.getProperty("api_key");
  var text = "ごきげんよう。";
  var date = new Date();
  text += Utilities.formatDate(date, "JST", "MM月dd日") + ":desuwa:\n";
  /*
  var response = UrlFetchApp.fetch("https://community-open-weather-map.p.rapidapi.com/weather?lat=0&lon=0&id=2172797&lang=null&units=%2522metric%2522%20or%20%2522imperial%2522&q=Tokyo", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
		"x-rapidapi-key": key
	}
});
*/
  var response = UrlFetchApp.fetch("http://api.openweathermap.org/data/2.5/weather?q=Meguro&units=metric&APPID=a67850dd1dfdd40db643c3a2a75c38e7");
  Logger.log(response);
  var json=JSON.parse(response.getContentText());
  var now_temp = Math.round(json["main"]["temp"]);
  var min_temp = Math.round(json["main"]["temp_min"]);
  var max_temp = Math.round(json["main"]["temp_max"]);
  // var warning = parseXml();
  text += "今日の東京の天気は" + LanguageApp.translate(json["weather"][0]["main"], 'en', 'ja') + "、現在の気温は" + now_temp + "℃、最高気温は" + max_temp + "℃、最低気温は" + min_temp + "℃:desuwa:\n"; //  + warning + "\n";
  var random = Math.floor(Math.random () * 7);
  if(max_temp !== null){
    if(max_temp >= 35){
      text += "猛暑日:desuwa: " + Special[random];
    }
    else if(max_temp >= 30){
      text += "真夏日:desuwa: " + Extreme[random];
    }
    else if(max_temp >= 25){
      text += "夏日:desuwa:";
    }
  }
  //text += GetGC_TD();
  //text += GetGC_syuukai();
  Logger.log(text);
  return text;
}

function parseXml() {
  // フィードのURL設定
  var feedURL = "http://weather.livedoor.com/forecast/rss/warn/13.xml";
  // フィードを取得
  var response = UrlFetchApp.fetch(feedURL);

  // XMLをパース
  var xml = XmlService.parse(response.getContentText());

  // 各データの要素を取得
  var entries = xml.getRootElement().getChildren("channel")[0].getChildren("item");

  // 要素数を取得
  var length = entries.length;
  var string = "";
  // 取得したデータをループさせる
  for(var i = 0; i < length; i++) {
    // 記事タイトル
  var title = entries[i].getChildText("title");
  if(title.indexOf("23区西部") == 0){
    string = entries[i].getChildText("description");
    break;
  }
  }
  if(string == ""){
    string = "現在、注意報の情報を受け取れていませんわ。";
  }
  string = string.replace("います。","いますわ。");
  string = string.replace("いません。","いませんわ。");
  Logger.log("warning = " + string);
  return string;
}

//自分のカレンダーの予定表を受け取る
function GetGC_TD(){
  
  const prop = PropertiesService.getScriptProperties();
  const sintyoku = prop.getProperty("sintyoku");
  
  var dt = new Date();
  dt.setDate(dt.getDate());//今日

  //カレンダーURL、もしくはメールアドレスを取得して入力。
  var myCal=CalendarApp.getCalendarById(sintyoku);
  var events=myCal.getEventsForDay(dt);
  if(events.length == 0){
    return "";
  } 
  var strBody = "今日の進捗部屋は、\n";
  for(var i_e=0;i_e<events.length;i_e++){
    var strWhere = events[i_e].getLocation();
    var strStart=_HHmm(events[i_e].getStartTime());
    var strEnd=_HHmm(events[i_e].getEndTime());
    strBody += "- " + strStart + "〜" + strEnd + " : " + strWhere + "\n";
  }
  strBody += "\nとなっていますわ。\n"
  return strBody;
}

//自分のカレンダーの予定表を受け取る
function GetGC_syuukai(){
  
  const prop = PropertiesService.getScriptProperties();
  const trap = prop.getProperty("trap");
  
  var dt = new Date();
  dt.setDate(dt.getDate());//今日

  //カレンダーURL、もしくはメールアドレスを取得して入力。
  var myCal=CalendarApp.getCalendarById(trap);
  var events=myCal.getEventsForDay(dt);
  if(events.length == 0){
    return "";
  } 
  var strWhere = events[0].getLocation();
  var strTitle = events[0].getTitle();
  var strStart=_HHmm(events[0].getStartTime());
  if(strWhere == ""){
    var strBody = "今日は、" + strStart + "から" + strTitle + "がありましてよ 忘れないように参加しましょう:desuwa: :tanosimi-:";
  }
  else{
    var strBody = "今日は、" + strStart + "から" + strTitle + "がありましてよ\n場所は" + strWhere + ":desuwa: 忘れないように参加しましょう:desuwa: :tanosimi-:";
  }
  
  return strBody;
}


function _HHmm(str){
  return Utilities.formatDate(str, 'JST', 'HH時mm分');
}