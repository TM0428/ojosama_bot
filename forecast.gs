

function makemessage_forecast() {
  const prop = PropertiesService.getScriptProperties();
  const key = prop.getProperty("api_key");
  var text = "こんばんは:desuwa:\n";
  var necessary = false;
  var response = UrlFetchApp.fetch("https://community-open-weather-map.p.rapidapi.com/weather?lat=0&lon=0&id=2172797&lang=null&units=%2522metric%2522%20or%20%2522imperial%2522&q=Tokyo", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
		"x-rapidapi-key": key
	}
});
  var json=JSON.parse(response.getContentText());
  var forecast = json["weather"][0]["main"];
  var find = forecast.indexOf("rain");
  if(find !== -1){
    text += "明日は雨という予報が出ていますわ。\n傘が必要ですわね\n";
    necessary = true;
  }
  var find = forecast.indexOf("snow");
  if(find !== -1){
    text += "明日は雪という予報が出ていますわ。\n雪だなんてワクワクしますね\n";
    necessary = true;
  }
  if(json["main"]["temp_max"]-273.15 >= 30){
    text += "明日は" + json["main"]["temp_max"]-273.15　+ "℃という予報が出ていますわ。\n熱中症に十分注意してほしい:desuwa:\n";
    necessary = true;
  }
  if(necessary === false){
    text = "";
  }
  
  
  
  
  return text;
}

function main_forecast(){
  PosttraQ(makemessage_forecast());
}


function test() {
  
  const prop = PropertiesService.getScriptProperties();
  const key = prop.getProperty("api_key");
var a = UrlFetchApp.fetch("https://community-open-weather-map.p.rapidapi.com/weather?lat=0&lon=0&callback=test&id=2172797&lang=null&units=%2522metric%2522%20or%20%2522imperial%2522&mode=xml%252C%20html&q=Tokyo", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
		"x-rapidapi-key": key
	}
});
  // Logger.log(a);
  var text = prop.getProperty("secret_key");
  
  Logger.log(text);
}
