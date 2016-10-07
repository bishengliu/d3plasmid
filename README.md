This is the js API for drawing the plasmid map using d3, version 1.0.0, 2016-10-07. 

HOWTO
```
        //configure data for the api
        var data = {
                    id: "#plasmid", //id of the plasmid div
                    form: "#featureEdit", //form id for edit feature
                    addFeatureId : "#featureAdd", //form id for adding feature
                    name: name, //plasmid name
                    sequence: sequence, //sequence
                    features: features, //all features
                    showEnzyme: true, //whether to show enzyme cuts on the map
                    enzymes: enzymes, //all enzymes
                    cuts_number : -1 //-1 show all cuts, change to any number to show the enzymes that have the number of cuts. It doesn't accept an array                    
        };
           //draw the plasmid
            var dp = new Plasmid();
            dp.read(data);
            //draw the circular map
            dp.draw();
            // or umcomment below draw the linear map.
            //dp.drawLinear();

            //redraw svg when resize the window
            $(window).resize(function (){
                    //draw the circular map
                    dp.redraw();
                    //draw the linear map
                    //dp.redrawLinear();
            });
        //check the index.html for details
```