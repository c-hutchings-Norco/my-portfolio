<!-- src/components/ThemeSwitcher.svelte -->
<script>
    import { onMount } from 'svelte';

    let colorScheme = 'light'; // Default value

    // Function to set the color scheme
    const setColorScheme = (scheme) => {
        colorScheme = scheme;
        document.documentElement.style.setProperty('color-scheme', colorScheme);
        document.body.classList.toggle("dark-mode", colorScheme === "dark");
        localStorage.setItem('colorScheme', colorScheme);
    };

    // Use onMount to run this code only in the browser
    onMount(() => {
        const savedColorScheme = localStorage.getItem('colorScheme');
        if (savedColorScheme) {
            colorScheme = savedColorScheme;
        } else {
            // Determine the initial color scheme based on system preference
            const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
            colorScheme = prefersDarkScheme ? 'dark' : 'light';
        }
        setColorScheme(colorScheme);
    });

    // Handle theme change
    const handleChange = (event) => {
        setColorScheme(event.target.value);
    };
</script>

<label class="color-scheme" style="position: absolute; top: 1rem; right: 1rem; font-size: 0.8rem;">
    Theme:
    <select bind:value={colorScheme} on:change={handleChange}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="light dark">Automatic</option>
    </select>
</label>

<style>
    /* Add any additional styles for the theme switcher here */
    .dark-mode {
        /* Your dark mode styles here */
    }
</style>
