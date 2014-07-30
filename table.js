function drawTable(data, tableid, dimensions, valueFunc, textFunc, columns) {

    var sortValueAscending = function (a, b) { return valueFunc(a) - valueFunc(b) }
    var sortValueDescending = function (a, b) { return valueFunc(b) - valueFunc(a) }
	var sortNameAscending = function (a, b) { return textFunc(a) - textFunc(b) }
    var sortNameDescending = function (a, b) { return textFunc(b) - textFunc(a) }
    /* for text */
	/*var sortNameAscending = function (a, b) { return textFunc(a.toString()).localeCompare(textFunc(b.toString())); }
    var sortNameDescending = function (a, b) { return textFunc(b).localeCompare(textFunc(a)); }*/
    var metricAscending = true;
    var nameAscending = true;

    var width = dimensions.width + "px";
    var height = dimensions.height + "px";
    var twidth = (dimensions.width - 25) + "px";
    var divHeight = (dimensions.height - 60) + "px";

	d3.select(tableid).select("table").remove();
    var outerTable = d3.select(tableid).append("table").attr("width", width);

    outerTable
		.append("tr")
		.append("td")
        .append("table").attr("class", "headerTable").attr("style", "table-layout:fixed").attr("width", twidth)
        .append("tr").selectAll("th").data(columns).enter()
		.append("th")
		.text(function (column) { return column; })
        .on("click", function (d) {
            var sort;
			
            // Choose appropriate sorting function.
            if (d === columns[1]) {
                if (metricAscending) sort = sortValueAscending;
                else sort = sortValueDescending;
                metricAscending = !metricAscending;
            } else if(d === columns[0]) {
                if (nameAscending) sort = sortNameAscending;
                else sort = sortNameDescending;
                nameAscending = !nameAscending;
            }
			
            var rows = tbody.selectAll("tr").sort(sort);
        });

    var inner = outerTable
		.append("tr")
		.append("td")
		.append("div").attr("class", "scroll").attr("width", width).attr("style", "height:" + divHeight + ";")
		.append("table").attr("class", "bodyTable").attr("border", 1).attr("width", twidth).attr("height", height).attr("style", "table-layout:fixed");

    var tbody = inner.append("tbody");
    // Create a row for each object in the data and perform an intial sort.
    var rows = tbody.selectAll("tr").data(data).enter().append("tr").sort(sortValueDescending)
		.on("mouseover", function(thisCircle){
			var toHighlight = d3.selectAll(".node").filter(function(d) {return d.name == thisCircle.id})
				toHighlight.select("circle")
					.attr("r", 16);
				toHighlight.select("rect")
					.attr("width", 28)
					.attr("height", 28);
		})
		.on("mouseout", function(thisCircle) {
			var toHighlight = d3.selectAll(".node").filter(function(d) {return d.name == thisCircle.id})
				toHighlight.select("circle")
					.attr("r", 4);
				toHighlight.select("rect")
					.attr("width", 7)
					.attr("height", 7);		
		});

    // Create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function (d) {
            return columns.map(function (column) {
                return { column: column, text: textFunc(d), value: valueFunc(d)};
            });
        }).enter()
        .append("td")
		.text(function (d) {
			if (d.column === columns[0]) return d.text;
			else if (d.column === columns[1]) return d.value;
		});
}