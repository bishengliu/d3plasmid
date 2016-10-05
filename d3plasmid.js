
    //this is the js API for draw plasmid using d3

    function Plasmid(){
        //set some global varaibles
        var id = '',
            form ='',
            name = '',
            sequence ='',
            showEnzyme = true,
            features = [],
            enzymes = [];
        //generate complementary sequence
        var cSequence = '';

        //set the window width
        var width = 0;
        var padding = 100;

        //need to set other global variables
        //outer: only emzymes
        var r_enzy = genRatioVal((width + 2*padding), 2500, 100, 250); // will be updated later
        //inner and over circle: features
        var r_plasmid = width/2 - r_enzy;
        var r_plasmid_padding = genRatioVal((width + 2*padding), 2500, 2, 10);
        var twoPi = 2* Math.PI;

        //show enzyme cut numbers
        var cuts_number = -1;
        //length of the enzyme cut
        var cut_length = 40;
        //cut label line length
        var lable_line_length = 40;
        var lable_line_distance = 40;
        var text_line_distance = 40;

        //marker_length
        marker_length = 20;

        //features
        var feature_gap=20, featureWidth = 5;

        //variables for the mouse event
        var selectEnzyme ="";


        //for linear parameters
        var l_padding = 100;
        var t_padding =100; //gap to the top
        var l_enzy=100;
        //where the plasmid name, relative to the backbone
        var name_height = 20;
        var dna_gap = 6;
        //for minimal enzyme lable-line gap
        var label_line_gap = 10;

        //read the data
        this.read = function(json){
            id = json.id;
            form = json.form;
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

            //outer: only emzymes
            r_enzy = genRatioVal((width + 2*padding), 2500, 100, 250); // will be updated later
            //inner and over circle: features
            r_plasmid = width/2 - r_enzy;
            r_plasmid_padding = genRatioVal((width + 2*padding), 2500, 2, 10);
            cut_length = genRatioVal((width + 2*padding), 2500, 14, 40);
            lable_line_length = genRatioVal((width + 2*padding), 2500, 10, 30);
            lable_line_distance = genRatioVal((width + 2*padding), 2500, 20, 40);
            text_line_distance = genRatioVal((width + 2*padding), 2500, 50, 80);
            marker_length = genRatioVal((width + 2*padding), 2500, 7, 20);
            featureWidth = genRatioVal((width + 2*padding), 2500, 0, 5);
            feature_gap = genRatioVal((width + 2*padding), 2500, 20, 40);

            //for linear parameters
            l_padding = genRatioVal($(id).width(), 2500, 50, 100);            
            t_padding = genRatioVal(($(id).width()), 2500, 100, 250);
            l_enzy = genRatioVal(($(id).width()), 2500, 100, 250);
            //where the plasmid name
            name_height = 20;
            dna_gap = genRatioVal(($(id).width()), 2500, 3, 6);
            //for minimal enzyme lable-line gap
            label_line_gap = genRatioVal(($(id).width()), 2500, 25, 15);
        }

        //draw circular map
        this.draw = function(){
            //draw empty svg
            var svg = drawSVG(id, width, padding);

            //draw plasmid
            var plasmid = drawPlasmid(svg, id, width, padding, name, r_enzy, r_plasmid, r_plasmid_padding, twoPi);
            //draw enzymes
            if(showEnzyme && width >= 650){
                var enzyme = drawEnzyme(svg, enzymes, cuts_number, sequence.length, width, lable_line_length, lable_line_distance, text_line_distance, cut_length, r_enzy, r_plasmid, r_plasmid_padding, selectEnzyme);
            }

            //draw sequence count on plasmid backbone
            var markers = drawSeqCount(svg, sequence.length, width,  r_enzy, r_plasmid, r_plasmid_padding, marker_length);

            //draw features
            var pFeatures = drawFeature(svg, features, width, r_enzy, r_plasmid, r_plasmid_padding, sequence, feature_gap, featureWidth, form);

            //rotate feature
            //get the plasmid div width
            // var pWidth = $("#plasmid").width();
            // var pHeight = $("#plasmid").height();
            // d3.select("#plasmid_map")
            //     .transition().duration(750)
            //     .attr("transform", "rotate(90 "+ (pWidth/2) +" "+ (pHeight/2) +")");
        }

        //redraw circular map
        this.redraw = function(){
            $(id).empty();
            width = $(id).width() - padding * 2; //padding on each side
            width = width < 500 ? 500 : width;

            //     //outer: only emzymes
            r_enzy = genRatioVal((width + 2*padding), 2500, 100, 250); // will be updated later
            //inner and over circle: features
            r_plasmid = width/2 - r_enzy;
            r_plasmid_padding = genRatioVal((width + 2*padding), 2500, 2, 10);
            cut_length = genRatioVal((width + 2*padding), 2500, 14, 40);
            lable_line_length = genRatioVal((width + 2*padding), 2500, 10, 30);
            lable_line_distance = genRatioVal((width + 2*padding), 2500, 20, 40);
            text_line_distance = genRatioVal((width + 2*padding), 2500, 50, 80);
            marker_length = genRatioVal((width + 2*padding), 2500, 7, 20);
            featureWidth = genRatioVal((width + 2*padding), 2500, 0, 5);
            feature_gap = genRatioVal((width + 2*padding), 2500, 20, 40);
            //draw empty svg
            var svg = drawSVG(id, width, padding);

            //draw plasmid
            var plasmid = drawPlasmid(svg, id, width, padding, name, r_enzy, r_plasmid, r_plasmid_padding, twoPi);

            //draw enzymes
            if(showEnzyme  && width >= 650){
                var enzyme = drawEnzyme(svg, enzymes, cuts_number, sequence.length, width, lable_line_length, lable_line_distance, text_line_distance, cut_length, r_enzy, r_plasmid, r_plasmid_padding, selectEnzyme);
            }

            //draw sequence count on plasmid backbone
            var markers = drawSeqCount(svg, sequence.length, width,  r_enzy, r_plasmid, r_plasmid_padding, marker_length);

            //draw features
            var pFeatures = drawFeature(svg, features, width, r_enzy, r_plasmid, r_plasmid_padding, sequence, feature_gap, featureWidth, form);
        }

        //draw linear map
        this.drawLinear =function(){
            //draw empty svg
            var svg = drawSVG(id, width, l_padding);
            //draw linear map
            var plasmid = drawLinearPlasmid(svg, id, width, name, t_padding, l_enzy, l_padding, name_height, dna_gap);
            //draw enzymes
            var enzyme = drawLinearEnzyme(svg, enzymes, cuts_number, sequence.length, width, t_padding, l_enzy, l_padding, lable_line_length, text_line_distance, label_line_gap, cut_length, dna_gap, selectEnzyme);

        }
        //redraw linear map 
        this.redrawLinear =function(){
            $(id).empty();
            //get the width for svg
            width = $(id).width() - padding * 2; //padding on each side
            width = width < 250 ? 250 : width;

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
                            .attr("id", "plasmid_map")
                            .attr("transform", "translate(" + padding + "," + padding + ")");
        return svg;
    }

    //draw plasmid backbone
    function drawPlasmid(svg, id, width, padding, name, r_enzy, r_plasmid, r_plasmid_padding, twoPi){

       var arc = d3.arc()
                    .startAngle(0)
                    .endAngle(twoPi)
                    .innerRadius(r_plasmid - r_plasmid_padding)
                    .outerRadius(r_plasmid);

       var backbone = svg.append('g').attr("transform", "translate(" + (r_plasmid + r_enzy) + "," + (r_plasmid + r_enzy) + ")").attr("id", "backbone");
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
                    .text(function(){
                        if(width>=650){return name;} else { return '';}
                    });
            //backbone plasmid
            backbone.append("path")
                    .attr("stroke", "#6baed6")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("fill", "#c6dbef")
                    .attr("fill-opacity", .5)
                    .attr("d", arc);

        return svg;

    }

    //draw linear plasmid backbone
    function drawLinearPlasmid(svg, id, width, name, t_padding, l_enzy, l_padding, name_height, dna_gap){
        var backbone = svg.append('g').attr("transform", "translate(" + (0) + "," + (t_padding + l_enzy) + ")").attr("id", "backbone");
            //draw lines for dna backbone
            //first line
            var plasmid = backbone.append("g");
            plasmid.append("line")
                    .style("stroke", "#9ecae1")
                    .attr("x1", 0 - dna_gap)
                    .attr("y1", 0)
                    .attr("x2", width + dna_gap)
                    .attr("y2", 0);
            //second line
            plasmid.append("line")
                    .style("stroke", "#9ecae1")
                    .attr("x1", 0 - dna_gap)
                    .attr("y1", 0 + dna_gap)
                    .attr("x2", width + dna_gap)
                    .attr("y2", 0 + dna_gap);

            //plasmid label
            backbone.append("text")
                    .attr("transform", "translate(" + (width/2) + "," + name_height + ")")
                    .attr("id", "pName")
                    .attr("class", "plasmidName noEvent")
                    .attr("display", function(){
                        return (width + 2*l_padding) <= 500 ? "none" : "inherit";
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .style("font-family", "monospace")
                    .style("font-size", function(){
                        var fontSize = genRatioVal((width + 2*l_padding), 2500, 15, 30);
                        return fontSize +"px";
                    })
                    .style("fill", "#636363")
                    .text(function(){
                        if(width>=650){return name;} else { return '';}
                    });            
         return svg;
    }
    //draw enzymes
    function drawEnzyme(svg, enzymes, cuts_number, totalLength, width, lable_line_length, lable_line_distance, text_line_distance, cut_length, r_enzy, r_plasmid, r_plasmid_padding, selectEnzyme){

        //nest emzymes by enzyme
        var nestedEnzymes = d3.nest()
                              .key(function(d){return d.name.split(' ')[0];})
                              .entries(enzymes);
        var enzySVG = svg.append('g').attr("transform", "translate(" + (r_plasmid + r_enzy) + "," + (r_plasmid + r_enzy) + ")").attr("id", "enzyme");
        if(cuts_number == -1){
                var pie = d3.pie()
                    .sort(null)
                    .value(function (d) { return +d.cut; });

                //draw all the cuts
                enzymes.forEach(function(d, i){
                //convert number to angle
                var angles = nt2angle(+d.cut, totalLength);
                //add cut line on plasmid backbone
                var arc = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - r_plasmid_padding + cut_length/2)
                        .outerRadius(r_plasmid);
                var arc2 = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - cut_length/2 + lable_line_distance)
                        .outerRadius(r_plasmid - cut_length/2 + lable_line_length + lable_line_distance);

                var arc3 = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - cut_length/2 + lable_line_distance + text_line_distance)
                        .outerRadius(r_plasmid - cut_length/2 + lable_line_length + lable_line_distance + 60);

                var enzy = enzySVG.append("g").attr("class", function(){
                        return d.name.split(' ')[0];
                    })
                    .datum(d);
                //cuts
                var cut = enzy
                    .append("path")
                    .attr("class", function(d){
                        return d.name.split(' ')[0] + "-cut";
                    })
                    .attr("stroke", "#8c564b")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("fill-opacity", .5)
                    .attr("d", arc);
                //need to add enzyme label and lines
                var line = enzy
                    .append("path")
                    .attr("class", function(d){
                        return d.name.split(' ')[0] + "-line";
                    })
                    .attr("stroke", "#cedb9c")
                    .attr("stroke-width", function(){return width > 800 ? 0.5 : .25})
                    .attr("fill-opacity", .2)
                    .attr("d", arc2);

                //add line that between cuts and ezyme label
                var label = enzy.append("text")
                                .attr("class", function(d){
                                        return d.name.split(' ')[0] + "-text";
                                    })
                                .attr("dy", ".35em")
                                .attr("text-anchor", "middle")
                                .attr("transform", function (d) {
                                    return "translate(" + arc3.centroid(pie(+d.cut)[0]) + ")rotate(" + angle(angles) + ")";
                                })
                                .style("fill", "gray")
                                .style("font", "12px Arial")
                                .text(function(d){return d.name.split(' ')[0] + " (" + d.cut + ")" ;});

                //enzyme mouse events
                enzy.on("mouseover", function(d){
                    //update select emzymes
                    selectEnzyme = d.name.split(' ')[0];
                    //get the line class
                    var cutClass = "."+ d.name.split(' ')[0] +"-cut";
                    d3.selectAll(cutClass).attr("stroke", "blue");
                    //get the label class
                    var lineClass = "."+d.name.split(' ')[0] +"-line";
                    d3.selectAll(lineClass).attr("stroke", "blue");
                    //get text class
                    var textClass = "."+d.name.split(' ')[0] +"-text";
                    d3.selectAll(textClass).style("fill", "blue").style("font", "16px Arial");
                })
                    .on("mouseout", function(d){
                        //get the line class
                    var cutClass = "."+ d.name.split(' ')[0] +"-cut";
                    d3.selectAll(cutClass).attr("stroke", "#8c564b");
                    //get the label class
                    var lineClass = "."+d.name.split(' ')[0] +"-line";
                    d3.selectAll(lineClass).attr("stroke", "#cedb9c");
                    //get text class
                    var textClass = "."+d.name.split(' ')[0] +"-text";
                    d3.selectAll(textClass).style("fill", "gray").style("font", "11px Arial");
                    });
            })

        }
        else{
            var pie = d3.pie()
                    .sort(null)
                    .value(function (d) { return +d.cut; });

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
                        .outerRadius(r_plasmid);

                    var arc2 = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - cut_length/2 + lable_line_distance)
                        .outerRadius(r_plasmid - cut_length/2 + lable_line_length + lable_line_distance);

                    var arc3 = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - cut_length/2 + lable_line_distance + text_line_distance)
                        .outerRadius(r_plasmid - cut_length/2 + lable_line_length + lable_line_distance + 60);


                var enzy = enzySVG.append("g").attr("class", function(){
                            return sd.name.split(' ')[0];
                        })
                //draw curs
                enzy.datum(sd)
                    .append("path")
                    .attr("class", function(d){
                                        return d.name.split(' ')[0] + "-cut";
                                    })
                    .attr("stroke", "#8c564b")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("fill-opacity", .5)
                    .attr("d", arc);
                //need to add enzyme label and lines
                var line = enzy.datum(sd)
                    .append("path")
                    .attr("class", function(d){
                        return d.name.split(' ')[0] + "-line";
                    })
                    .attr("stroke", "#cedb9c")
                    .attr("stroke-width", function(){return width > 800 ? 0.5 : .25})
                    .attr("fill-opacity", .2)
                    .attr("d", arc2);

                //add line that between cuts and ezyme label
                var label = enzy.append("text")
                                .attr("class", function(d){
                                        return d.name.split(' ')[0] + "-text";
                                    })
                                .attr("dy", ".35em")
                                .attr("text-anchor", "middle")
                                .attr("transform", function (d) {
                                    return "translate(" + arc3.centroid(pie(+d.cut)[0]) + ")rotate(" + angle(angles) + ")";
                                })
                                .style("fill", "gray")
                                .style("font", "12px Arial")
                                .text(function(d){return d.name.split(' ')[0];});

                //enzyme mouse events
                                //enzyme mouse events
                enzy
                    .on("mouseover", function(d){
                        //update select emzymes
                        selectEnzyme = d.name.split(' ')[0];
                        //get the line class
                        var cutClass = "."+ d.name.split(' ')[0] +"-cut";
                        d3.selectAll(cutClass).attr("stroke", "blue");
                        //get the label class
                        var lineClass = "."+d.name.split(' ')[0] +"-line";
                        d3.selectAll(lineClass).attr("stroke", "blue");
                        //get text class
                        var textClass = "."+d.name.split(' ')[0] +"-text";
                        d3.selectAll(textClass).style("fill", "blue").style("font", "16px Arial");
                    })
                    .on("mouseout", function(d){
                        //get the line class
                    var cutClass = "."+ d.name.split(' ')[0] +"-cut";
                    d3.selectAll(cutClass).attr("stroke", "#8c564b");
                    //get the label class
                    var lineClass = "."+d.name.split(' ')[0] +"-line";
                    d3.selectAll(lineClass).attr("stroke", "#cedb9c");
                    //get text class
                    var textClass = "."+d.name.split(' ')[0] +"-text";
                    d3.selectAll(textClass).style("fill", "gray").style("font", "11px Arial");
                    });

                    })
                }
            })
        }
        return svg;
    }

    //draw linear enzymes
    function drawLinearEnzyme(svg, enzymes, cuts_number, totalLength, width, t_padding, l_enzy, l_padding, lable_line_length, text_line_distance, label_line_gap, cut_length, dna_gap, selectEnzyme){
        //nest emzymes by enzyme
        var nestedEnzymes = d3.nest()
                              .key(function(d){return d.name.split(' ')[0];})
                              .entries(enzymes);
        var enzySVG = svg.append('g').attr("transform", "translate(" + (0) + "," + (t_padding + l_enzy) + ")").attr("id", "enzyme");
        if(cuts_number == -1){
            //draw enzymes cuts
            //set the start label_line_length
            var lineLength = lable_line_length;
            enzymes.forEach(function(d, i){
                var enzy = enzySVG.append("g").attr("class", function(){
                        return d.name.split(' ')[0];
                    })
                    .datum(d);
                //cuts
                var cut = enzy
                    .append("line")
                    .attr("class", function(d){
                        return d.name.split(' ')[0] + "-cut";
                    })
                    .attr("stroke", "#8c564b")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("stroke-opacity", .2)
                    .attr("x1", function(d){
                        return pos2Length(d.cut, totalLength, width);
                    })
                    .attr("y1", 0 - cut_length/4)
                    .attr("x2", function(d){
                        return pos2Length(d.cut, totalLength, width) + .5;
                    })
                    .attr("y2", 0 + cut_length/4 + dna_gap);
                
                //label-line
                var labelLine = enzy.append("line")
                                    .attr("class", function(d){
                                        return d.name.split(' ')[0] + "-line";
                                    })
                                    .attr("stroke", "#cedb9c")
                                    .attr("stroke-width", function(){return width > 800 ? .5 : .2})
                                    .attr("stroke-opacity", .5)
                                    .attr("x1", function(d){
                                        return pos2Length(d.cut, totalLength, width);
                                    })
                                    .attr("y1", 0 - cut_length/2 - lineLength)
                                    .attr("x2", function(d){
                                        return pos2Length(d.cut, totalLength, width) + .5;
                                    })
                                    .attr("y2", 0 - cut_length/2);
                ////label-text
                var labelText = enzy.append("text")
                                .attr("class", function(d){
                                        return d.name.split(' ')[0] + "-text";
                                    })
                                .attr("text-anchor", "begin")
                                .attr("transform", function (d) {
                                    return "translate(" + (pos2Length(d.cut, totalLength, width) + .5) + "," + (-lineLength) + ")rotate(-90)";
                                })
                                .style("fill", "gray")
                                .style("font", "10px Arial")
                                .text(function(d){return d.name.split(' ')[0] + " (" + d.cut + ")" ;});

                if(i < enzymes.length -1){                    
                    if(pos2Length(enzymes[i+1].cut, totalLength, width) - pos2Length(d.cut, totalLength, width) <= label_line_gap){
                        lineLength += 30; //make the label line length
                    }
                    else{
                        lineLength = lable_line_length;
                    }
                }
                


            });
        }
        else
        {

        }

    }

    //draw the inner seqCount
    function drawSeqCount(svg, seqLength, width, r_enzy, r_plasmid, r_plasmid_padding, marker_length){
        //add g
        var markerG = svg.append('g').attr("transform", "translate(" + (r_plasmid + r_enzy) + "," + (r_plasmid + r_enzy) + ")").attr("id", "markers");
        //process the seq length to get only location of 1000
        var positions = genSeqCount(seqLength);
        var pie = d3.pie()
                    .sort(null)
                    .value(function (d) { return d; });
        positions.forEach(function(d, i){
            //get the angle for rach positions
            var angles = nt2angle(d, seqLength);
            var arc = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - r_plasmid_padding)
                        .outerRadius(r_plasmid - marker_length);
            var arc2 = d3.arc()
                        .startAngle(angles[0])
                        .endAngle(angles[1])
                        .innerRadius(r_plasmid - r_plasmid_padding - marker_length)
                        .outerRadius(r_plasmid - 2* marker_length);
            //markers
            var markers = markerG.datum(d)
                    .append("path")
                    .attr("stroke", "#2ca02c")
                    .attr("stroke-width", function(){return width > 800 ? 2 : 1})
                    .attr("d", arc);

            //add label
            var label = markerG.append("text")
                                .attr("class", "noEvent")
                                .attr("dy", ".35em")
                                .attr("text-anchor", "middle")
                                .attr("transform", function (d) {
                                    return "translate(" + arc2.centroid(pie(d)) + ")rotate(" + angle(angles) + ")";
                                })
                                .style("fill", "#2ca02c")
                                .style("font", "12px Arial")
                                .text(function(d){return Math.trunc(d/1000)+"K" ;});
        })
        return svg;
    }

    //draw features
    function drawFeature(svg, features, width, r_enzy, r_plasmid, r_plasmid_padding, sequence, feature_gap, featureWidth, form){
        //tooltip for the mouseover event
        //first remove all the tooltip
        d3.selectAll(".rectTooltip").remove();
        var tooltip = d3.select("body").append("div").attr("class", "rectTooltip").style("opacity", 0);
        //deep copy the features to keep the original features not removed by the function below
        var temaFeatures = [];
        features.forEach(function(d, i){
            temaFeatures.push(d);
        })
        var featureRects = svg.append('g').attr("transform", "translate(" + (r_plasmid + r_enzy) + "," + (r_plasmid + r_enzy) + ")").attr("id", "features");
        var fLines = formatFeatures(temaFeatures);
        var margin = feature_gap; //gap between feature lines
        fLines.forEach(function(d, i){
            //reverse array
            d.reverse();
            if(d.length >0){
                //draw features in each line
                //cal the start angle and endAngle for each features
                var angles = [];
                d.forEach(function(sd, si){
                    var sAngle =nt2angle(+sd.start, sequence.length)[0];
                    var eAngle = nt2angle(+sd.end, sequence.length)[0];
                    //set the margins
                    angles.push([sAngle, eAngle]);
                    //feature g
                    var featureG = featureRects.append("g")
                                                  .datum(sd);
                    var arc = d3.arc()
                        .startAngle(sAngle)
                        .endAngle(eAngle)
                        .innerRadius(r_plasmid - r_plasmid_padding - featureWidth - margin)
                        .outerRadius(r_plasmid - margin);

                        //for clockwise arch
                    var arc2 = d3.arc()
                        .startAngle(eAngle)
                        .endAngle(nt2angle(+sd.end, sequence.length)[1])
                        .innerRadius(r_plasmid - r_plasmid_padding - featureWidth - margin)
                        .outerRadius(r_plasmid - margin);

                        //for feature name label
                    var arc3 = d3.arc()
                        .startAngle(sAngle)
                        .endAngle(eAngle + Math.PI/2)
                        .innerRadius(r_plasmid - r_plasmid_padding - featureWidth - margin - feature_gap/3*2)
                        .outerRadius(r_plasmid - margin - feature_gap/3*2);
                    //draw feature
                    //arrow
                    var arrow = featureG.append("defs").append("marker")
                                        .attr("class", "rectArrow")
                                        .attr("id", function(d){ return formatName(d.name, "rect") + "-marker";})
                                        .attr("refX", function(d){
                                            var shift = 0;
                                            if(d.clockwise == 0){
                                                shift = (r_plasmid_padding + featureWidth)/2;
                                            }
                                            if(d.clockwise == 1){
                                                shift = -.3;
                                            }
                                            return shift;
                                        })
                                        .attr("refY", 0)
                                        .attr("markerWidth", 2500)
                                        .attr("markerHeight", 2500)
                                        .attr("orient", function(){
                                            return "auto";
                                        })
                                        .append("path")
                                        .attr("d", function(){
                                            return "M0,0 L0,"+ (r_plasmid_padding + featureWidth) +" L"+(r_plasmid_padding + featureWidth)/2+","+(r_plasmid_padding + featureWidth)/2+" Z";
                                        })
                                        .attr("fill-opacity", .5)
                                        .style("fill", function(d){ return d.color;})
                                        .attr("transform", function(d){
                                            if(d.clockwise ==0){
                                                return "translate(" + (r_plasmid_padding + featureWidth)/2 + ", 0) scale(-1, 1)"; //mirrored fro anticlock wise
                                            }
                                        });

                    featureG.append("path")
                        .attr("class", function(d){
                           var className = formatName(d.name, "rect") + " featureRect";
                           return className;
                        })
                        .attr("fill", function(d){ return d.color;})
                        .attr("marker-start", function(d){
                            if(d.clockwise == 0){ return "url(#"+ formatName(d.name, "rect") + "-marker)"; }else{ return ''; } //clockwise will be added next
                        })
                        .attr("fill-opacity", .5)
                        .attr("d", arc);

                    //add extra arc for adding marker of clockwise
                    if(sd.clockwise==1){
                        featureG.append("path")
                        .attr("class", function(d){
                           var className = formatName(d.name, "rect") + " featureRect";
                           return className;
                        })
                        .attr("fill", function(d){ return d.color;})
                        .attr("marker-start", function(d){
                            if(d.clockwise == 1){ return "url(#"+ formatName(d.name, "rect") + "-marker)"; }else{ return ''; }
                        })
                        .attr("fill-opacity", .5)
                        .attr("d", arc2);
                    }

                    //add feature label
                    //define the text path
                    var textPath = featureG.append("defs").append("path").attr("d", arc3).attr("id", function(d){return formatName(d.name, "text") +"-textPath";});
                    //display the text along the path
                    featureG.append("text")
                            .attr("class", "noEvent")
                            .attr("id", function(d){return formatName(d.name, "text") +"-text";})
                            .attr("dy", ".35em")
                                .attr("text-anchor", "begin")
                                .style("fill", "gray")
                                .style("font", "12px Arial")
                                .append("textPath")
                                    .attr("class", "textpath")
                                    .attr("xlink:href", function(d){return "#"+ formatName(d.name, "text") +"-textPath";})
                                    .text(function(d){
                                        var degree = (eAngle - sAngle)*90;
                                        if(degree >=10 && width>= 800){
                                            return d.name;
                                        }
                                        else{
                                            return truncate(d.name, 5, '...');
                                        }
                                    });

                    //mouse events
                     featureG
                     .on("mouseover", function(d){
                         //get the feature rect and feature name and marker
                         var arrowId = "#"+ formatName(d.name, "rect") + "-marker";
                         var rectClass = '.'+formatName(d.name, "rect");
                         var nameId = '#'+formatName(d.name, "text") +"-text";
                         d3.select(arrowId).attr("fill-opacity", .8);
                         d3.selectAll(rectClass).attr("fill-opacity", .8);
                         d3.select(nameId).style("fill", function(d){return d.color;});
                         //show tooltip
                         //get the subsequence and format substring
                         var subSeq = formatSeq(sequence.substring(+d.start-1, +d.end-1), ' ', 40);
                         var subSeqString = convert2String(subSeq);
                         tooltip.html("<p class='text-center'><span class='text-danger'><b>"+ d.name + "</b></span><br/>(<i>Position</i>: " + d.start + "-" + d.end + ", <i>Clockwise</i>: <span class='text-primary'>"+ genDirection(d.clockwise)+"</span>)</p><hr/><p class='seqFont'>"+ subSeqString +'</p>')
                                .style("left", (d3.event.pageX +28) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                         tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        
                     })
                     .on("mouseout", function(d){
                            var arrowId = "#"+ formatName(d.name, "rect") + "-marker";
                            var rectClass = '.'+formatName(d.name, "rect");
                            var nameId = '#'+formatName(d.name, "text") +"-text";
                            d3.select(arrowId).attr("fill-opacity", .4);
                            d3.selectAll(rectClass).attr("fill-opacity", .4);
                            d3.select(nameId).style("fill", "gray");
                            //hide tooltip
                            tooltip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                     })
                     .on("click", function(d){
                         $(form).empty();
                         displayForm(form, d);
                         $("#close-feature-form").click(function(e){
                             event.preventDefault();
                             $(this).parent().parent().parent().slideUp();
                         });
                     })
                     ;

                }) //inner forEach
                margin = margin + feature_gap;
            }
        })
        return svg;
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

    function angle(d){
        var a = (d[0] + d[1]) * 90 / Math.PI + 180;
        a = a > 360 ? a - 360 : a;
        var output = 0;
        if(a < 90){
            output = a - 90;
        }
        else if(a >= 90 && a< 180){
            output = a - 90;
        }
        else if(a >= 180 && a< 270){
            output = a + 90;
        }
        else{
            output = a + 90;
        }
        return output;
    }
    //convert nt number to angle
    function nt2angle(pos, total){
        //get per nt angle
        var angle1nt = (2 * Math.PI) / total;
        //var angle1nt = (360 / total) * (2 * Math.PI);
        anglePos = angle1nt * pos;
        return [anglePos, anglePos + angle1nt];
    }

    //process the seq length to get only location of 1000
    function genSeqCount(length){
        var count = Math.trunc(length / 1000);
        var array = [];
        for (i= 0; i <= count; i++){
            array.push(i * 1000);
        }
        return array;
    }

    //put features into lines to avoid overlapping
    function formatFeatures(features){
        //first sort features by start
        features.sort(sortByProperty('start'));

        var line = 0;
        var fLine =[];
        var total = features.length;

        //get the max possible lines and push empty array
        for(a=0; a< total; a++){
            fLine.push([]);
        }

        if(total>0){
            if(total === 1){
                Line[0].push(features[0]);
            }
            else
            {
                //>1
                var rFeature = features[features.length - 1];
                fLine[line].push(rFeature);
                features.pop();

                while(true){
                    if(features.length ===0){
                        break;
                    }

                    features.sort(sortByProperty('start'));
                    var tempArray = [];
                    if(features.length ===1){
                        if(line==0){
                            if(features[0].end <= rFeature.start){
                                fLine[0].push(features[0]);
                                features.pop();
                            }
                            else{
                                fLine[1].push(features[0]);
                                features.pop();
                            }
                        }
                        else{
                            if(features[0].end <= rFeature.start){
                                fLine[line].push(features[0]);
                            }
                            else{
                                fLine[line+1].push(features[0]);
                            }
                            features.pop();
                        }
                    }

                    if(features.length ===0){
                        break;
                    }

                    var z = features.length;
                    while(z--){
                        var lFeature = features[z];
                        if(lFeature.end <= rFeature.start){
                            fLine[line].push(lFeature);
                            rFeature = lFeature;
                            features.pop();
                        }
                        else{
                            tempArray.push(lFeature);
                            rFeature = lFeature;
                            features.pop();
                        }
                    }

                    if(tempArray.length == 0){
                        break;
                    }else{
                        line++;
                        features = tempArray;
                        features.sort(sortByProperty('start'));
                        rFeature = features[features.length - 1];
                        fLine[line].push(rFeature);
                        features.pop();
                    }
                }
            }
        }

        return fLine;
    }

    //formate feature name for class
    function formatName(name, type){
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
        return finalArray.join('')+"-"+type;
    }
    //truncate the feature name
    function truncate(str, maxLength, suffix) {
        if(str.length > maxLength) {
            str = str.substring(0, maxLength + 1); 
            str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
            str = str + suffix;
        }
	    return str;
    }

    function genDirection(clockwise){
        var result ='';
        if(clockwise==1){
            result = 'clockwise';
        }
        else if(clockwise ==0){
            result = 'anticlockwise';
        }
        else{
            result='';
        }
        return result;
    }

    //generate sequence that split with a symbol every 10 nt and output the array
    function formatSeq(sequence, symbol, ntPerLine){
        var outputArray = [];
        var array = sequence.match(new RegExp('.{1,' + ntPerLine + '}', 'g')).join('|').split('|');
        $.each(array, function (i, d) { 
            var itemSeq = d.match(/.{1,10}/g).join(symbol);
            outputArray.push(itemSeq);
        })
        return outputArray;
    }
    //convert array to string
    function convert2String(subSeq){
        var output ='';
        subSeq.forEach(function(d, i){
            output = output + d +'<br/>';
        })
        return output;
    }

    //form for editing features
    function displayForm(form, d){
        var html ='<div class="panel-group">';
            html +='<div class="panel panel-info">';
                html +='<div class="panel-heading">' + d.name;
                    html += '<div class="col-xs-2 pull-right"><button type="button" class="btn btn-xs btn-danger" id="close-feature-form">X</button></div>';
                html += '</div>';
                html +='<div class="panel-body">';
                    html += '<form method="POST" action="#">';
                    //name
                    html += '<div class="form-group">';
                        html += '<label for="feature-name" class="col-xs-12 col-form-label">Name</label>';
                        html += '<div class="col-xs-12">';
                            html += '<input class="form-control" type="text" value="'+d.name+'" id="feature-name">';
                        html += '</div>';
                    html += '</div>';
                    //color
                    html += '<div class="form-group">';
                        html += '<label for="feature-color" class="col-xs-12 col-form-label">Color</label>';
                        html += '<div class="col-xs-12">';
                            html += '<input class="form-control" type="color" value="'+d.color+'" id="feature-color">';
                        html += '</div>';
                    html += '</div>';
                    //button
                    html += '<div class="form-group  pull-right">';
                        html += '<div class="col-xs-12">';
                            html += '<button type="submit" class="btn btn-primary">Save Changes</button>';
                        html += '</div>';
                    html += '</div>';
                    html += '</form>';
                html += '</div>';
            html += '</div>';
        html += '</div>';
        $(form).append(html);
    }

    //for linear map, convert cut position to the length
    function pos2Length(pos, totalLength, width){
        return pos/totalLength * width;
    }