const myMap = {
	coords: [],
	locs: [],
	map: {},
	markers: {},

	buildMap() {
		this.map = L.map('map', {
		  center: this.coords,
		  zoom: 14,
		});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '10',
		}).addTo(this.map)

    const marker = L.marker(this.coords).addTo(this.map).bindPopup('<p1><b>You are here</b><br></p1>').openPopup();
	},

	addMarkers() {
		for (let i = 0; i < this.locs.length; i++) {
		  this.markers.push(L.marker([
			  this.locs[i].lat,
			  this.locs[i].long,
		  ]).bindPopup(`<p1>${this.locs[i].name}</p1>`).addTo(this.map));
		}
	},
}

// get coordinates via geolocation api
async function getCoords() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    return [position.coords.latitude, position.coords.longitude];
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}

// get foursquare businesses
async function getFoursquare(loc) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'fsq3UEOcGz9cjG2oEyLHeObV8mV51PIuapsrg+5wRJQCgaQ='
    }
  };
	let max = 5;
	let lat = myMap.coords[0];
	let long = myMap.coords[1];
	let response = await fetch(`https://api.foursquare.com/v3/places/search?radius=5000&categories=${selsect}`, options);
	let output = await response.json();
	console.log(output);
	return output;
}

function processFourSquare(output) {
  return output.results.map((element) => {
    let thing = {
      name: element.name,
      lat: element.latitude,
      long: element.longitude
    };
    return thing;
  });
}

window.onload = async () => {
	const myLoc = await getCoords();
	myMap.coords = myLoc;
	myMap.buildMap();
};

document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault();
	let loc = document.getElementById('business').value;
	let output = await getFoursquare(loc);
	myMap.locs = processFourSquare(output);
	myMap.addMarkers();
});