
//this is the js API for draw plasmid using d3

function Plasmid(){
    //set some global varaibles
    var id = '',
        name = '',
        sequence ='',
        showEnzyme = true,
        features = [],
        enzymes = [];
    //generate complementary sequence
    var cSequence = '';

    //set the window width
    var width = 0;
    var padding = 10;

    //need to set other global variables
    //outer: only emzymes
    var r_enzy = genRatioVal((width + 2*padding), 2500, 30, 100); // will be updated later
       //inner and over circle: features
    var r_plasmid = width/2 - r_enzy;
    var r_plasmid_padding = genRatioVal((width + 2*padding), 2500, 2, 10);
    var twoPi = 2* Math.PI;

    //show enzyme cut numbers
    var cuts_number = 2;
    //length of the enzyme cut
    var cut_length = 30;

    //read the data 
    this.read = function(json){
        id = json.id;
        name = json.name;
        sequence = json.sequence;
        features = json.features;
        showEnzyme = json.showEnzyme;
        enzymes = json.enzymes;

        //sort data
        features.sort(sortByProperty('start'));
        enzymes.sort(sortByProperty('cut'));

        //get the width for svg
        width = $(id).width() - padding * 2; //padding on each side
        width = width < 250 ? 250 : width;

        //     //outer: only emzymes
        r_enzy = genRatioVal((width + 2*padding), 2500, 30, 100); // will be updated later
        //inner and over circle: features
        r_plasmid = width/2 - r_enzy;
        r_plasmid_padding = genRatioVal((width + 2*padding), 2500, 2, 10);
    }


    //draw
    this.draw = function(){
        //draw empty svg
        var svg = drawSVG(id, width, padding);

        //draw plasmid
        var plasmid = drawPlasmid(svg, id, width, padding, name, r_enzy, r_plasmid, r_plasmid_padding, twoPi);
        //draw enzymes
        if(showEnzyme){
            drawEnzyme(svg, enzymes, cuts_number, sequence.length, width, cut_length, r_enzy, r_plasmid, r_plasmid_padding);
        }
    }

    //redraw
    this.redraw = function(){
        $(id).empty();
        width = $(id).width() - padding * 2; //padding on each side
        width = width < 250 ? 250 : width;

        //     //outer: only emzymes
        r_enzy = genRatioVal((width + 2*padding), 2500, 30, 100); // will be updated later
        //inner and over circle: features
        r_plasmid = width/2 - r_enzy;
        r_plasmid_padding = genRatioVal((width + 2*padding), 2500, 2, 10);

        //draw empty svg
        var svg = drawSVG(id, width, padding);

        //draw plasmid
        var plasmid = drawPlasmid(svg, id, width, padding, name, r_enzy, r_plasmid, r_plasmid_padding, twoPi);

        //draw enzymes
        if(showEnzyme){
            drawEnzyme(svg, enzymes, cuts_number, sequence.length, width, cut_length, r_enzy, r_plasmid, r_plasmid_padding);
        }
    }
}


    //draw empty using d3
    function drawSVG(id, width, padding) { 
        //calculate the width
        var svg = d3.select(id)
                    .append("svg")
                    .attr("width", width + padding * 2)
                    .attr("height", width + padding * 2)
                        .append("g")
                            .attr("transform", "translate(" + padding +"," + padding + ")");
        return svg;
    }

    //draw plasmid
    function drawPlasmid(svg, id, width, padding, name, r_enzy, r_plasmid, r_plasmid_padding, twoPi){

       var arc = d3.arc()
                    .startAngle(0)
                    .endAngle(twoPi)
                    .innerRadius(r_plasmid - r_plasmid_padding)
                    .outerRadius(r_plasmid);

       var backbone = svg.append('g').attr("transform", "translate(" + (r_plasmid + r_enzy) + "," + (r_plasmid + r_enzy) + ")");
            //plasmid label
            backbone.append("text")
                    .attr("class", "plasmidName noEvent")
                    .attr("display", function(){
                        return (width + 2*padding) <= 500 ? "none" : "inherit";
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .style("font-family", "monospace")
                    .style("font-size", function(){
                        var fontSize = genRatioVal((width + 2*padding), 2500, 15, 30);
                        return fontSize +"px";
                    })
                    .style("fill", "#636363")
                    .text(name);
            //backbone plasmid
            backbone.append("path")
                    .attr("stroke", "#6baed6")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("fill", "#c6dbef")
                    .attr("fill-opacity", .5)
                    .attr("d", arc);

        return svg;
        
    }

    //draw enzymes
    function drawEnzyme(svg, enzymes, cuts_number, totalLength, width, cut_length, r_enzy, r_plasmid, r_plasmid_padding){
        //nest emzymes by enzyme
        var nestedEnzymes = d3.nest()
                              .key(function(d){return d.name.split(' ')[0];})
                              .entries(enzymes);
            console.log(nestedEnzymes);
        var enzy = svg.append('g').attr("transform", "translate(" + (r_plasmid + r_enzy) + "," + (r_plasmid + r_enzy) + ")");
        if(cuts_number == -1){
                //draw all the cuts
                enzymes.forEach(function(d, i){
                //convert number to angle
                var angles = nt2angle(+d.cut, totalLength);
                //add cut line on plasmid backbone
                var arc = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - r_plasmid_padding + cut_length/2)
                        .outerRadius(r_plasmid - cut_length/2);
                enzy.datum(d)
                    .append("path")                
                    .attr("stroke", "#1f77b4")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("fill", "#c6dbef")
                    .attr("fill-opacity", .5)
                    .attr("d", arc);
                
                //enzyme mouse events
                enzy.on("mouseover", function(d){console.log(d);})
                    .on("mouseout", function(d){console.log(d);});
            })
        }
        else{
            //only show the enzymes have the cuts_number
            nestedEnzymes.forEach(function(d, i){
                if(d.values.length == cuts_number){
                    //loop into the enzymes
                    d.values.forEach(function(sd, si){
                    //convert number to angle
                    var angles = nt2angle(+sd.cut, totalLength);
                    var arc = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - r_plasmid_padding + cut_length/2)
                        .outerRadius(r_plasmid - cut_length/2);
                //draw curs
                enzy.datum(sd)
                    .append("path")                
                    .attr("stroke", "#1f77b4")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("fill", "#c6dbef")
                    .attr("fill-opacity", .5)
                    .attr("d", arc);
                
                //enzyme mouse events
                enzy.on("mouseover", function(d){console.log(d);})
                    .on("mouseout", function(d){console.log(d);});
                    })
                }
            })
        }

    }


    //generate complementary sequence
    function genCSeq(sequence){
        var cSequence ="";
        var cSeqArray = [];
        var seqArray = sequence.toUpperCase().split('');
        $.each(seqArray, function(i, d){
            if(d === "A"){
                cSeqArray.push("T")
            }
            else if(d==="T"){
                cSeqArray.push("A")
            }
            else if(d==="G"){
                cSeqArray.push("C")
            }
            else{
                cSeqArray.push("G")
            }
        })
        return cSeqArray.join('');
    }

    //generate sequence that split with a symbol every 10 nt and output the array
    function formatSeq(sequence){
        var symbol = ' ', ntPerLine = 80; //fasta seq
        var outputArray = [];
        var array = sequence.match(new RegExp('.{1,' + ntPerLine + '}', 'g')).join('|').split('|');
        $.each(array, function (i, d) { 
            var itemSeq = d.match(/.{1,10}/g).join(symbol);
            outputArray.push(itemSeq);
        })
        return outputArray;
    }

    function sortByProperty(property) {
        'use strict';
        return function (a, b) {
            var sortStatus = 0;
            if (a[property] < b[property]) {
                sortStatus = -1;
            } else if (a[property] > b[property]) {
                sortStatus = 1;
            }
            return sortStatus;
        };
    }

    function reverseSortByProperty(property) {
        'use strict';
        return function (a, b) {
            var sortStatus = 0;
            if (a[property] < b[property]) {
                sortStatus = 1;
            } else if (a[property] > b[property]) {
                sortStatus = -1;
            }
            return sortStatus;
        };
    }
    
    //format feature for class
    function formatName(name){
        var nameArray = name.split('');
        var finalArray = [];
        $.each(nameArray, function(i, d){
            if(i==0){
                if((/[a-zA-Z]/.test(d))){
                    finalArray.push(d);
                }
            }
            else{
                if((/[a-zA-Z0-9]/.test(d))){
                    finalArray.push(d);
                }
            }
        })
        return finalArray.join('');
    }

    //render google color
    function colores_google(n) {
        var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
        return colores_g[n % colores_g.length];
    }

    //change the value based on the width
    function genRatioVal(current, max, minValue, maxValue){
        var output = minValue;
        var value = current / max * maxValue;
        output = value > maxValue ? maxValue : value;
        output = output < minValue ? minValue : output;
        return output;
    }


    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI + 180;
        return a > 90 ? a - 180 : a;
    }

    //convert nt number to angle
    function nt2angle(pos, total){
        //get per nt angle
        var angle1nt = (2 * Math.PI) / total;
        //var angle1nt = (360 / total) * (2 * Math.PI);
        anglePos = angle1nt * pos;
        return [anglePos, anglePos + angle1nt];
    }