<script>
    import Project from '$lib/Project.svelte';
    import projects from '$lib/projects.json';
    </script>
    
    <main>
        <h1>Caroline Hutchings</h1>
        <p>My name is Caroline and I teach math and data science at Norco College. I am passionate about teaching and data science!</p>
        <img 
            class="fit-picture"
            src="images/Denmark.jpg" 
            alt="Caroline Hutchings with family in Denmark">
        <p>I went to Denmark this summer to watch one of my favorite players! I loved Denmark!!</p>
    
        <h2>Latest Projects</h2>
        <div class="projects highlights">
            {#each projects.slice(0, 3) as project}
                <Project data={project} hLevel={3} />
            {/each}
        </div>
    </main>