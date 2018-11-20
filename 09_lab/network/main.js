var svg = d3.select('svg');
var width = +svg.attr('width');
var height = +svg.attr('height');

var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
var linkScale = d3.scaleSqrt().range([1,5]);

d3.json('./les_miserables.json',
    function(error, dataset) {
        if(error) {
        console.error('Error while loading ./les_miserables.json dataset.');
        console.error(error);
        return;
    }

    network = dataset;

    linkScale.domain(d3.extent(network.links, function(d){ return d.value;}));

    var padding = {l:20,r:20,t:20,b:20};
    var width = $('#main-svg').width() - padding.l - padding.r; 
    var height = $('#main-svg').height() - padding.t - padding.b;


    /**
     * Force Simulation Settings
     */
    var simulation = d3.forceSimulation()
    .force('link',d3.forceLink().id(function(d){return d.id;}))
    .force('charge',d3.forceManyBody())
    .force('center',d3.forceCenter(width / 2, height /2));

    //Call drag end on click
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    } 
    // Global Tool tip
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
    

    var linkG = svg.append('g')
        .attr('class', 'links-group');

    var nodeG = svg.append('g')
        .attr('class', 'nodes-group');

    var linkEnter = linkG.selectAll('.link')
    .data(network.links)
    .enter() 
    .append('line') 
    .attr('class', 'link')
    .attr('stroke-width',function(d){
        return linkScale(d.value);
    }) 

    var nodeEnter = nodeG.selectAll('.node')
    .data(network.nodes) 
    .enter() 
    .append('circle')
    .attr('r',6)
    .style('fill',function(d){
        return colorScale(d.group);
    }).on('click',dragended)
    .on('mouseover',function(d){
        console.log(d)
        div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html('<h3>'+ d.id + '</h3>')	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
    }).on("mouseout", function(d) {		
        div.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });
    
    simulation.nodes(network.nodes) 
    .on('tick',tickSimulation) 

    simulation
    .force('link')
    .links(network.links);

    function tickSimulation(){
        linkEnter
        .attr('x1', function(d) { return d.source.x;})
        .attr('y1', function(d) { return d.source.y;})
        .attr('x2', function(d) { return d.target.x;})
        .attr('y2', function(d) { return d.target.y;});
        nodeEnter
        .attr('cx', function(d) { return d.x;})
        .attr('cy', function(d) { return d.y;});
    }
    var drag = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
     

    function dragstarted(d) {
        
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    nodeEnter.call(drag);
});

$( ".notification" ).animate({
    opacity: 0,
  }, 7000, function() {
    // Animation complete.
  });