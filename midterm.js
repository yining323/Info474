'use strict';

(function () {

  let data = "no data";
  let allData = "no data";
  let svgContainer = "";
  let mapFunctions = "";
  let legendary = "All";
  let generation = "All";

  const colors = {

        "Bug": "#4E79A7",
    
        "Dark": "#000000",
    
        "Electric": "#F28E2B",
    
        "Fairy": "#FFBE7D",
    
        "Fighting": "#59A14F",
    
        "Fire": "#e60000",
    
        "Ghost": "#B6992D",
    
        "Grass": "#499894",
    
        "Ground": "#86BCB6",
    
        "Ice": "#FABFD2",
    
        "Normal": "#E15759",
    
        "Poison": "#9900ff",
    
        "Psychic": "#79706E",
    
        "Steel": "#BAB0AC",
    
        "Water": "#D37295",

        "Dragon": "#ff3333",

        "Fairy": "#b3ffff",

        "Flying": "#aaff80",

        "Rock": "#996600"

  }

  window.onload = function () {
    svgContainer = d3.select('body')
      .append('svg')
      .attr('width', 1000)
      .attr('height', 800);

      
    d3.csv("pokemon.csv")
      .then((data) => {
        data = data
        allData = data
        makeScatterPlot("all")
      }
      );
  }

  function filterByGeneration(gen) {
    if (gen == "all") {
      data = allData
    } else {
      data = allData.filter((row) => row["Generation"] == gen)
    }
  }

  function makeScatterPlot(gen) {
    filterByGeneration(gen)

    let stat = data.map((row) => parseFloat(row["Total"]));
    let sp = data.map((row) => parseFloat(row["Sp. Def"]));

    let axesLimits = findMinMax(sp, stat);

    mapFunctions = drawAxes(axesLimits, "Sp. Def", "Total");

    var legDropDown = d3.select("body").append("select").attr("class", "leg-selector")

    var legOptions = ["All", "True", "False"]
    legDropDown
      .selectAll('myOptions')
      .data(legOptions)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

    legDropDown.on("change", function () {
      legendary = d3.select(this).property("value");
      var displayOthers = this.checked ? "inline" : "none";
      var display = this.checked ? "none" : "inline";

      if (legendary == "All" && generation == "All") {
        svgContainer.selectAll("circle")
          .attr("display", display);

      } else if (legendary == "All" && generation != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return generation != d.Generation; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return generation == d.Generation; })
          .attr("display", display);

      } else if (legendary != "All" && generation == "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return legendary != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return legendary == d.Legendary; })
          .attr("display", display);


      } else if (legendary != "All" && generation != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return generation != d.Generation || legendary != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return generation == d.Generation && legendary == d.Legendary; })
          .attr("display", display);
      }
    });


    var genDropDown = d3.select("body").append("select").attr("class", "gen-selector")

    var genDefaultOption = genDropDown.append("option")
      .data(data)
      .text("All")
      .attr("value", "All")
      .enter();
    var genOptions = genDropDown.selectAll("option.state")
      .data(d3.map(data, function (d) { return d.Generation }).keys())
      .enter()
      .append("option")
      .text(function (d) { return d; });

    genDropDown.on("change", function () {
      generation = d3.select(this).property("value");
      var displayOthers = this.checked ? "inline" : "none";
      var display = this.checked ? "none" : "inline";

      if (legendary == "All" && generation == "All") {
        svgContainer.selectAll("circle")
          .attr("display", display);
      } else if (legendary != "All" && generation == "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return legendary != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return legendary == d.Legendary; })
          .attr("display", display);
      } else if (legendary == "All" && generation != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return generation != d.Generation; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return generation == d.Generation; })
          .attr("display", display);
      } else if (legendary != "All" && generation != "All") {
        svgContainer.selectAll("circle")
          .filter(function (d) { return generation != d.Generation || legendary != d.Legendary; })
          .attr("display", displayOthers);

        svgContainer.selectAll("circle")
          .filter(function (d) { return generation == d.Generation && legendary == d.Legendary; })
          .attr("display", display);
      }
    });

    plotData(mapFunctions);
    createLegend();
    makeLabels();

  }

  function createLegend() {
    var size = 20
    svgContainer.selectAll("mydots")
      .data(d3.map(data, function (d) { return d["Type 1"] }).keys())
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", function (d, i) { return 100 + i * (size + 5) })
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) { return colors[d] })
      .attr("transform", "translate(675,130)")


    svgContainer.selectAll("mylabels")
      .data(d3.map(data, function (d) { return d["Type 1"] }).keys())
      .enter()
      .append("text")
      .attr("x", 110 + size)
      .attr("y", function (d, i) { return 100 + i * (size + 5) + (size / 2) })
      .style("fill", function (d) { return colors[d] })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .attr("transform", "translate(675,130)")
  }

  function makeLabels() {
    svgContainer.append('text')
      .attr('x', 150)
      .attr('y', 40)
      .style('font-size', '20pt')
      .text("Pokemon - Special Defense v.s. Total Stats");

    svgContainer.append('text')
      .attr('transform', 'translate(40, 400)rotate(-90)')
      .style('font-size', '13pt')
      .text('Total');
    svgContainer.append('text')
      .attr('x', 350)
      .attr('y', 770)
      .style('font-size', '13pt')
      .text('Sp.Def');
  }

  function drawAxes(limits, x, y) {
    let xValue = function (d) { return +d[x]; }

    let xScale = d3.scaleLinear()
      .domain([limits.xMin - 10, limits.xMax + 10])
      .range([75, 725]);

    let xMap = function (d) { return xScale(xValue(d)); };

    let xAxis = d3.axisBottom().scale(xScale);
    svgContainer.append("g")
      .attr('transform', 'translate(0, 725)')
      .call(xAxis);

    let yValue = function (d) { return +d[y] }

    let yScale = d3.scaleLinear()
      .domain([limits.yMax + 50, limits.yMin - 50])
      .range([75, 725]);

    let yMap = function (d) { return yScale(yValue(d)); };

    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer.append('g')
      .attr('transform', 'translate(75, 0)')
      .call(yAxis);

    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };
  }

  function plotData(map) {
    let xMap = map.x;
    let yMap = map.y;

    let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svgContainer.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', xMap)
      .attr('cy', yMap)
      .attr('r', 7)
      .attr('fill', function (d) { return colors[d["Type 1"]] })
      .on("mouseover", function (d){
        div.transition()
          .duration(200)
          .style("opacity", .8);
        div.html(d.Name + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
      })
      .on("mouseout", function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
      });
  }

  function findMinMax(x, y) {
    let xMin = d3.min(x);
    let xMax = d3.max(x);
    let yMin = d3.min(y);
    let yMax = d3.max(y);

    return {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax
    }
  }
})();