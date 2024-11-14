<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    
    let commits = [];
    let selectedCommits = [];
    let languageBreakdown = [];
    
    onMount(async () => {
    const csvFilePath = "/static/code-analysis.csv";
    const data = await d3.csv(csvFilePath);

    // Filter out rows that don't represent programming languages or commit information
    const filteredData = data.filter((d) => 
        d.metric !== "Total Commits" && 
        d.metric !== "Unique Authors" && 
        d.metric !== "Lines of Code" && 
        d.metric !== "Commit Dates"
    );

    // Extract Commit Dates (assuming it's the value of the 'Commit Dates' row)
    const commitDatesRow = data.find((d) => d.metric === "Commit Dates");
    const commitDates = commitDatesRow ? commitDatesRow.value
        .split(", ")
        .map((date) => new Date(date)) : [];

    // Initialize an array to store commits
    commits = commitDates.map((date, index) => {
        const languageRow = filteredData[index % filteredData.length];
        const linesOfCode = languageRow ? parseInt(languageRow.value, 10) : Math.floor(Math.random() * 50) + 10;

        return {
            date,
            linesOfCode,
            language: languageRow ? languageRow.metric : "Unknown",
        };
    });

    createScatterPlot();
    createPieChart();
});
    
    function createScatterPlot() {
      const width = 800;
      const height = 300;
    
      const svg = d3
        .select("#scatterplot")
        .attr("width", width + 50)
        .attr("height", height + 50);
    
      const xScale = d3
        .scaleTime()
        .domain([d3.min(commits, (d) => d.date), d3.max(commits, (d) => d.date)])
        .range([0, width]);
    
      const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
    
      const sizeScale = d3
        .scaleLinear()
        .domain([
          d3.min(commits, (d) => d.linesOfCode),
          d3.max(commits, (d) => d.linesOfCode),
        ])
        .range([3, 20]);
    
      const tooltip = d3.select("#tooltip");
    
      svg
        .selectAll("circle")
        .data(commits)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.date.getHours() + d.date.getMinutes() / 60))
        .attr("r", (d) => sizeScale(d.linesOfCode))
        .style("fill", "steelblue")
        .style("pointer-events", "all")
        .on("mouseover", (event, d) => showTooltip(event, d))
        .on("mousemove", (event) => moveTooltip(event))
        .on("mouseout", hideTooltip);
    
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
    
      svg.append("g").call(d3.axisLeft(yScale));
    
      const brush = d3
        .brush()
        .extent([[0, 0], [width, height - 10]])
        .on("start brush", brushed)
        .on("end", updateSelectedCommits);
    
      svg.append("g").attr("class", "brush").call(brush);
    
      function showTooltip(event, d) {
        tooltip
          .style("display", "block")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .html(`Date: ${d.date.toDateString()}<br>Lines of Code: ${d.linesOfCode}`);
      }
    
      function moveTooltip(event) {
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      }
    
      function hideTooltip() {
        tooltip.style("display", "none");
      }
    
      function brushed(event) {
        const selection = event.selection;
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;
          svg
            .selectAll("circle")
            .classed(
              "selected",
              (d) =>
                x0 <= xScale(d.date) &&
                xScale(d.date) <= x1 &&
                y0 <= yScale(d.date.getHours() + d.date.getMinutes() / 60) &&
                yScale(d.date.getHours() + d.date.getMinutes() / 60) <= y1
            );
        }
      }
    
      function updateSelectedCommits(event) {
        const selection = event.selection;
        selectedCommits = selection
          ? commits.filter((d) => {
              const [[x0, y0], [x1, y1]] = selection;
              return (
                x0 <= xScale(d.date) &&
                xScale(d.date) <= x1 &&
                y0 <= yScale(d.date.getHours() + d.date.getMinutes() / 60) &&
                yScale(d.date.getHours() + d.date.getMinutes() / 60) <= y1
              );
            })
          : [];
        updatePieChart();
      }
    }
    
    function createPieChart() {
      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2;
    
      const svg = d3
        .select("#piechart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
      languageBreakdown = calculateLanguageBreakdown(commits);
    
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pie = d3.pie().value((d) => d.count);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);
    
      const tooltip = d3.select("#pie-tooltip"); // Select the pie chart tooltip
    
      svg
        .selectAll(".arc")
        .data(pie(languageBreakdown))
        .enter()
        .append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", arc)
        .style("fill", (d, i) => color(i))
        .on("mouseover", (event, d) => showPieTooltip(event, d))
        .on("mousemove", (event) => movePieTooltip(event))
        .on("mouseout", hidePieTooltip);
    
      function showPieTooltip(event, d) {
        tooltip
          .style("display", "block")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .html(`Language: ${d.data.language}<br>Count: ${d.data.count}`);
      }
    
      function movePieTooltip(event) {
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      }
    
      function hidePieTooltip() {
        tooltip.style("display", "none");
      }
    }
    
    function updatePieChart() {
      languageBreakdown = calculateLanguageBreakdown(selectedCommits);
      const svg = d3.select("#piechart").select("g");
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pie = d3.pie().value((d) => d.count);
      const arc = d3.arc().innerRadius(0).outerRadius(200);
    
      const arcs = svg.selectAll(".arc").data(pie(languageBreakdown));
    
      arcs
        .enter()
        .append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", arc)
        .style("fill", (d, i) => color(i))
        .on("mouseover", (event, d) => showPieTooltip(event, d))
        // .on("mousemove", movePieTooltip)
        // .on("mouseout", hidePieTooltip);
    
      arcs.select("path").transition().duration(500).attr("d", arc).style("fill", (d, i) => color(i));
    }
    
    function calculateLanguageBreakdown(data) {
      return d3.groups(data, (d) => d.language).map(([language, commits]) => ({
        language,
        count: d3.sum(commits, (d) => d.linesOfCode), 
      }));
    }
</script>
  
<h2>Scatter Plot of Commit Dates</h2>
<svg id="scatterplot"></svg>
<p>Selected Commits: {selectedCommits.length}</p>
<div
    id="tooltip"
    style="position: absolute; background: white; border: 1px solid black; border-radius: 5px; padding: 10px; display: none; pointer-events: none;"
></div>

<h2>Language Breakdown (Pie Chart)</h2>
<svg id="piechart"></svg>
<div
    id="pie-tooltip"
    style="position: absolute; background: white; border: 1px solid black; border-radius: 5px; padding: 10px; display: none; pointer-events: none;"
></div>
