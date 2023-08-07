d3.csv("data/exoplanets_cleaned.csv").then(function (data) {
	data.unshift({
		"Planet Name": "Earth",
		"Planet Mass [Earth mass]": "1",
		"Planet Radius [Earth radii]": "1"
	});

	let width2 = 800;
	let height2 = 600;
	let margin = { top: 50, right: 30, bottom: 50, left: 50 };

	let xDomain = [d3.min(data, d => +d["Planet Mass [Earth mass]"]), d3.max(data, d => +d["Planet Mass [Earth mass]"])];
	let yDomain = [d3.min(data, d => +d["Planet Radius [Earth radii]"]), d3.max(data, d => +d["Planet Radius [Earth radii]"])];


	// Using log x scale
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

	// Filter tick values based on the domain
	xTicks = xTicks.filter(v => v >= xDomain[0] && v <= xDomain[1]);
	// yTicks = yTicks.filter(v => v >= yDomain[0] && v <= yDomain[1]);


	let svg2 = d3.select('#scene-2-container')
		.append('svg')
		.attr('width', width2)
		.attr('height', height2);

	// Create scatter plot
	svg2.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(+d["Planet Mass [Earth mass]"]))
		.attr('cy', d => yScale(+d["Planet Radius [Earth radii]"]))
		.attr('r', 5)
		.attr('fill', 'purple')
		.on('mouseover', function (event, d) {
			tooltip.style('visibility', 'visible')
				.html(`Planet: ${d['Planet Name']}<br/>Mass: ${d["Planet Mass [Earth mass]"]} Earth Mass<br/>Radius: ${d["Planet Radius [Earth radii]"]} Earth Radii`);
		})
		.on('mousemove', event => tooltip.style('top', (event.pageY - 50) + 'px').style('left', (event.pageX + 20) + 'px'))
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


	let exoplanetTypes = [
		{ name: "Earth", criteria: "Earth", description: "It's Earth! We are all here.", dy: -230, dx: 50, type: "callout" },
		{ name: "Terrestrial", criteria: "HD 23472 d", description: "Here, we find rocky planets, similar to our own Earth, characterized by a solid surface and a relatively low mass for their size.", x: 120, y: 500, dx: 50, dy: -200,  type: "rect", rectSize: [100, 50] },
		{ name: "HD 23472 d", criteria: "HD 23472 d", description: "Terrestrial exoplanet orbiting a K- type star. Orbital period: 4 days. Discovered in 2022.", dy: -200, dx: -1, type: "callout" },
		{ name: "Super-Earth", criteria: "TOI-1670 b", description: "Moving further up the graph, we encounter Super-Earths, which are rocky planets larger and more massive than Earth, while still maintaining a solid surface.", x: 220, y: 350, dx: 50, dy: -50,  type: "rect", rectSize: [250, 200] },
		{ name: "TOI-1670 b", criteria: "TOI-1670 b", description: "Super-Earth exoplanet orbiting an F-type star. Orbital period: 11 days. Discovered in 2022.", dy: -200, dx: -140, type: "callout" },
		{ name: "Neptunian", criteria: "Kepler-103 c", description: "Here are the Neptunian planets, with a size and mass comparable to Neptune, characterized by thick atmospheres and likely composed of gas and ice.", x: 350, y: 280, dx: -100, dy: -1, type: "rect", rectSize: [200, 200] },
		{ name: "Kepler-103 c", criteria: "Kepler-103 c", description: "Neptunian exoplanet orbiting an F-type star. Orbital period: 179.6 days. Discovered in 2014.", dy: -180, dx: -80, type: "callout" },
		{ name: "Gas Giant", criteria: "KELT-19 A b", description: "Finally, at the uppermost end of the graph, we reach the domain of gas giants, enormous planets with a small, dense core, surrounded by thick layers of hydrogen and helium gas, such as Jupiter and Saturn in our own solar system.", x: 480, y: 40, dx: -260, dy: 10, type: "rect", rectSize: [300, 300] },
		{ name: "KELT-19 A b", criteria: "KELT-19 A b", description: "Gas giant exoplanet orbiting an A-type star. Orbital period: 4.6 days. Discovered in 2017.", dy: 30, dx: -310, type: "callout" }
	];

	let currentExoplanetIndex = 0;

	function showExoplanet() {
		let exoplanet = data.find(d => d["Planet Name"] === exoplanetTypes[currentExoplanetIndex].criteria);

		d3.select(".annotation-group").remove();

		const currentType = exoplanetTypes[currentExoplanetIndex];

		const x = currentType.x ?? xScale(+exoplanet["Planet Mass [Earth mass]"]);
		const y = currentType.y ?? yScale(+exoplanet["Planet Radius [Earth radii]"]);

		const annotations = [
			{
				type: currentType.type === "callout" ? d3.annotationCallout : d3.annotationCalloutRect,
				note: {
					title: currentType.name,
					label: currentType.description
				},
				x: x,
				y: y,
				dy: currentType.dy,
				dx: currentType.dx,
				subject: {
					width: currentType.rectSize?.[0],
					height: currentType.rectSize?.[1],
 
				},
			}
		];

		const makeAnnotations = d3.annotation()
			.annotations(annotations)
			.notePadding(15); 

		svg2.append("g")
			.attr("class", "annotation-group")
			.call(makeAnnotations)
			.selectAll('.annotation-note-bg') 
			.classed('d3-annotation-note', true); 
	}
	setTimeout(showExoplanet, 100);
 

	document.getElementById('next-exoplanet').addEventListener('click', function () {
		currentExoplanetIndex = (currentExoplanetIndex + 1) % exoplanetTypes.length;
		d3.select(".annotation-group").remove();
		showExoplanet();
	});
	document.getElementById('prev-exoplanet').addEventListener('click', function () {
		currentExoplanetIndex = (currentExoplanetIndex - 1 + exoplanetTypes.length) % exoplanetTypes.length;
		d3.select(".annotation-group").remove();
		showExoplanet();
	});
});