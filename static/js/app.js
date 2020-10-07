var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  };

  // function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  };

  // function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  };

   // function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  };

  // function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  };

  // Function to update text in circles group with transition
  function renderText(cText, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    cText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return cText;
  }

  // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, cText) {

    var xlabel;
    var ylabel;

    // X-Axis Conditional Statements
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty (%): ";
    }
    else if (chosenXAxis === "age") {
        xlabel = "Median Age: ";
    }
    else {
        xlabel = "Median Income ($): ";
    }

    // Y-Axis Conditional Statements
    if (chosenYAxis === "healthcare") {
        ylabel = "Lacking Healthcare (%): ";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokers (%): ";
    }
    else {
        ylabel = "Obese (%): ";
    }
  
    // Define Tooltip Params
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
          // Conditionals for tooltip
          if (chosenXAxis === "age") {
              return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
          }
          else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
              return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
          }
          else {
              return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
          }
      });
  
    circlesGroup.call(toolTip);

    // Create mouseover/out event listener for circlesGroup and circleText
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    cText.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
  
    return circlesGroup;
  };

// Responsive function for ScatterPlot
function makeResponsive() {
    var svgArea = d3.select("#scatter").select("svg");

    // Clear SVG for responsive changes
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // svg heigh, width, margin params
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 80,
        left: 100
    };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from csv file in data folder
d3.csv("static/data/data.csv")
    .then(function(riskData, err) {
        if (err) throw err;

// Extract data from csv file
    riskData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.abbr = data.abbr
    });

    var xLinearScale = xScale(riskData, chosenXAxis, width);
    var yLinearScale = yScale(riskData, chosenYAxis, height);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append x & y axes
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .call(leftAxis)

    // Apply data to circlesGroup
    var circlesGroup = chartGroup.selectAll("circle")
        .data(riskData);

    // Bind Data to circlesGroup
    var bindData = circlesGroup.enter();

    // Create Circles and text
    var circle = bindData.append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("fill", "lightskyblue")
        .attr("opacity", "0.5")
        .classed("circleState", true);

    var cText = bindData.append("text")
        .attr("x", d => xLinearScale(d[chosenYAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", "0.35em")
        .text(d => d.abbr)
        .classed("stateAbbr", true);

    // Update tooltip with csv
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, cText);

    // Apply x labels
    var xLabelGroup = chartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + 20})`);
    // Poverty xLabel
    var xPoverty = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("Poverty (%)");
    // Income xLabel
    var xIncome = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Median Income ($)");
    // Age xLabel
    var xAge = xLabelGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Median Age");

    // Apply y labels
    var yLabelGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");
    // Healthcare yLabel
    var yHealth = yLabelGroup.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 40 - margin.left)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    // Smokers yLabel
    var ySmokers = yLabelGroup.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 20 - margin.left)
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokers (%)");
    // Obesity yLabel
    var yObesity = yLabelGroup.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");
    
    // Event Listener xLabels
    xLabelGroup.selectAll("text")
        .on("click", function() {
            chosenXAxis = d3.select(this).attr("value");
            // Update xLinearScale
            xLinearScale = xScale(riskData, chosenXAxis, width);
            // Render Axis
            xAxis = renderXAxes(xLinearScale, xAxis);

            // Conditional to switch between active and inactive labels
            if (chosenXAxis === "poverty") {
                xPoverty
                    .classed("active", true)
                    .classed("inactive", false);
                xIncome
                    .classed("active", false)
                    .classed("inactive", true);
                xAge
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "income") {
                xPoverty
                    .classed("active", false)
                    .classed("inactive", true);
                xIncome
                    .classed("active", true)
                    .classed("inactive", false);
                xAge
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                xPoverty
                    .classed("active", false)
                    .classed("inactive", true);
                xIncome
                    .classed("active", false)
                    .classed("inactive", true);
                xAge
                    .classed("active", true)
                    .classed("inactive", false);
            }

            // Update circles with new x values
            circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // Update tooltips with new information
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, cText);

            // Update circle text
            cText = renderText(cText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        });

    // Event Listener yLabels
    yLabelGroup.selectAll("text")
        .on("click", function() {
            chosenYAxis = d3.select(this).attr("value");
            // Update xLinearScale
            yLinearScale = yScale(riskData, chosenYAxis, height);
            // Render Axis
            yAxis = renderYAxes(yLinearScale, yAxis);

            // Conditional to switch between active and inactive labels
            if (chosenYAxis === "healthcare") {
                yHealth
                    .classed("active", true)
                    .classed("inactive", false);
                ySmokers
                    .classed("active", false)
                    .classed("inactive", true);
                yObesity
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                yHealth
                    .classed("active", false)
                    .classed("inactive", true);
                ySmokers
                    .classed("active", true)
                    .classed("inactive", false);
                yObesity
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                yHealth
                    .classed("active", false)
                    .classed("inactive", true);
                ySmokers
                    .classed("active", false)
                    .classed("inactive", true);
                yObesity
                    .classed("active", true)
                    .classed("inactive", false);
            }

            // Update circles with new x values
            circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // Update tooltips with new information
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, cText);

            // Update circle text
            cText = renderText(cText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        });
    }).catch(function(err) {
        console.log(err);
    });
}
makeResponsive();
