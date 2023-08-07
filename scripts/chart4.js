d3.csv("data/exoplanets_cleaned.csv").then(function (data) {
	data.unshift({
		"Planet Name": "Earth",
		"Planet Mass [Earth mass]": "1",
		"Planet Radius [Earth radii]": "1",
		"Spectral Type": "G",
		"Equilibrium Temperature [K]" : "255",
		"Planet Density [g/cm^3]": "5.51",
		"Distance from Earth [pc]" : "It's Earth! 0"
	});

	let width3 = 800;
	let height3 = 600;
	let margin = { top: 50, right: 30, bottom: 50, left: 50 };

	let filteredData = data.filter(d => ["G", "K", "M"].includes(d["Spectral Type"]));

	let xDomain = [d3.min(filteredData, d => +d["Planet Mass [Earth mass]"]), 20];
	let yDomain = [d3.min(filteredData, d => +d["Planet Radius [Earth radii]"]), 7];

	// Filter data points within ranges
	filteredData = filteredData.filter(d => {
		const planetMass = +d["Planet Mass [Earth mass]"];
		const planetRadius = +d["Planet Radius [Earth radii]"];

		return planetMass >= xDomain[0] && planetMass <= xDomain[1] &&
			planetRadius >= yDomain[0] && planetRadius <= yDomain[1];
	});
 
	function customColorInterpolator(t) {
		if (t < 0.2) {
			// 0-1000; from blue to green
			return d3.interpolateRgb("lightblue", "green")(5 * t);
		} else if (t < 0.8) {
			// 1000-2000; from green to red
			return d3.interpolateRgb("green", "red")(2.5 * (t - 0.2));
		} else {
			// 2000-2500; just return red 
			return "red";
		}
	}


	let colorScale = d3.scaleSequential(customColorInterpolator)
		.domain([0, 2500]);


	let xScale = d3.scaleLog()
		.domain(xDomain)
		.range([margin.left, width3 - margin.right]);

	let yScale = d3.scaleLinear()
		.domain(yDomain)
		.range([height3 - margin.bottom, margin.top]);

	let svg3 = d3.select('#scene-4-container')
		.append('svg')
		.attr('width', width3)
		.attr('height', height3);

	// Highlighted Area
	svg3.append("rect")
		.attr("x", xScale(0.8))
		.attr("y", yScale(yDomain[1]))
		.attr("width", xScale(2) - xScale(0.8))
		.attr("height", yScale(yDomain[0]) - yScale(yDomain[1]))
		.style("fill", "#d6fffa")  
		.style("stroke", "gray");

	svg3.selectAll('circle')
		.data(filteredData)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(+d["Planet Mass [Earth mass]"]))
		.attr('cy', d => yScale(+d["Planet Radius [Earth radii]"]))
		.attr('r', 5)
		.attr('fill', d => colorScale(+d["Equilibrium Temperature [K]"]))
		.on('mouseover', function (event, d) {
			tooltip.style('visibility', 'visible')
				.html(`Planet: ${d['Planet Name']}<br/>Mass: ${d["Planet Mass [Earth mass]"]} Earth Mass<br/>Radius: ${d["Planet Radius [Earth radii]"]} Earth Radii<br/>Equilibrium Temperature: ${d["Equilibrium Temperature [K]"]} K<br/>Density: ${d["Planet Density [g/cm^3]"]} g/cm^3<br/>Distance from Earth: ${d["Distance from Earth [pc]"]} pc`);
		})
		.on('mousemove', event => tooltip.style('top', (event.pageY - 80) + 'px').style('left', (event.pageX + 20) + 'px'))
		.on('mouseout', () => tooltip.style('visibility', 'hidden'));

	// Tooltip 
	let tooltip = d3.select('body')
		.append('div')
		.style('position', 'absolute')
		.style('visibility', 'hidden')
		.style('background-color', 'white')
		.style('padding', '5px')
		.style('border', '1px solid black');

	// Annotations
	const annotations = [{
		type: d3.annotationCallout,
		note: {
			title: "0.8 to 2 Earth Masses",
			label: "This range is considered significant in the search for habitable conditions due to the potential of these planets having a solid surface and an atmosphere."
		},
		x: 200,
		y: 80,
		dy: 0,
		dx: 0
	}];

	const makeAnnotations = d3.annotation()
		.type(d3.annotationLabel)
		.annotations(annotations);

	svg3.append("g")
		.attr("class", "annotation-group")
		.call(makeAnnotations);

	// Add X-Axis
	svg3.append("g")
		.attr("transform", "translate(0," + (height3 - margin.bottom) + ")")
		.call(d3.axisBottom(xScale).ticks(5, ".1s"));

	// Add Y-Axis
	svg3.append("g")
		.attr("transform", "translate(" + margin.left + ",0)")
		.call(d3.axisLeft(yScale));

	// X-axis label
	svg3.append("text")
		.attr("transform", "translate(" + (width3 / 2) + " ," + (height3 - margin.top / 2) + ")")
		.style("text-anchor", "middle")
		.text("Planet Mass [Earth mass]");

	// Y-axis label
	svg3.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0)
		.attr("x", 0 - (height3 / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Planet Radius [Earth radii]");
});
