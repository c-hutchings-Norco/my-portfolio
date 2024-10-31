<script>
    import { onMount } from 'svelte';

    let users = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            users = await response.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

<h2>Users</h2>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else}
    <div class="user-grid">
        {#each users as user}
            <div class="user-card">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Website: <a href={`http://${user.website}`} target="_blank">{user.website}</a></p>
            </div>
        {/each}
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

    @media (max-width: 600px) {
        .user-grid {
            grid-template-columns: 1fr; 
        }
    }
</style>
