//READ IN JSON FILE
d3.json("samples.json").then((data) => {
    console.log(data);
  });

//Create variables
var idSelect = d3.select('#selDataset');
var barChart = d3.select('#bar');
var bubbleChart = d3.select('#bubble')
var dropdown = d3.select("select");
var sampleMetadata = d3.select("#sample-metadata");
var selection = dropdown.property("value");


//Populate initial dropdown
function optionChanged(dropdownSelection) {
    dropdown.on("onchange", updatePage(dropdownSelection))
};

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.

function plotCharts() {
    data.then(function(data) {
        var sampleData = data.samples
        var extendData = Object.entries(sampleData)
        var values = unpack(extendData,1)
        var filteredSample = data.samples.filter(sample => sample.id == id)[0];
        var sampleValue = filteredSample.sample_values
        var otuID = filteredSample.otu_id
        var otuLabel = filteredSample.otu_labels

        //retrieve top 10
        var topTenValues = sampleValue.slice(0,10)
        var topTenIDs = otuID.slice(0,10)
        topTenIDs.forEach((key, value) => {
            var topTenLabels = otuLabel.slice(0,10)

        barChart.html("")
        bubbleChart.html("")

        var trace1 = [{
            x: topTenValues, 
            y: topTenIDs,
            text: topTenLabels,
            type: "bar",
            orientation: "h"
        }];

        var trace2 = [{
            x: otuID,
            y: sampleValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                size: sampleValue,
                color: otuID
            }
        }]
        Plotly.newPlot("bar", trace1)
        Plotly.newPlot("bubble", trace2)
        })
    })
};

//Initialize page
function init() {
    data.then(function(data) {
        Object.entries(data.names).forEach(function([key, value]) {
        var options = dropdown.append("option")
        .attr('value', value)
        options.text(value)
     }) 
    })
}

init()
