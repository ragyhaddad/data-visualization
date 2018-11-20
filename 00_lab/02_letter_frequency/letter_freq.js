var main = d3.select('#main');

var vowels = ['A', 'E', 'I', 'O', 'U'];

d3.csv('./letter_freq.csv', function(error,datum){
    var max = d3.max(datum, function(d){
        return +d['frequency'];
    });

    quant = d3.scaleQuantile()
        .domain(datum.map(function(d){
            return +d['frequency'];
        }))
        .range(['low-frequency', 'mid-frequency', 'high-frequency']);

    var bar = main.selectAll('.bar')
        .data(datum)
        .enter()
        .append('div')
        .attr('class', function(d){
            return 'letter '+(vowels.indexOf(d['letter']) > -1 ? 'vowel ' : 'consonant ')+quant(+d['frequency']);
        });

    bar.append('p')
        .text(function(d){
            return d['letter'];
        });

    var container = bar.append('div')
        .attr('class', 'bar-container');

    container.append('div')
        .attr('class', 'bar')
        .style('width', function(d){
            return +d['frequency'] / max * 100 +'%';
        });

});