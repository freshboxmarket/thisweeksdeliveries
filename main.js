const map = L.map('map').setView([43.6, -79.6], 9);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; CartoDB'
}).addTo(map);

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMzWzMhA4Mxf6LBcEVZmNXLnONiseOasg1-jtHhLi_L7uQ-3eyROjeBxj1pLZ_1hVYiFaXx7KPUKym/pub?gid=0&single=true&output=csv";

const layerColor = getRandomColor();

function getRandomColor() {
  const colors = ['#ff6f61', '#42a5f5', '#ab47bc', '#26a69a', '#ef5350'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function updateEventCounts(eventMap) {
  const list = document.getElementById("event-counts");
  list.innerHTML = '';
  const sorted = [...eventMap.entries()].sort((a, b) => b[1] - a[1]);
  sorted.forEach(([name, count]) => {
    const li = document.createElement("li");
    li.textContent = `${name}: ${count}`;
    list.appendChild(li);
  });
}

Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;
    const eventMap = new Map();

    data.forEach(row => {
      const lat = parseFloat(row.lat);
      const lon = parseFloat(row.long);
      const name = row.FundraiserName?.trim();
      const id = row.id?.trim();

      if (!isNaN(lat) && !isNaN(lon) && name && id) {
        const marker = L.circleMarker([lat, lon], {
          radius: 7,
          fillColor: layerColor,
          color: "#333",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`<strong>${name}</strong><br>ID: ${id}`);

        eventMap.set(name, (eventMap.get(name) || 0) + 1);
      }
    });

    updateEventCounts(eventMap);
  }
});
