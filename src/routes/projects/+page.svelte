<script>
    import projects from '$/lib/projects.json';
</script>

<main>
    <h1>Projects</h1>
    <div class="projects">
        {#each projects as project}
            <article>
                <h2>{project.title}</h2>
                <img src={project.image} alt={project.title} />
                <p>{project.description}</p>
            </article>
        {/each}
    </div>
</main>