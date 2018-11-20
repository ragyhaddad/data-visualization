// **** Your JavaScript code goes here ****

/**
 * @param {None}
 * Scatter Plot Function 
 */
function drawScatterPlot(){
    d3.csv('./baseball_hr_leaders.csv', function(error, dataset) {       
        d3.select('svg')
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx',function(d){return scaleYear(d.year)})
        .attr('cy',function(d){return scaleHomeruns(d.homeruns)})
        .attr('r',2)
        .style('fill',function(d){
            if(d.rank >= 1 && d.rank <= 3){
                return '#e25222'
            }
            else{
                return '#327a87';
            }
        })
        .style('opacity',0.53)
        .attr('stroke-width',function(d){
            if (d.rank >= 1 && d.rank <= 3){
                return 0.2;
            }
        })
        .attr('stroke',function(d){
            if (d.rank >= 1 && d.rank <= 3){
                return 'black';
            }
        })
    });
}

/**
 * Call Main Function
 */
drawScatterPlot()

// **** End of Student Code ****



// **** Functions to call for scaled values ****
function scaleYear(year) {
    return yearScale(year);
}

function scaleHomeruns(homeruns) {
    return hrScale(homeruns);
}


// **** Code for creating scales, axes and labels ****

var yearScale = d3.scaleLinear()
    .domain([1870,2017]).range([60,700]);

var hrScale = d3.scaleLinear()
    .domain([0,75]).range([340,20]);

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(function(d){return d;}));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(360,390)')
    .text('MLB Season');

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(hrScale));

svg.append('text')
    .attr('class', 'label')
    .attr('transform','translate(15,200) rotate(90)')
    .text('Home Runs (HR)');

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(360,30)')
    .text('Top 10 HR Leaders per MLB Season');