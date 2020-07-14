function showMetaData(id) {
    d3.json("samples.json").then((data) => {
        const metadata = data.metadata;
        const result = metadata.filter(meta => meta.id.toString() === id)[0];
        const demographicInfo = d3.select("#metadata");
        demographicInfo.html("");
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0] + ": " + key[1]);
        });
    });
}

function showPlot(id) {
    d3.json("samples.json").then(data => {
        var sampleFilter = data.samples.filter(sampleID => sampleID.id.toString() === id)[0];
        var topTenValues = sampleFilter.sample_values.slice(0,10);
        var topTenLabels = (sampleFilter.otu_ids.slice(0, 10)).map(id => "OTU " + id);
        var topTenHovertext = sampleFilter.otu_labels.slice(0,10);

        const barKey = [ {
            x: topTenValues,
            y: topTenLabels,
            text: topTenHovertext,
            type:"bar",
            orientation: "h", // makes horizontal
        } ];

        Plotly.newPlot("barchart", barKey);

        var ids = sampleFilter.otu_ids;
        var values = sampleFilter.sample_values;
        var hovertext = sampleFilter.otu_labels;

        const bubbleKey = [ {
            x: ids,
            y: values,
            mode: "markers",
            marker: {
                size: values,
                color: ids
            },
            text: hovertext
        } ];

        Plotly.newPlot("bubblechart", bubbleKey);
    });
}

function updateInfo(id) {
    showPlot(id);
    showMetaData(id);
}

function init() {
    const dropdown = d3.select("#sampleID");
    d3.json("samples.json").then((data)=> {
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        showPlot(data.names[0]);
        showMetaData(data.names[0]);
    });
}

init();