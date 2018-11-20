var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 40, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// Create a date parser and formatter
var parseDate = d3.timeParse('%Y %b %d');
var formatDate = d3.timeFormat('%b %e, %Y');

// Create color scale for the trees
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create the treemap object to compute a treemap dataset
// based on the breakdown of browser usage
var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([chartWidth, chartHeight])
    .round(true)
    .paddingInner(1);

// Get the browser dataset at the above directory
d3.csv('../browser.csv',
    function(row) {
        return {
            date: parseDate(row.date),
            'Google Chrome': +row['Google Chrome'] / 100,
            'Internet Explorer': + row['Internet Explorer'] / 100,
            'Firefox': +row['Firefox'] / 100,
            'Safari': +row['Safari'] / 100,
            'Microsoft Edge': +row['Microsoft Edge'] / 100,
            'Opera': +row['Opera'] / 100,
            'Mozilla': +row['Mozilla'] / 100,
            'Other/Unknown': +row['Other/Unknown'] / 100
        };
    },
    function(error, dataset) {
        if(error) {
            console.error('Error while loading ../browser.csv dataset.');
            console.error(error);
            return;
        }

        // Get thr browser names as an array of strings
        browsers = dataset.columns.slice(1);

        // Compute a dataset where we have a hierarchy object (an object that contains children:[])
        // for each date in the dataset and the browser usage
        treesByDate = dataset.map(function(d){
            return {name: 'root', date: d.date,
                children: browsers.map(function(b){return {name: b, value: d[b]};})
            }
        });

        console.log(treesByDate);

        // Create the step counter
        var step = 0;

        // Start an interval that will update the chart on a repeated loop
        d3.interval(function(){
            // Update the chart based on step
            updateChart(step);

            // Increment step, go back to 0 if at end
            step++;
            if(step == treesByDate.length) step = 0;
        }, 250);
    });

function updateChart(step) {
    // Create the hierarchy object for the browser usage that date
    var root = d3.hierarchy(treesByDate[step])
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name.replace(/ /g,''); })
      .sum(function(d) {return d.value;});

    // Compute the treemap on the root hierarchy
    // The treemap method has side-effects so root will be updated with treemap data
    treemap(root);

    console.log(root);

    // Create the cell objects for the leaves of the root
    var cell = chartG.selectAll('.cell')
        .data(root.leaves(), function(d){
            return d.data.id; // Use the id to create object constancy
        });

    // Create the g.cell element the first time
    var cellEnter = cell.enter().append('g')
        .attr('class', 'cell');

    // Add the rectangle for the browser usage
    cellEnter.append('rect')
        .attr('id', function(d){ return d.data.id;})
        .style('fill', function(d){ return colorScale(d.data.id);});

    // Add a clipPath based on the rectangle so that the text can be clipped
    cellEnter.append('clipPath')
        .attr('id', function(d){ return 'clip-'+d.data.id;})
        .append('use')
        .attr('xlink:href', function(d){ return '#' + d.data.id;});

    // Add a text element and clip it for the browser name
    cellEnter.append('text')
        .attr('clip-path', function(d){ return 'url(#clip-' + d.data.id + ')';})
        .attr('x', 4)
        .attr('y', '1.3em')
        .text(function(d){return d.data.name;});

    // Create a re-usable transition object
    var t = d3.transition()
        .duration(100);

    // Merge the UPDATE + ENTER selections
    var cellMerge = cell.merge(cellEnter);

    // Transition the cell's position
    cellMerge.transition(t)
        .attr('transform', function(d) {
            return 'translate(' + [d.x0, d.y0] + ')';
        });

    // Transition the rect's height and width
    cellMerge.select('rect')
        .transition(t)
        .attr('width', function(d){ return d.x1 - d.x0;})
        .attr('height', function(d){ return d.y1 - d.y0;});

    // Show the current date
    var dateLabel = svg.selectAll('.date-label')
        .data([treesByDate[step].date]);
    dateLabel.enter().append('text')
        .attr('class', 'date-label')
        .attr('y', svgHeight - 20)
        .attr('x', 200);
    dateLabel.text(function(d){ return formatDate(d);});
}
// Remember code outside of the data callback function will run before the data loads