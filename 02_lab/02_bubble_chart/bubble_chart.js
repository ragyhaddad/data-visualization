d3.csv('./worldcup.csv', function(error, datum){
    if(error) {
        console.error(error);
        return;
    }
   
    var maxGA = d3.max(datum, function(d){return +d['Goals_Against'];});
    var maxGF = d3.max(datum, function(d){return +d['Goals_For'];});
    var maxPlayed = d3.max(datum, function(d){return +d['Played'];});

    var xScale = d3.scaleLinear().domain([0, maxGA]).range([60,360]);
    var yScale = d3.scaleLinear().domain([0, maxGF]).range([660,20]);
    var rScale = d3.scaleSqrt().domain([0, maxPlayed]).range([0,30]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var svg = d3.select('svg');

    svg.append('g')
        .attr('class','x axis')
        .attr('transform', 'translate(0,670)')
        .call(xAxis);

    svg.append('text')
        .text('Goals Against')
        .attr('class', 'label')
        .attr('transform','translate(200,705)');

    svg.append('g')
        .attr('class','y axis')
        .attr('transform', 'translate(50)')
        .call(yAxis);

    svg.append('text')
        .text('Goals For')
        .attr('class', 'label')
        .attr('transform','translate(10,360) rotate(90)');

    datum.forEach(function(country){
        createCountryBubble(svg, xScale(+country['Goals_Against']), yScale(+country['Goals_For']),
                            rScale(+country['Played']), country);

    });
});


function createCountryBubble(svg, goalsAgainst, goalsFor, gamesPlayed, country) {
    // svg - a d3-selection of the svg element - think of this a pointer to the svg DOM
   
    // goalsAgainst - a scaled pixel value in the plot's x-coordinate system for this country's "Goals_Against" property
    
    // goalsFor - a scaled pixel value in the plot's y-coordinate system for this country's "Goals_For" property
    
    // gamesPlayed - a scaled pixel value in a square root range for the radius of the circle, corresponds to this
               // country's "Played" property which is the total matches played in the World Cup
   
    // country - the country object, has key-value pairs from the data table (e.g. country, Wins, Losses, Best_Finish)


    // **** Your JavaScript code goes here ****
    
    /**
     * Local Variables
     */
    var colorMap = {
        "Winner": "#8C0200",
        "Runner-up": "#C00F0D",
        "Third Place": "#FF1F3A",
        "Fourth Place": "#F2898F",
        "Quarter-finals": "#DDDDDD",
        "First Round": "#DDDDDD",
        "Second Round": "#DDDDDD"
    };

    var labeledCountries = ['United States','Germany','Brazil'];

    /**
     * Appending Circle Elements to SVG
     */
    var node = svg.append('circle')
    .attr('opacity', 0.8)
    .attr('r',gamesPlayed)
    .attr('cx',goalsAgainst)
    .attr('cy',goalsFor)
    .style('stroke-width',1)
    .style('stroke','white')
    .attr('fill',function(){
        //Map Best_finish to corressponding color - Challenge #1
        return colorMap[country.Best_finish];
    })
   

    /**
     * Function to check for countries
     * @param {String} return boolean
     */
    function checkCountry(Country){
        for (var x = 0; x < labeledCountries.length; x++){
            if (Country == labeledCountries[x]){
                return true;   
            }
        }
    }
    /**
     * Calls checkCountry in If statement 
     * And returns boolean.
     */
    if (checkCountry(country.Country)){
        svg.append('text')
        .attr('font-family','sans-serif')
        .attr('fill','black')
        .attr('font-size','16px')
        .attr('font-weight','100')
        .attr('x',goalsAgainst-30)
        .attr('y',goalsFor)
        .text(function(){return country.Country})
    }

    
     

}