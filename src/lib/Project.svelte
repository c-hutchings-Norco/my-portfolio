
  <script>
  export let data = {};
  export let hLevel = 2;
</script>

<article>
  <svelte:element this={'h' + hLevel}>{data.title}</svelte:element>
  <img src={data.image} alt={data.title} />
  <p>{data.description}</p>
  <span>{data.year}</span>
  {#if data.url}
    <a href={data.url} target="_blank" rel="noopener noreferrer">View Project</a>
  {/if}
</article>
    
