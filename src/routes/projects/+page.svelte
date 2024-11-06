<script>
  import Project from '$lib/Project.svelte';
  import projects from '$lib/projects.json'; 
  import Pie from "../../components/Pie.svelte";
  import Legend from "../../components/Legend.svelte";

  let searchText = ''; 
  let selectedYear = ''; 
  let hoveredYear = '';

  // Function to generate unique colors
  function generateColor(index) {
    const hue = (index * 137.5) % 360; // Use golden angle to ensure colors are distinct
    return `hsl(${hue}, 70%, 50%)`;
  }

  // Extract unique years and create a color map
  const uniqueYears = [...new Set(projects.map(project => project.year))];
  const colorMap = uniqueYears.reduce((acc, year, index) => {
    acc[year] = generateColor(index);
    return acc;
  }, {});
  // Filter projects based on search text and selected year
  function filterProjects() {
    if (!searchText && selectedYear === '') {
      return projects;
    }

    return projects.filter(project => {
      if(searchText && selectedYear){
        const matchesSearchText = project.title.toLowerCase().includes(searchText.toLowerCase());
        const matchesSelectedYear = selectedYear !== '' && project.year == selectedYear;
        return matchesSearchText && matchesSelectedYear;
      }

      const matchesSearchText = project.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesSelectedYear = selectedYear !== '' && project.year == selectedYear;

      return searchText? matchesSearchText : matchesSelectedYear;
    });
  }

  // Reactive statement to generate pieDataArray with colors
  $: pieDataArray = (() => {
    const pieData = filterProjects().reduce((acc, project) => {
      acc[project.year] = (acc[project.year] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(pieData).map(([year, count]) => ({
      year,
      count,
      color: colorMap[year]
    }));
  })();
  

  function handleSelectYear(event) {
    selectedYear = event.detail;
  }

</script>

<h1>My Projects ({projects.length})</h1>

<!-- Search input and year selector -->
<input 
  type="text" 
  style="display: inline-block; width: 40%; margin: 10px auto;" 
  placeholder="Search projects..." 
  bind:value={searchText} 
/>
<select bind:value={selectedYear} class="form-control" style="display: inline-block; width: 40%; margin: 10px auto;">
  <option value="">All Years</option>
  {#each uniqueYears as year}
    <option value={year}>{year}</option>
  {/each}
</select>
<br />

<!-- Display pie chart and legend -->
<div style="display: flex; justify-content: center; margin:20px">
  <Pie {pieDataArray} bind:hoveredYear on:selectYear={handleSelectYear} />
  <div style="margin: 5%;">
    <Legend data={pieDataArray} {hoveredYear}/>
  </div>
</div>

<!-- Display filtered projects list -->
<div class="projects">
  {#each filterProjects() as p}
    <Project data={p} />
  {/each}
</div>
