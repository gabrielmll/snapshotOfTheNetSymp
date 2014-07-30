// TODO: Choose colors and follow the "right way" of declaring it 'according' to D3js
var color = ["#2812FF", "#03FFE8", "#71FF03", "#FFB600", "#FF1E00"]; // Color list

/*
 *	DataFile related area
 *		- For sure there is a smarter way of treating all this data. First, this all should be a
 *		JSON file rather then CSV, once the JASON would pack every subject and time.
 *		- Packing time would probably make the timeline easier.
*/
var datafile = dataFileName();// list of dataFiles. There is a bunch of dataFile beeing one per day.
function dataFileName() {
	var i = 1;
	var fileNames = [];
	for(; i < 107; i++) {
		var name = "./data/hist_prox_weight" + i +".csv";
		fileNames.push(name);
	}
	return fileNames;
}
var data = datafile[0];

// Vis region
var width = 960,
    height = 480;

// Start vis for the first dataFile
d3.csv(data, function (d) {

	var svg = d3.select("body").select("#whole").append("svg")
			.attr("id", "graph")
			.attr("width", width)
			.attr("height", height);
			
	d3.select("body").select("#whole")
		.append("div")
			.attr("id", "timeline");
			//.style("position", "relative");
    /*
     *	Left menu design
    */
	leftMenuDesign();
		
	//vis(d);
	timeline();
});
// Keep showing the vis for the remaining dataFiles
var count = 1;

/*setInterval(function() {

	data == datafile[105] ? data = datafile[0] : data = datafile[count];
	count++;
	console.log(data);
		d3.csv(data, function(d) {
			vis(d);
		});
	},5000);
*/


var nodes = {}; // List to store information for each subject
var symptom = {}; // store a list of the column symptom from data
var psySymp = {}; // store a list of the column psych_symp from data

// The visualization!
function vis(links) {

    // Compute the distinct nodes from the links.
    links.forEach(function (link, i) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target
        });
        link.symptom = (symptom[i] = {
            symp: link.symptom
        });
		link.psych_symp = (psySymp[i] = {
			psySymp: link.psych_symp
		});
    });

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(function (d) {
            return 200 / d.weight;
        })
        .charge(-100)
		.friction(0.7)
        .on("tick", tick)
        .start();

	var svg = d3.select("body").selectAll("svg#graph");
	
	svg.selectAll(".link").remove();
	
    var link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link");

	svg.selectAll(".node").remove();
			
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
		.on("click", mouseclick)
    .call(force.drag); //dragable

    node.append("circle")
        .attr("r", 4)
		.style("fill", function(d) {
			var form = d3.select("#symptomForm");
			var sympArray = d3.values(symptom);
			if(form[0][0][1].checked == true && sympArray[d.index].symp[0] == "1") {	// sore
                return color[1];
            } else if (form[0][0][2].checked == true && sympArray[d.index].symp[1] == "1") { // runnynose
                return color[2];
            } else if (form[0][0][3].checked == true && sympArray[d.index].symp[2] == "1") { // fever
                return color[3];
            } else if (form[0][0][4].checked == true && sympArray[d.index].symp[3] == "1") { // nausea
                return color[4];
			} else if (form[0][0][0].checked == true && (sympArray[d.index].symp[0] == "1" || sympArray[d.index].symp[1] == "1" || sympArray[d.index].symp[2] == "1" || sympArray[d.index].symp[3] == "1")) { // any
				return color[0];
            } else {
				return "#8B8B7A";
			}
		})
		.style("visibility", function(d) {
			var form = d3.select("#psysymptomForm");
			var psyArray = d3.values(psySymp);
			
			if(form[0][0][0].checked == true && (psyArray[d.index].psySymp[0] == "1" || psyArray[d.index].psySymp[1] == "1")) {
				return "hidden";
			} else if (form[0][0][1].checked == true && psyArray[d.index].psySymp[0] == "1") {
				return "hidden";
			} else if (form[0][0][2].checked == true && psyArray[d.index].psySymp[1] == "1") {
				return "hidden";
			} else {
				return "visible";
			}
		});

	node.append("rect")
		.attr("width", 7)
		.attr("height", 7)
		.style("fill", function(d) {
			var form = d3.select("#symptomForm");
			var sympArray = d3.values(symptom);
			if(form[0][0][1].checked == true && sympArray[d.index].symp[0] == "1") {	// sore
                return color[1];
            } else if (form[0][0][2].checked == true && sympArray[d.index].symp[1] == "1") { // runnynose
                return color[2];
            } else if (form[0][0][3].checked == true && sympArray[d.index].symp[2] == "1") { // fever
                return color[3];
            } else if (form[0][0][4].checked == true && sympArray[d.index].symp[3] == "1") { // nausea
                return color[4];
			} else if (form[0][0][0].checked == true && (sympArray[d.index].symp[0] == "1" || sympArray[d.index].symp[1] == "1" || sympArray[d.index].symp[2] == "1" || sympArray[d.index].symp[3] == "1")) { // any
				return color[0];
            } else { // none
				return "#8B8B7A";
			}
		})
		.style("visibility", function(d) {
			var form = d3.select("#psysymptomForm");
			var psyArray = d3.values(psySymp);
			
			if(form[0][0][0].checked == true && (psyArray[d.index].psySymp[0] == "1" || psyArray[d.index].psySymp[1] == "1")) {
				return "visible";
			} else if (form[0][0][1].checked == true && psyArray[d.index].psySymp[0] == "1") {
				return "visible";
			} else if (form[0][0][2].checked == true && psyArray[d.index].psySymp[1] == "1") {
				return "visible";
			} else { // none
				return "hidden";
			}
		});
	
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

    function tick() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("transform", function (d) {
                //return "translate(" + d.x + "," + d.y + ")";
				// this new return will keep the circles within the canvas
				// TODO: create a radios variable to change the number 10
                return "translate(" + Math.max(10, Math.min(width - 10, d.x)) + "," + Math.max(10, Math.min(height - 10, d.y)) + ")";
				
            });
    }

    function mouseover(d, i) {

        // Figure out the neighboring node id's with brute strength "because the graph is small"
        // this still a concern
        var nodeNeighbors = links.filter(function (link) {
                // Filter the list of links to only those links that have our target 
                // node as a source or target
                return link.source.index === d.index || link.target.index === d.index;
            })
            .map(function (link) {
                // Map the list of links to a simple array of the neighboring indices - this is
                // technically not required but makes the code below simpler because we can use         
                // indexOf instead of iterating and searching ourselves.
                return link.source.index === d.index ? link.target.index : link.source.index;
            });


        // now we select the neighboring circles and apply whatever style we want. 
        // Note that we could also filter a selection of links in this way if we want to 
        // Highlight those as well
        svg.selectAll('circle').filter(function (node) {
                // I filter the selection of all circles to only those that hold a node with an
                // index in my listg of neighbors
                return nodeNeighbors.indexOf(node.index) > -1;
            })
            .transition().duration(750)
            .attr("r", 16);
		
		svg.selectAll('rect').filter(function (node) {
			// I filter the selection of all circles to only those that hold a node with an
			// index in my listg of neighbors
				return nodeNeighbors.indexOf(node.index) > -1;
			})
			.transition().duration(750)
			.attr("width", 28)
			.attr("height", 28);

        // Apply effects on lines
        svg.selectAll("line").filter(function (d) {
            return d.source.index == i || d.target.index == i;
        }).each(function (dLink, iLink) {
            //unfade links and nodes connected to the current node
            d3.select(this)
                .transition().duration(750)
                //.style("stroke-width", "2px")
                .style("opacity", 1);
            //.style("stroke", "orange");
        });
    }

    function mouseout() {

        d3.select("svg#graph").selectAll("circle").transition()
            .duration(750)
            .attr("r", 4);
        
		d3.select("svg#graph").selectAll("rect").transition()
			.duration(750)
			.attr("width", 7)
			.attr("height", 7);

        d3.select("svg#graph").selectAll("line")
            .transition().duration(750)
            .style("opacity", 0.3);

    }
	
	var clicked = false;	// true highlight, false unhighlight
	function mouseclick(d) {
		if(!clicked) {
			clicked = !clicked;
			
			//d3.select(this).select("circle, rect").attr("class", "clicked");
			highlight(d);
			

		}
		else {
			clicked = !clicked;
			svg.selectAll('circle, rect, text')
				.transition().duration(750)
				.style("opacity", 1);
			
			svg.selectAll('line')
				.transition().duration(750)
				.style("stroke-width", ".3px");
		}
	}
	function highlight(d) {
		var i = d.index;
		//console.log(d);
		var nodeNeighbors = links.filter(function (link) {
				return link.source.index === d.index || link.target.index === d.index;
			})
			.map(function (link) {
				return link.source.index === d.index ? link.target.index : link.source.index;
			});
		
		console.log(nodeNeighbors);

		svg.selectAll('circle, rect, text').filter(function (node) {
				return !(nodeNeighbors.indexOf(node.index) > -1);
			})
			.transition().duration(750)
			.style("opacity", 0.1);
		
		// Apply effects on lines
        svg.selectAll("line").filter(function (d) {
            return (d.source.index == i || d.target.index == i);
        }).each(function (dLink, iLink) {
            d3.select(this)
                .transition().duration(750)
                .style("stroke-width", "2px");
        });
	}
}

// fluRadio colorize nodes by flu symptom
function fluRadio(radio) {

    var sympArray = d3.values(symptom);

    var selectUI = d3.select("body")
        .selectAll("svg#graph")
        .selectAll("g")
        .selectAll("circle, rect")
        .style("fill", function (d) {
            if (radio.value == "sore" && sympArray[d.index].symp[0] == "1") {
                return color[1];
            } else if (radio.value == "runnynose" && sympArray[d.index].symp[1] == "1") {
                return color[2];
            } else if (radio.value == "fever" && sympArray[d.index].symp[2] == "1") {
                return color[3];
            } else if (radio.value == "nausea" && sympArray[d.index].symp[3] == "1") {
                return color[4];
            } else if (radio.value == "any" && (sympArray[d.index].symp[0] == "1" || sympArray[d.index].symp[1] == "1" || sympArray[d.index].symp[2] == "1" || sympArray[d.index].symp[3] == "1")) {
				return color[0];
			}
        });
}

// psyRadio change shape by psychological symptoms
function psyRadio(radio) {
	var psyArray = d3.values(psySymp);
	
	d3.select("body")
        .selectAll("svg#graph")
        .selectAll("g")
        .selectAll("rect")
        .style("visibility", function (d) {
            if (radio.value == "any_psy" && (psyArray[d.index].psySymp[0] == "1" || psyArray[d.index].psySymp[1] == "1")) {
                return "visible";
            } else if (radio.value == "depressed" && psyArray[d.index].psySymp[0] == "1") {
                return "visible";
            } else if (radio.value == "stressed" && psyArray[d.index].psySymp[1] == "1") {
                return "visible";
			} else {
				return "hidden";
			}
        });

	d3.select("body")
        .selectAll("svg#graph")
        .selectAll("g")
        .selectAll("circle")
        .style("visibility", function (d) {
            if (radio.value == "any_psy" && (psyArray[d.index].psySymp[0] == "1" || psyArray[d.index].psySymp[1] == "1")) {
                return "hidden";
            } else if (radio.value == "depressed" && psyArray[d.index].psySymp[0] == "1") {
                return "hidden";
            } else if (radio.value == "stressed" && psyArray[d.index].psySymp[1] == "1") {
                return "hidden";
			} else {
				return "visible";
			}
        });
}

// for timeline
function timeline() {
	var data = [{"date":"2009-01-09","total":3},{"date":"2009-04-25","total":12}];

	var x = d3.time.scale()
		.domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 1)])
		.rangeRound([30, width-20])
		.clamp(true);
		
	var xAxisWeek = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.weeks, 1)
    .tickFormat(d3.time.format('%b %d'))
    .tickSize(8)
    .tickPadding(8);

	var xAxisDay = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.day, 1)
    .tickSize(5);

	
	var svg = d3.select("div#timeline")
		.append("svg")
			.attr("width", width);
	
	var context = svg.append("g")
		.attr("class", "context");
	
/*	var handle = context.append("circle")
		.attr("class", "handle")
		.attr("r", 9);
*/	
	var handle = context.append("rect")
		.attr("class", "handle")
		.attr("width", 27)
		.attr("height", 8);

	var brush = d3.svg.brush()
		.x(x)
		.extent([0, 0])
		.on("brush", brushed);
	
		// area de selecao da timeline
	/*context.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area2);
	*/
	
	context.append("g")
		.attr("class", "x axis")
		.call(xAxisWeek);
	
	context.append("g")
		.attr("class", "daily_axis")
		.call(xAxisDay);
	
	/*context.append("g")
			.attr("class", "x brush")
			.call(brush)
		.selectAll("rect")
			.attr("y", -6)
			.attr("height", 15);
*/
	context
		.call(brush.event)
	  .transition() // gratuitous intro!
		.duration(750)
		.call(brush.extent([70, 70]))
		.call(brush.event)
		.attr("height", 15);


	var area2 = d3.svg.area()
		.interpolate("monotone")
		.x(function(d) { return x(d.date); })
		.y0(height)
		.y1(function(d) { return y2(d.total); });
	
/*	function brushed() {
		x.domain(brush.empty() ? x.domain() : brush.extent());
		context.select(".domain");
		context.select("daily_axis").call(xAxisDay);
	}
*/

	var previousValue = 0;

	function brushed() {
		var value = brush.extent()[0];
		
		// Scale to call the datafile name
		var scaleDate = d3.scale.linear()
			.domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 1)])
			.rangeRound([1, 106]);
		
		context.select(".domain");
		context.select("daily_axis").call(xAxisDay);

		if (d3.event.sourceEvent) { // not a programmatic event
			value = x.invert(d3.mouse(this)[0]);
			brush.extent([value, value]);
		}

		handle.attr("x", x(value) - handle.attr("width"));
		
		if (scaleDate(new Date(value)) != previousValue && (scaleDate(new Date(value)) > 0 && scaleDate(new Date(value)) < 107)) {
			previousValue = scaleDate(new Date(value));
		
			//console.log(scaleDate(new Date(value)));
			// datafile is an array [0 - 105] = 106 names. That's why this -1
			d3.csv(datafile[scaleDate(new Date(value)) - 1], function(d) {
				vis(d);
				table(d);
			});
		}
	}
}

/*
 *	For the table
*/
function table(d) {
	// prepare data and then call function to draw table
	

	var dataList = [];
	for(var i = 1; i < 81; i++) {
		var datum = {};
		datum.id = i;
		datum.weight = -2;
		dataList.push(datum);
		//console.log(datum);
	}

	for(i in d) {
		//console.log(d[i].source.index);
		dataList[d[i].source.index].weight++;
		dataList[d[i].target.index].weight++;
	}
	
	console.log(dataList);
	
	var columns = ["id \u21c5", "Contacts \u21c5"];
	
	var valueFunc = function(data) {
		return data.weight;
	}
 
	var textFunc = function(data) {
		return data.id;
	}
	
	drawTable(dataList, "#chart", { width: 240, height: 190 }, valueFunc, textFunc, columns);
}

/* Lef side bar */
function leftMenuDesign() {
    var leftSide = d3.select("body").select("#left-sidebar");
		
	leftSide
        .style("top", "70px")
        .style("left", function (d) {
            return width + "px";
        });
	
	var circleTag = function(i) {
		return '<svg width=8 height=8><circle r=4 cx=4 cy=4 fill='+color[i]+'></svg> ';
	}
	
	var sympForm = $("#symptomForm");
	sympForm.find("#any")
		.after(circleTag(0));
	sympForm.find("#sore")
	.after(circleTag(1));
	sympForm.find("#runnynose")
	.after(circleTag(2));
	sympForm.find("#fever")
	.after(circleTag(3));
	sympForm.find("#nausea")
	.after(circleTag(4));
	
	var psyForm = $("#psysymptomForm");
	psyForm.find("#any_psy, #stressed, #depressed")
		.after('<svg width=7 height=7><rect width=7 height=7></svg> ');
}