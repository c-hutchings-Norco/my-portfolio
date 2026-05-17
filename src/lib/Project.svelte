
<script>
  export let data = {};
  export let hLevel = 2;
</script>

<article class="project">
  <div class="project-header">
    <svelte:element this={'h' + hLevel} class="project-title">{data.title}</svelte:element>
    <span class="project-year">{data.year}</span>
  </div>
  <img src={data.image} alt={data.title} class="project-image" />
  <p class="project-description">{data.description}</p>
  {#if data.url}
    <a href={data.url} target="_blank" rel="noopener noreferrer" class="project-link">View Project</a>
  {/if}
</article>
