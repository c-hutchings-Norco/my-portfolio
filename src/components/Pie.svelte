<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { createEventDispatcher } from 'svelte';

  export let pieDataArray = [];
  export let selectedYear = null; // Store the currently selected year
  const dispatch = createEventDispatcher();

  // Watch for changes in selectedYear
  $: if (selectedYear) {
    updateWedges();
  }

  // Function to update wedge styles based on selection
  function updateWedges() {
      const paths = d3.selectAll('.arc path');
      paths.attr('fill', d => {
        return d.data.year === selectedYear ? d3.rgb(d3.schemeCategory10[d.index]).darker() : d3.schemeCategory10[d.index];
      });
    }

  onMount(() => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3.select('#pieChart')
      .attr('width', width)
      .attr('height', height);

    // Group to position the pie chart in the center
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Define pie and arc generators
    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Create arcs for each data point
    const arcs = g.selectAll('.arc')
      .data(pie(pieDataArray))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add path for each arc
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.year))
      .attr('tabindex', 0) // Make paths focusable for accessibility
      .attr('role', 'button') // Role for accessibility
      .attr('aria-label', d => `Year: ${d.data.year}, Count: ${d.data.count}`) // ARIA label
      .on('click', function(event, d) {
        selectedYear = d.data.year; // Set the selected year
        dispatch('selectYear', selectedYear); // Dispatch event for filtering
        updateWedges(); // Update the styling for the wedges
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.7); // Highlight hovered wedge
        showTooltip(event, d.data.year);
      })
      .on('mouseout', function(event) {
        d3.select(this).attr('opacity', 1); // Reset opacity
        hideTooltip();
      });
      arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .text(d => d.data.year);


    // Tooltip setup
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');

    // Function to show tooltip
    function showTooltip(event, year) {
      tooltip.html(year)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .style('visibility', 'visible');
    }

    // Function to hide tooltip
    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }
  });
</script>

<svg id="pieChart"></svg>

<style>
  .tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px;
    border-radius: 3px;
    pointer-events: none; 
    transform: translate(-50%, -100%); 
    visibility: hidden;
  }

  svg {
    /* border: 1px solid #ccc; */
  }
</style>
