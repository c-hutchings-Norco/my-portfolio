<script>
  import Project from '$lib/Project.svelte';
  import projects from '$lib/projects.json'; // Ensure this file contains your project data
  import Pie from "../../components/Pie.svelte";
  import Legend from "../../components/Legend.svelte";

  let searchText = ''; 
  let selectedYear = '' 

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
  const uniqueYears = [...new Set(projects.map(project => project.year))];

  // Reactive statement that updates pieDataArray whenever filterProjects() changes
  $: pieDataArray = (() => {
    const pieData = filterProjects().reduce((acc, project) => {
      acc[project.year] = (acc[project.year] || 0) + 1; // Count projects by year
      return acc;
    }, {});

    return Object.entries(pieData).map(([year, count]) => ({ year, count })); // Convert object to array
  })();

  function handleSelectYear(event) {
    selectedYear = event.detail;
    filterProjects()
  }
</script>

<h1>My Projects ({projects.length})</h1>

<!-- Search input for filtering projects -->
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
<!-- Display filtered pie chart and legend -->
<div style="display: flex; justify-content: center; margin:20px">
  <Pie {pieDataArray} on:selectYear={handleSelectYear} />
  <Legend data={pieDataArray} />
</div>

<br />
<!-- Display the list of filtered projects -->
<div class="projects">
  {#each filterProjects() as p}
    <Project data={p} />
  {/each}
</div>
