
/**
 * Globals
 */
var letters = []
var xScale = 0
// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}


var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// A map with arrays for each category of letter sets
var lettersMap = {
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split('')
};

d3.csv('./letter_freq.csv',
    // Load data and use this function to process each row
    function(row) {
        return {
            letter: row.letter,
            frequency: +row.frequency
        };
    },
    function(error, dataset) {
        // Log and return from an error
        if(error) {
            console.error('Error while loading ./letter_freq.csv dataset.');
            console.error(error);
            return;
        }

        // Create global variables here and intialize the chart

        letters = dataset;
        frequency_domain = d3.extent(letters,function(d){
            return (d.frequency);
        })
        xScale = d3.scaleLinear().domain(frequency_domain).range([0,chartWidth])

        /**
         * Axis
         */
        var xAxis = d3.axisTop();
        var bottomAxis = d3.axisBottom();

        bottomAxis.scale(xScale).ticks(7);
        xAxis.scale(xScale).ticks(7);

        svg.append('g')
        .attr('transform',`translate(${chartWidth/2},50)`)
        .append('text').text('Letter Frequency')
        .attr('font-size',12)
        svg.append("g")
        .attr('transform',`translate(${padding.l},30)`)
        .call(xAxis);

        svg.append('g')
        .attr('transform',`translate(${padding.l},570)`)
        .call(bottomAxis)
        // Update the chart for all letters to initialize
        updateChart('all-letters');
    });


function updateChart(filterKey) {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0;
    });

    // **** Draw and Update your chart here ****
    var bars = chartG.selectAll('.bar')
    .data(filteredLetters, function(d){
        return d.letter;
    });

    var barsEnter = bars.enter()
    .append('g')
    .attr('class','bar')

    bars.merge(barsEnter)
		.attr('transform', function(d,i){
            return 'translate('+[0, i * barBand + 4]+')';
    });

    barsEnter.append('rect')
    .attr('height', barHeight)
    .attr('width', function(d){
        return xScale(d.frequency);
    })
    .attr('fill','#37578e');

    barsEnter.append('text')
    .attr('x', -20)
    .attr('dy', '0.9em')
    .text(function(d){
        return d.letter;
    }); 

    bars.exit().remove();

}
// Remember code outside of the data callback function will run before the data loads