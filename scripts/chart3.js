d3.csv("data/exoplanets_cleaned.csv").then(function (data) {
	data.unshift({
		"Planet Name": "Earth",
		"Planet Mass [Earth mass]": "1",
		"Planet Radius [Earth radii]": "1",
		"Spectral Type": "G"
	});

	let width2 = 800;
	let height2 = 600;
	let margin = { top: 50, right: 30, bottom: 50, left: 50 };

	let xDomain = [d3.min(data, d => +d["Planet Mass [Earth mass]"]), d3.max(data, d => +d["Planet Mass [Earth mass]"])];
	let yDomain = [d3.min(data, d => +d["Planet Radius [Earth radii]"]), d3.max(data, d => +d["Planet Radius [Earth radii]"])];

	// Define color scale
	let colorScale = d3.scaleOrdinal()
		.domain(["O", "B", "A", "F", "G", "K", "M", "undefined"])
		.range(["#9b59b6", "#3498db", "#d92ef0", "#e74c3c", "#34495e", "#2ecc71", "#f1c40f", "#bdc3c7"]); // diff colors for diff spectral types

	// log x scale 
	let xScale = d3.scaleLog()
		.domain(xDomain)
		.range([margin.left, width2 - margin.right]);

	let yScale = d3.scaleLinear()
		.domain(yDomain)
		.range([height2 - margin.bottom, margin.top]);

	// Define tick values for even spacing in log scale
	let xTicks = Array.from({ length: Math.ceil(Math.log10(7000)) + 1 }, (_, i) => Math.pow(10, i));
	let yTicks = d3.range(0, 25, 2);

	let midXTicks = [];
	for (let i = 0; i < xTicks.length - 1; i++) {
		midXTicks.push(Math.sqrt(xTicks[i] * xTicks[i + 1]));
	}
	xTicks = xTicks.concat(midXTicks);

	// Filter tick values based on domain
	xTicks = xTicks.filter(v => v >= xDomain[0] && v <= xDomain[1]);

	let svg2 = d3.select('#scene-3-container')
		.append('svg')
		.attr('width', width2)
		.attr('height', height2);


	svg2.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(+d["Planet Mass [Earth mass]"]))
		.attr('cy', d => yScale(+d["Planet Radius [Earth radii]"]))
		.attr('r', 5)
		.attr('fill', d => colorScale(d["Spectral Type"] || "undefined"))
		.classed("dimmed", d => !d["Spectral Type"])
		.on('mouseover', function (event, d) {
			tooltip.style('visibility', 'visible')
				.html(`Planet: ${d['Planet Name']}<br/>Mass: ${d["Planet Mass [Earth mass]"]} Earth Mass<br/>Radius: ${d["Planet Radius [Earth radii]"]} Earth Radii<br/>Host Star Spectral Type: ${d["Spectral Type"] || "undefined"}`);
		})
		.on('mousemove', event => tooltip.style('top', (event.pageY - 60) + 'px').style('left', (event.pageX + 20) + 'px'))
		.on('mouseout', () => tooltip.style('visibility', 'hidden'));

	// Add axes
	svg2.append('g')
		.attr('transform', `translate(0,${height2 - margin.bottom})`)
		.call(d3.axisBottom(xScale).tickValues(xTicks).tickFormat(d3.format(".2")));

	svg2.append('g')
		.attr('transform', `translate(${margin.left},0)`)
		.call(d3.axisLeft(yScale).tickValues(yTicks).tickFormat(d3.format(".2")));

	// Add labels
	svg2.append('text')
		.attr('x', (width2 / 2))
		.attr('y', (height2 - margin.bottom / 2) + 10)
		.style('text-anchor', 'middle')
		.text('Planet Mass [Earth mass] (Log Scale)');

	svg2.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', margin.left / 3)
		.attr('x', -(height2 / 2))
		.style('text-anchor', 'middle')
		.text('Planet Radius [Earth radii] (Log Scale)');

	// Tooltip
	let tooltip = d3.select('body')
		.append('div')
		.style('position', 'absolute')
		.style('visibility', 'hidden')
		.style('background-color', 'white')
		.style('padding', '5px')
		.style('border', '1px solid black');

	let spectralTypes = [
		{ "name": "Introduction", "description": "This graph shows the relationship between the mass and radius of exoplanets, grouped in color by their host star's spectral type.", "dy": -0, "dx": 0, "type": "callout" },
		{ "name": "M-type Star", "description": "M-type stars, or red dwarfs, are the coolest, smallest, and most abundant type of star in the universe.", "dy": -100, "dx": 20, "type": "callout" },
		{ "name": "K-type Star", "description": "K-type stars are slightly cooler than our Sun, orange in color, and known to have long, stable lifetimes.", "dy": -60, "dx": -150, "type": "callout" },
		{ "name": "G-type Star", "description": "G-type stars, like our Sun, are yellowish and well-balanced in metals and other elements.", "dy": -80, "dx": -10, "type": "callout" },
		{ "name": "F-type Star", "description": "F-type stars are known for their white color and are hotter than the Sun.", "dy": -30, "dx": -160, "type": "callout" },
		{ "name": "A-type Star", "description": "A-type stars are white or bluish-white, known for their strong hydrogen lines.", "dy": 0, "dx": -150, "type": "callout" },
		{ "name": "B-type Star", "description": "B-type stars are very bright and blue, not as hot or massive as O-type stars but more so than others.", "dy": 50, "dx": -210, "type": "callout" },
		{ "name": "O-type Star", "description": "O-type stars are the hottest and most massive stars, known for their blue color and strong stellar winds. There are no known planets orbiting one!", "dy": 0, "dx": -0, "type": "callout" },
	]

	let currentSpectralIndex = 0;

	function showSpectralType() {
		d3.select(".annotation-group").remove(); 

		const currentType = spectralTypes[currentSpectralIndex];
		let x, y;

		if (currentType.name === "Introduction") {
			x = 80;
			y = 40;
			svg2.selectAll('circle').classed("dimmed", false);
		} else if (currentType.name === "O-type Star") {
			x = 120;
			y = 80;
		} else {
			let spectral = data.find(d => d["Spectral Type"] === currentType.name.charAt(0));
			if (!spectral) {
				x = 0;
				y = 0;
			} else {
				x = xScale(+spectral["Planet Mass [Earth mass]"]);
				y = yScale(+spectral["Planet Radius [Earth radii]"]);
			}
		}

		const annotations = [{
			type: d3.annotationCallout,
			note: {
				title: currentType.name,
				label: currentType.description
			},
			x: x,
			y: y,
			dy: currentType.dy,
			dx: currentType.dx,
		}];

		const makeAnnotations = d3.annotation()
			.annotations(annotations)
			.notePadding(15);

		svg2.append("g")
			.attr("class", "annotation-group")
			.call(makeAnnotations)
			.selectAll('.annotation-note-bg')
			.classed('d3-annotation-note', true);
	}




	setTimeout(showSpectralType, 100);

	document.getElementById('next-spectral').addEventListener('click', function () {
		currentSpectralIndex = (currentSpectralIndex + 1) % spectralTypes.length;

		let currentSpectralType = spectralTypes[currentSpectralIndex].name.charAt(0); 
		updateDimming(currentSpectralType);

		showSpectralType();
	});

	document.getElementById('prev-spectral').addEventListener('click', function () {
		currentSpectralIndex = (currentSpectralIndex - 1 + spectralTypes.length) % spectralTypes.length;

		let currentSpectralType = spectralTypes[currentSpectralIndex].name.charAt(0); 
		updateDimming(currentSpectralType);

		showSpectralType();
	});

	function updateDimming(currentSpectralType) {
		if (currentSpectralType === "Introduction") {
			svg2.selectAll('circle').classed("dimmed", false);
		} else {
			svg2.selectAll('circle').classed("dimmed", d => d["Spectral Type"] !== currentSpectralType && d["Spectral Type"]);
		}
	}
});