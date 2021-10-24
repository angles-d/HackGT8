var width = 1200;
var height = 600;

// The svg
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  
// create a tooltip
const Tooltip = d3.select("#mapContainer")
  .append("div")
  .attr("class", "Tooltip")
  .attr("id", "tooltip")
  .attr("width", "200px")
  .attr("height", "250px")
  .attr("display", "flex")
  .style("border", "none")
  .style("border-width", "0px")
  .style("border-radius", "5px")
  .style("padding", "25px")
  .style("background-color", "rgba(2, 76, 126, 0.8)")
  .style("opacity", 1)
  .style("position", "absolute")


// Map and projection
const projection = d3.geoMercator()
    .center([0,35])                // GPS of location to zoom on
    .scale(140)                       // This is like the zoom
    .translate([ width/2, height/2 ])

Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://angles-d.github.io/HackGT8/waste.csv")
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
        .attr("fill", "#999999")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "rgba(1, 59, 97, 0.8)")
      .style("stroke-width", 2)
      .style("stroke-opacity", 0.5)
      .style("opacity", 0.8)
      


    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      Tooltip.style("opacity", 1)
        .style("border-width", "2px")
        .html(d.Country + "<br>" + "Plastic Waste Generated: " + new Intl.NumberFormat().format(d.PlasticWasteGeneration) + " kg/day<br>")
        .style("left", (event.x) + "px")
        .style("top", (event.y) + "px")
      /*.style("background-color", "rgba(2, 76, 126, 0.8)")*/
    }
    var mousemove = function(event, d) {
      Tooltip
        .html(d.Country + "<br>" + "Plastic Waste Generated: " + new Intl.NumberFormat().format(d.PlasticWasteGeneration) + " kg/day<br>")
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 - 30 + "px")
        /*.style("border", "solid")
        .style("border-width", "2px")
        .style("background-color", "rgba(2, 76, 126, 0.8)")*/
    }
    var mouseleave = function(event, d) {
      Tooltip.style("opacity", 0)
      .style("border", "none")
      /*.style("background-color", "rgba(2, 76, 126, 0.8)")*/
    }

  // Add circles:
  svg
    .selectAll("myCircles")
    .data(data.sort((a,b) => +b.n - +a.n).filter((d,i) => i<1000))
    .join("circle")
      .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
      .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
      .attr("r", d => (d.PlasticWasteGeneration*0.0000015))
      .style("fill", d => color(d.Country))
      .attr("stroke", d => {if (d.n>2000) {return "black"} else {return "none"}  })
      .attr("stroke-width", 1)
      .attr("fill-opacity", .8)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)

  // Add title and explanation
  /*svg
    .append("text")
      .attr("text-anchor", "end")
      .style("fill", "black")
      .attr("x", width - 10)
      .attr("y", height - 30)
      .attr("width", 90)
      .html("")
      .style("font-size", 14)*/
})

  
