var width = 1010;
var height = 850;




// The svg
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)



  
// create a tooltip
const tooltip = d3.select("#mapContainer")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .attr("width", "200px")
  .attr("height", "250px")
  .attr("display", "flex")
  .style("border", "none")
  .style("border-width", "0px")
  .style("border-radius", "5px")
  .style("padding", "25px")
  .style("background-color", "rgba(2, 76, 126, 1)")
  .style("opacity", 1.2)
  .style("position", "absolute")




// Map and projection
const projection = d3.geoMercator()
    .center([5,40])                // GPS of location to zoom on
    .scale(165)                       // This is like the zoom
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
        .attr("fill", "rgba(0,0,50,.7)")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
      .style("stroke", "rgba(0, 128, 167, 0.4)")
      .style("stroke-width", 1.5)
      .style("stroke-opacity", 0.5)
      .style("opacity", 1)
      


    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
      tooltip.style("opacity", 1)
        .style("border-width", "2px")
        .html(d.Country + "" + "Plastic Waste Generated: " + new Intl.NumberFormat().format(d.PlasticWasteGeneration) + " kg/day<br>Total Waste Generated: " + new Intl.NumberFormat().format(d.WasteGeneration)+" kg/day")
        .style("left", (event.x) + "px")
        .style("top", (event.y) + "px")
      /*.style("background-color", "rgba(2, 76, 126, 0.8)")*/
    }
    var mousemove = function(event, d) {
      tooltip
      .html(d.Country + "<br>" + "Plastic Waste Generated: " + new Intl.NumberFormat().format(d.PlasticWasteGeneration) + " kg/day<br>Total Waste Generated: " + new Intl.NumberFormat().format(d.WasteGeneration)+" kg/day")
        .style("left", (event.x)/2 +200 + "px")
        .style("top", (event.y)/2 +60 + "px")
        .style("font-size", "18 px")
        /*.style("border", "solid")
        .style("border-width", "2px")
        .style("background-color", "rgba(2, 76, 126, 0.8)")*/
    }
    var mouseleave = function(event, d) {
      tooltip.style("opacity", 0)
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

  
})
let zoom = d3.zoom()
	.on('zoom', handleZoom);

function handleZoom(e) {
	d3.select('svg g')
		.attr('transform', e.transform);
  d3.selectAll('circle')
  .attr('transform', e.transform);
}

function initZoom() {
	d3.select('svg')
		.call(zoom);
}
initZoom();


