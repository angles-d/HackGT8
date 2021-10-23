var width = 750;
var height = 250;

// The svg
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)


// Map and projection
const projection = d3.geoMercator()
    .center([0,20])                // GPS of location to zoom on
    .scale(99)                       // This is like the zoom
    .translate([ width/2, height/2 ])

Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://angles-d.github.io/HackGT8/plasticWaste1.csv")
]).then(function (initialize) {

    let dataGeo = initialize[0]
    let data = initialize[1]

  // Create a color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Country))
    .range(d3.schemePaired);

  // Add a scale for bubble size
  const valueExtent = d3.extent(data, d => +d.n)
  const size = d3.scaleSqrt()
    .domain(valueExtent)  // What's in the data
    .range([1, 50])  // Size in pixel

  // Draw the map
  svg.append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .join("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "none")
      .style("opacity", .2)
      
    // create a tooltip
    const Tooltip = d3.select("#my_dataviz")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "circle")
      .style("opacity", 1)
      .style("background-color", "white")
      .style("border", "none")
      .style("border-width", "0px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      Tooltip.style("opacity", 1)
      .style("border-width", "2px")
    }
    var mousemove = function(event, d) {
      Tooltip
        .html(d.Country + "<br>" + "Plastic Waste Generated: " + new Intl.NumberFormat().format(d.PlasticWasteGeneration) + " kg/day<br>" + "lat: " + d.Latitude)
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 - 30 + "px")
        .style("border", "solid")
        .style("border-width", "2px")
    }
    var mouseleave = function(event, d) {
      Tooltip.style("opacity", 0)
      .style("border", "none")
    }

  // Add circles:
  svg
    .selectAll("myCircles")
    .data(data.sort((a,b) => +b.n - +a.n).filter((d,i) => i<1000))
    .join("circle")
      .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
      .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
      .attr("r", d => (d.PlasticWasteGeneration*0.000002))
      .style("fill", d => color(d.Country))
      .attr("stroke", d => {if (d.n>2000) {return "black"} else {return "none"}  })
      .attr("stroke-width", 1)
      .attr("fill-opacity", .4)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)


  // // Add title and explanation
  // svg
  //   .append("text")
  //     .attr("text-anchor", "end")
  //     .style("fill", "black")
  //     .attr("x", width - 10)
  //     .attr("y", height - 30)
  //     .attr("width", 90)
  //     .html("TEXT")
  //     .style("font-size", 14)


  
})

  
