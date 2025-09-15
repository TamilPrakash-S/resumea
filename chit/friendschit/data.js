const SPREADSHEET_ID = '1wxKU-NP7doGoJoBuPeqBiJbT08D8VL4lQaNeSgzydcw';
const API_KEY = 'AIzaSyCOZfEdoOp5dzfHJITXRvjbP3VOMwZbujc';

const params = new URLSearchParams(window.location.search);

const CHITNAME = params.get('name');

const RANGE = CHITNAME+'!B3:E12';

document.getElementById("title").innerHTML = CHITNAME + " Dashboard";