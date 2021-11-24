var LASTNAME_COLUMN = "A";
var FORNAME_COLUMN = "B";

var uczniowie = [];
var tt = {};
var dates = [];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function script(){
  let sheet = SpreadsheetApp.openByUrl("");
  let document = DocumentApp.openByUrl("");

  let numOfUsers = sheet.getLastRow();
  for(let i = 2; i<numOfUsers+1; i++){
    let lastname = sheet.getRange(LASTNAME_COLUMN+i).getValue();
    let forname = sheet.getRange(FORNAME_COLUMN+i).getValue();
    uczniowie.push(lastname+" "+forname);
  }

  let now = new Date();
  let day = now.getDate();
  let month = now.getMonth()+1;
  let year = now.getFullYear();

  while(dates.length<=60){
    while(day<=new Date(year, month, 0).getDate()){
      let dayOfWeek = new Date(year, month-1, day).getDay();
      if([0,5,6].includes(dayOfWeek)){
        day++;
        continue;
      }
      dates.push([day, month, year].join("."));
      day++;
    }
    day = 1;
    month++;
    if(month-1 == 12){
      year ++;
      month = 1;
    }
  }

  for(let v of dates){
    let stop = false;
    let pair = [];
    let idx = getRandomInt(0, uczniowie.length-1);
    pair.push(uczniowie[idx]);
    uczniowie.splice(idx, 1);
    if(uczniowie.length != 0){
      idx = getRandomInt(0, uczniowie.length-1);
      pair.push(uczniowie[idx]);
      uczniowie.splice(idx,1);
    }else{
      stop = true;
    }
    if(stop) break;
    else tt[v] = pair.join(", ");
  }

  let body = document.getBody();
  body.clear();
  var cells = [
  ["Data", "Dyżurni", "Podpis wychowawcy", "Podpis SI"]
];
  
  let e = [];
  for(let entry in tt){
    e.push(entry, tt[entry], "", "");
    cells.push(e);
    e=[];
  }
  let table = body.appendTable(cells);
}
