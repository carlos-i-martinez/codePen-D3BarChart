var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
req=new XMLHttpRequest();
req.open("GET",url,true);
req.send();
req.onload=function(){
        json=JSON.parse(req.responseText);
        var html = "";
        plotData();       
      };

function plotData() {

    const dataset1 = json.data;
    const w = 1500;
    const h = 500;
    const padding = 60;
    const rw = (w-padding)/(dataset1.length);
  
    const xMin = new Date(d3.min(dataset1, (d,i) => new Date(d[0])));
    const xMax = new Date(d3.max(dataset1, (d,i) => new Date(d[0])));
    xMax.setMonth(xMax.getMonth() + 3);
    
    const xScale = d3.scaleTime()
                     .domain([xMin,xMax])
                     .range([padding, w - 1]);
  
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset1, (d) => d[1])])
                     .range([h - padding,7]);
  
    const svgC = d3.select("#visual")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  
    var myTool = d3.select("#visual")
                  .append("div")
                  .attr("class", "myTool")
                  .attr("id","tooltip")
                  .style("opacity", 0);

  
  svgC.selectAll("rect")
       .data(dataset1)
       .enter()
       .append("rect")
       .attr("class","bar")
       .attr("data-date", (d, i) => dataset1[i][0])
       .attr("data-gdp", (d, i) => dataset1[i][1])
       .attr("x", (d, i) => padding + i*rw)
       .attr("y", (d, i) => yScale(d[1]))
       .attr("width", rw)
       .attr("height",(d) => h - yScale(d[1]) - padding )
       .attr("fill", "navy")
       .on("mouseover", function(d,i){
            myTool.transition().duration(200).style('opacity', 0.9);
            myTool
              .html("<strong>DATE: </strong> "+d[0]+" <br><strong>GDP: </strong> "+d[1])
              .attr("data-date", dataset1[i][0])
              .style("left", d3.event.pageX - 40 + "px")
              .style("top", d3.event.pageY - 30 + "px")
              .style("display", "flex")
              .style("opacity", 1)
        })
    	 .on("mouseout", function(d) { 
            myTool.style("display", "none");
          });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svgC.append("g")
       .attr("id","x-axis")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis);
  
    // text label for the x axis
  svgC.append("text")
      .attr("transform","translate(" + (w/2) + " ," + h + ")")
      .text("Date");
  
    svgC.append("g")
       .attr("id","y-axis")
       .attr("transform", "translate("+padding+",0)")
       .call(yAxis);
  
    // text label for the y axis
svgC.append("text")
    .attr("text-anchor", "end")
    .attr("y", 70)
    .attr('x',-30)
    .attr("dy", ".5em")
    .attr("transform", "rotate(-90)")
    .text("Gross Domestic Product(billions of dollars)");  
}