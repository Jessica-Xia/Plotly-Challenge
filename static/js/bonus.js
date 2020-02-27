  
  function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");
        
    d3.json("./data/samples.json").then((data)=> {
             
      console.log(data);
                      
      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
        dropdown.append("option").text(name).property("value");
      });
    
      // initial plots
      GetPlot(data.names[0]);
      GetInfo(data.names[0]);
      
    });
  };
    
  init();
  
    
    
  function GetInfo(selected_id){
    d3.select("#sample-metadata").html("");
    d3.json("./data/samples.json").then((data)=> {
        data.metadata.filter(i=>i.id == selected_id).forEach((report) => {
            Object.entries(report).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h6").text(`${key}:${value}`)
            });
          });
      });
    };
  
    
  function GetPlot(selected_id){
    
    d3.json("./data/samples.json").then((data)=> {
      
      // Bar H
      var data_bar = [{
        type: 'bar',
        x: data.samples.filter(s=>s.id== selected_id).map(i=>i.sample_values.slice(0,10).reverse())[0],
        y: data.samples.filter(s=>s.id== selected_id).map(i=>i.otu_ids.slice(0,10).map(j=>"OTU "+j).reverse())[0],
        hovertext: data.samples.filter(s=>s.id== selected_id).map(i=>i.otu_labels.slice(0,10).reverse())[0],
        hoverinfo: "hovertext",
        orientation: 'h'
      }];
      var layout_bar = {
          margin: {
              l: 100,
              r: 0,
              t: 20,
              b: 0
          },
          width:400,
          height:400,
      };
      
      Plotly.newPlot('bar', data_bar,layout_bar);

      // Gauge

    var wfreq = data.metadata.filter(i=>i.id == selected_id).map(i=>i.wfreq);
    var level = wfreq*20;
    // Trig to calc meter point
    var degrees = 180 - level;
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var path1 = "M-.0 -0.05 L  .0 0.05 L";
    // Path: may have to change to create a better triangle
    var mainPath = path1,
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data_gauge = [{ type: 'category',
                x: [0], y:[0],
                marker: {size: 14, color:'850000'},
                showlegend: false,
                text: wfreq,
                hoverinfo: 'text'},
                { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                rotation: 90,
                text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                textinfo: 'text',
                textposition:'inside',
                marker: {colors:[
                        "rgba(0,105,11,.5)",
                        "rgba(10,120,22,.5)",
                        "rgba(14,127,0,.5)",
                        "rgba(110,154,22,.5)",
                        "rgba(170,202,42,.5)",
                        "rgba(202,209,95,.5)",
                        "rgba(210,206,145,.5)",
                        "rgba(232,226,202,.5)",
                        "rgba(240, 230,215,.5)",
                        "rgba(255,255,255,0)"
                        ]},
                labels:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                hoverinfo: "label",
                hole: .5,
                type: 'pie',
                showlegend: false
                }];

    var layout_gauge = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                    color: '850000'
                }
                }],
            height: 500,
            width: 500,
            margin: {
                l: 0,
                r: 0,
                t: 100,
                b: 0
            },
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            xaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                        showgrid: false, range: [-1, 1]}
            };

    Plotly.newPlot('gauge', data_gauge, layout_gauge);
       
      // Bubble
      var trace_bubble = {
        x: data.samples.filter(s=>s.id== selected_id).map(i=>i.otu_ids)[0],
        y: data.samples.filter(s=>s.id== selected_id).map(i=>i.sample_values)[0],
        text: data.samples.filter(s=>s.id== selected_id).map(i=>i.otu_labels)[0],
        mode: 'markers',
        marker: {
          color: data.samples.filter(s=>s.id== selected_id).map(i=>i.otu_ids)[0],
          size: data.samples.filter(s=>s.id== selected_id).map(i=>i.sample_values)[0],
          autocolorscale: false,
          colorscale: 'Earth'}
      };
        
      var data_bubble = [trace_bubble];
        
      var layout_bubble = {
        title: '',
        showlegend: false,
        height: 600,
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 200
        },
        xaxis: {
          title: {text: 'OTU ID'}
        },
      };
        
      Plotly.newPlot('bubble', data_bubble, layout_bubble);
  
      });
    };
      

    function optionChanged(id){
        GetPlot(id);
        GetInfo(id);
    }
    
    