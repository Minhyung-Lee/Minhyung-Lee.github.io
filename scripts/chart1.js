d3.csv("data/exoplanets_cleaned.csv").then(function (data) {

	let exoplanetTypes = [
		{ type: "Gas Giant", count: 1731 },
		{ type: "Neptune-like", count: 1884 },
		{ type: "Super Earth", count: 1664 },
		{ type: "Terrestrial", count: 198 }
	];

	let width1 = 400;
	let height1 = 400;
	let radius = Math.min(width1, height1) / 2;

	let svg1 = d3.select('#exoplanet-chart')
		.append('svg')
		.attr('width', width1)
		.attr('height', height1)
		.append('g')
		.attr('transform', `translate(${width1 / 2}, ${height1 / 2})`)
		.style('background-color', '#1e2130');  

	let color = d3.scaleOrdinal(d3.schemeCategory10);

	let pie = d3.pie().value(d => d.count);
	let data_ready = pie(exoplanetTypes);

	let arc = d3.arc()
		.innerRadius(0)
		.outerRadius(radius);

	// Tooltip
	let tooltip = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.style("position", "absolute")
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "1px")
		.style("border-radius", "5px")
		.style("padding", "10px")
		.style("opacity", 0);

	// Pie segments
	let segments = svg1.selectAll('path')
		.data(data_ready)
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', d => color(d.data.type))
		.attr('stroke', 'white')
		.style('stroke-width', '2px')
		.style('opacity', 0.7)
		.on('mouseover', function (event, d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip.html(d.data.type + "<br>" + d.data.count + " discoveries")
				.style("left", (event.pageX + 5) + "px")
				.style("top", (event.pageY - 28) + "px");
		})
		.on('mouseout', function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		})
		// .on('click', function (event, d) {
		// 	console.log(`Clicked on ${d.data.type}`);

		// });

	// Animation
	segments.transition()
		.duration(1000)
		.attrTween('d', function (d) {
			let i = d3.interpolate(d.startAngle, d.endAngle);
			return function (t) {
				d.endAngle = i(t);
				return arc(d);
			}
		});

	// Pie labels
	svg1.selectAll('text')
		.data(data_ready)
		.enter()
		.append('text')
		.text(d => `${d.data.type} (${d.data.count})`)
		.attr('transform', d => `translate(${arc.centroid(d)})`)
		.style('text-anchor', 'middle')
		.style('font-size', 12);

});

