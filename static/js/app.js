  
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
  d3.json("./data/samples.json").then((data)=> {
    data.metadata.filter(i=>i.id == selected_id).forEach((report)=>{
    var row = d3.select("#sample-metadata");
      Object.entries(report).forEach(([key, value]) => {
      row.append("h6").text(`${key}:${value}`);
      });
    });
  });
};

  
GetInfo("940");
  
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
            r: 20,
            t: 20,
            b: 20
        },
        width:400,
        height:500,
    };
    
    Plotly.newPlot('bar', data_bar,layout_bar);

     
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
      xaxis: {
        title: {text: 'OTU ID'}
      },
    };
      
    Plotly.newPlot('bubble', data_bubble, layout_bubble);

    });
  };
    
  GetPlot("940")
  
  