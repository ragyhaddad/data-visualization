letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

var svg = d3.select('svg');

var letter = svg.selectAll('.letter')
    .data(letters)
    .enter()
    .append('text')
    .attr('x', 150)
    .attr('y', function(d,i){
        return i * 20 + 50;
    })
    .text(function(d) {
        return d;
    })
    .attr('dy', '0.9em')
    .style('text-anchor', 'middle')
    .style('font-size', 14)
    .style('font-family', 'Open Sans');

// var letterEnter = letter.enter()
//     .append('g')
//     .attr('class', 'letter')
//     .attr('transform', function(d,i) {
//         return 'translate('+[i * 40 + 50, 50]+')';
//     });

// letterEnter.append('circle')
//     .attr('r', 20)
//     .style('fill', '#999');

// letterEnter.append('text')
//     .attr('y', 20)
//     .text(function(d) {
//         return d;
//     })
//     .attr('dy', '0.9em')
//     .style('text-anchor', 'middle')
//     .style('fill', '#777')
//     .style('font-size', 14)
//     .style('font-family', 'Open Sans');

// setTimeout(function(){
//     var letter = svg.selectAll('.letter')
//         .data(letters.slice(0,2));

//     letter.exit().remove();
// },2000);

// setTimeout(function(){
//     var letter = svg.selectAll('.letter')
//         .data(letters);

//     var letterEnter = letter.enter()
//         .append('g')
//         .attr('class', 'letter');

//     letterEnter.merge(letter)
//         .attr('transform', function(d,i) {
//             return 'translate('+[i * 60 + 50, 50]+')';
//         });

//     letterEnter.append('circle')
//         .attr('r', 20)
//         .style('fill', '#999');

//     letterEnter.append('text')
//         .attr('y', 20)
//         .text(function(d) {
//             return d;
//         })
//         .attr('dy', '0.9em')
//         .style('text-anchor', 'middle')
//         .style('fill', '#777')
//         .style('font-size', 14)
//         .style('font-family', 'Open Sans');
// },4000);







letter.exit().remove();