function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samples = data.samples;
    //console.log(samples)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    //console.log(sampleArray)

    //  5. Create a variable that holds the first sample in the array.
    var sample1 = sampleArray[0];
    //console.log(sample1)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = sample1.otu_ids
    let otu_labels = sample1.otu_labels
    let sample_values = sample1.sample_values
    //console.log(otu_ids)
    //console.log(otu_labels)
    //console.log(sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let xticks = sample_values.slice(0,10).reverse();
    let yticks1 = otu_ids.slice(0,10).reverse() 
    let yticks = yticks1.map(item => "OTU " + item)
    let hoverticks = otu_labels.slice(0,10).reverse()
  
    //console.log(yticks);



    // 8. Create the trace for the bar chart. 
    let trace1 = {
      x: xticks,
      y: yticks,
      text: hoverticks,
      name: "chart",
      type: "bar",
      orientation: "h"
    };

    let barData = [trace1]

    // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",

    };
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    


    // Deliverable 2: Bubble charts


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      color: otu_ids,
      opacity: .8,
      size: sample_values
      }
      }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {title: "OTU ID"},
        showlegend: false,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 



//Deliverable 3: Gauge Chart
    // Create a variable that holds the samples array. 

    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    let metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    let metadata1 = metadataArray[0]


    // 3. Create a variable that holds the washing frequency.
    let washFreq = parseFloat(metadata1.wfreq)
  
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "Belly Button Washing Frequency<br>Scrubs Per Week</br>"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "darkblue" },
        steps: [
          { range: [0, 2], color: "white" },
          { range: [2, 4], color: "green" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "orange" },
          { range: [8, 10], color: "red" }
        ],
        //threshold: {
          //line: { color: "black", width: 4 },
          //thickness: 0.75,
          //value: 9
        //}
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {  width: 500, height: 500, margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

  
