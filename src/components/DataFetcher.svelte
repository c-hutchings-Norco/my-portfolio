<script>
    import { onMount } from 'svelte';

    let users = [];
    let followers = 0;
    let following = 0;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const response = await fetch('https://api.github.com/users/c-hutchings-Norco');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            followers = data.followers;
            following = data.following;

            users = []; //await response.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

<h2>Github Stats</h2>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else}
    <div class="github-stats">
        <p>Followers: {followers}</p>
        <p>Following: {following}</p>
    </div>    

{/if}

<style>
    .user-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        gap: 16px; 
        margin-top: 20px; 
    }

    .user-card {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s; 
    }

    .user-card:hover {
        transform: scale(1.05); 
    }
    .github-stats {
    font-size: 1.2em;
    color: #333;
  }

    @media (max-width: 600px) {
        .user-grid {
            grid-template-columns: 1fr; 
        }
    }
</style>
