
// **** Your JavaScript code goes here ****

d3.csv('./exoplanets.csv',function(data){
    console.log(data)
    var svg = d3.select('svg')
    /**
     * Find Max and Min for scale - returns array
     */
    var hzdExtent = d3.extent(data, function(d){
		return parseFloat(d.habital_zone_distance);
    });
    var massExtent = d3.extent(data, function(d){
		return parseFloat(d.mass);
    });
    var radiusExtent = d3.extent(data,function(d){
        return parseFloat(d.radius);
    })
    console.log(hzdExtent)
    var colors = ['#d64d3f', '#96ac3d', '#208d8d'];
    var xScale = d3.scaleLinear().domain(hzdExtent)
    .range([100,500]);
    var yScale = d3.scaleLog().domain(massExtent)
    .range([60,660]);
    var radiusScale = d3.scaleSqrt().domain(radiusExtent)
    .range([0,20])
    var colorScale = d3.scaleQuantize().domain(hzdExtent)
    .range(colors)

    /**
     * Nodes
     */
    var nodes = svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx',function(d){
        return (xScale(d.habital_zone_distance))
    })
    .attr('cy',function(d){
        return yScale(d.mass)
    })
    .attr('fill',function(d){
        return colorScale(d.habital_zone_distance)
    })
    .attr('r',function(d){
        return radiusScale(d.radius)
    })
    .style('opacity',0.5)
    .style('stroke-width',0.5)
    .attr('stroke','white')
    /**
     * Axis
     */
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    var rightAxis = d3.axisRight(yScale);
    var topAxis = d3.axisTop(xScale);
    svg.append('g')
    .attr('class','x-axis')
    .attr('transform', 'translate(0,690)')
    .call(xAxis);
    svg.append('g')
    .attr('class','x-axis')
    .attr('transform', 'translate(60,0)')
    .call(yAxis);
    svg.append('g')
    .attr('class','x-axis')
    .attr('transform', 'translate(540,0)')
    .call(rightAxis);
    svg.append('g')
    .attr('class','x-axis')
    .attr('transform', 'translate(0,50)')
    .call(topAxis)


    /**
     * Labels
     */
    svg.append('text')
    .text('Habital Zone Distance')
    .attr('fill','white')
    .attr('transform', 'translate(250,25)')

    svg.append('text')
    .text('Habital Zone Distance')
    .attr('fill','white')
    .attr('transform', 'translate(250,730)')

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr("x",0 - (600 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr('fill','white')
    .text("Planet Mass (relative to Earth)")

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 576)
    .attr("x",0 - (600 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr('fill','white')
    .text("Planet Mass (relative to Earth)")
 
});