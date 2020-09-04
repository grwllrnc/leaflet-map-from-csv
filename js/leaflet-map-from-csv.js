/*
    Leaflet-Karte mit Swisstopo Tiles
    
    Marker-Informationen werden aus CSV-File gelesen
*/

// Read CSV
function readCSV(txt, sep) {
    // converts the CSV file into a javascript object
    const lines = txt.split("\n");
    const keys = lines[0].split(sep);
    const rows = getRows(lines.slice(1,lines.length), sep);
    const items = [];

    for(let i=0; i < rows.length; i++){
        let item = {};

        for(let j = 0; j < rows[i].length; j++){
            item[keys[j].trim()] = rows[i][j].trim();
            }
        items.push(item);
        }

    return {
        "items": items,
        "keys": keys
    };
}

// Helper function for readCSV() that splits the rows of the CSV file
function getRows(listOfRows, sep){
    const rows = []
    for(let i=0; i < listOfRows.length; i++){
        rows.push(listOfRows[i].split(sep));
        }
    return rows;
}

function loadJSON(data, callback) {   

    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("txt/csv");
    xobj.open("GET", data, true);
    xobj.onreadystatechange = function() {
          if (xobj.readyState == 4 && (xobj.status == "200" || xobj.status == "0")) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}


function init(csv){

        loadJSON(csv, function(data){
            const csvData = readCSV(data, ";");
            console.log(csvData);
            const intViewportWidth = window.innerWidth;
            let zoom;
          	if (intViewportWidth <= 768) {
              zoom = 6.5;
            } else {
              zoom = 7.5;
            }
            
          const map = L.map('leaflet-map-id', {minZoom: 7.5}).setView([46.84786, 8.25677], zoom);
            const url = 'https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
            const siteIcon = L.icon({
                // Set path to icon here
                iconUrl: 'icons/icon.png',
                shadowUrl: 'icons/icon-shadow.png',

                iconSize:     [70,62], // size of the icon
                shadowSize:   [70,62], // size of the shadow
                iconAnchor:   [30,55], // point of the icon which will correspond to marker's location
                shadowAnchor: [30,55],  // the same for the shadow
                popupAnchor:  [2,-49] // point from which the popup should open relative to the iconAnchor
            });

            L.tileLayer(url, {
              	layers: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
                attribution: '&copy; Daten: <a href="https://www.swisstopo.admin.ch/">swisstopo</a>.'
            }).addTo(map);

            for (let i = 0; i < csvData.items.length; i++) {
                // Modify CSV fields to match your file
              	let content = '<div class="leaflet-popup-content"><a href="' + csvData.items[i].link + '" target="_self">'+ '<h6><span style="color:' + csvData.items[i].color + ';">' + csvData.items[i].name + '</span></h6></a><p>' + csvData.items[i].ort + '<br />' + csvData.items[i].lage + '<br /><a href="' + csvData.items[i].link + '" target="_self">Mehr erfahren ...</a></p></div>'
                L.marker([csvData.items[i].lat, csvData.items[i].lng], {icon: siteIcon}).addTo(map).bindPopup(content);
            }
        });



}

init("alp-standorte.csv"); // Insert path to csv file