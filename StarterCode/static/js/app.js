//READ IN JSON FILE
d3.json("samples.json").then((data) => {
    console.log(data);
  });

//Create variables
var idSelect = d3.select('#selDataset');
var barChart = d3.select('#bar');
var bubbleChart = d3.select('#bubble')
var sampleMetadata = d3.select("#sample-metadata");
var dropdown = d3.select("select");


//Populate initial dropdown
function init() {
    d3.json("samples.json").then((data) => {
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name)
        }));

        //plot initial chart
        var initialChart = idSelect.property("value")
        plotCharts(initialChart)
    });
}

//dropdown menu selecton
d3.selectAll("#selDataset").on("onchange", updateChart);

function updateChart() {
    var idSelect = d3.select('#selDataset');
    var dataset = idSelect.property("value")
}


//reset data
function reset() {
    sampleMetadata.html("");
    barChart.html("");
    bubbleChart.html("");
};

//Plot charts

function plotCharts(id) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata.filter(m => m.id == id)[0];
        Object.entries(metadata).forEach(([k, v]) => {
            var metaList = sampleMetadata.append("ul");
            var listItem = metaList.append("li");
        })

        //Grab data for plots
        var singleSample = data.samples.filter(s => s.id == id)[0];
        var otuID = [];
        var otuLabels = [];
        var sampleValues = [];

        //Iterate
        Object.entries(singleSample).forEach(([k, v]) => {
            switch(k) {
                case "OTU_ID":
                    otuID.push(v);
                    break;
                case "SAMPLE_VALUES":
                    sampleValues.push(v);
                    break;
                case "OTU_LABELS":
                    otuLabels.push(v);
                    break;
            }
        });
    

        //retrieve top 10
        var topTenValues = sampleValues[0].slice(0,10).reverse();
        var topTenIDs = otuID[0].slice(0,10).reverse();
        var topTenLabels = otuLabels[0].slice(0,10).reverse();

        barChart.html("")
        bubbleChart.html("")

        //bar chart
        var trace1 = [{
            x: topTenValues, 
            y: topTenIDs,
            text: topTenLabels,
            type: "bar",
            orientation: "h"
        }];

        var traceBar = [trace1];

        Plotly.newPlot("bar", traceBar);

        //bubble chart
        var trace2 = [{
            x: otuID,
            y: sampleValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                size: sampleValue,
                color: otuID
            }
        }];

        var traceBubble = [trace2];

        Plotly.newPlot("bubble", traceBubble)
        })
};

init();
