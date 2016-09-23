
//this is the js API for draw plasmid using d3

function Plasmid(){
    //set some global varaibles
    var id = '',
        name = '',
        sequence ='',
        showEnzyme = false,
        features = [],
        enzymes = [];
    //generate complementary sequence
    var cSequence = '';

    //set the window width
    var wWidth = 0;
    var padding = 20;
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

        //get the window width
        wWidth = $(id).width() - padding * 2; //padding on each side
    }


    //draw
    this.draw = function(){
        //draw empty svg
        var svg = drawSVG(id);

        //draw plasmid

    }

    //redraw
    this.redraw = function(){
        //draw empty svg
        var svg = drawSVG(id);

        //draw plasmid
    }


    //draw empty using d3
    function drawSVG(id) { 
        var margin = {top: 20, right: 20, bottom: 20, left: 20};
        var width = +$(id).width() - margin.left - margin.right;
        var height = +$(id).width() - margin.top - margin.bottom;

        //calculate the width
        var svg = d3.select(id)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left +"," + margin.top + ")");
        return svg;
    }

    //draw plasmid


    //render google color
    function colores_google(n) {
        var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
        return colores_g[n % colores_g.length];
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


}