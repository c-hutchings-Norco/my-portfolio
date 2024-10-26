<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  const pages = [
    { url: '/', title: 'Home' },
    { url: 'projects', title: 'Projects' },
    { url: 'contact', title: 'Contact' },
    { url: 'cv', title: 'CV/Resume' },
    { url: 'https://github.com/c-hutchings-Norco', title: 'GitHub' },
  ];

  let theme = 'light dark';

  function setColorScheme(colorScheme) {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('color-scheme', colorScheme);
      if (colorScheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      localStorage.colorScheme = colorScheme;
    }
  }

  onMount(() => {
    if ("colorScheme" in localStorage) {
      theme = localStorage.colorScheme;
      setColorScheme(theme);
    } else if (typeof window !== 'undefined') {
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setColorScheme(prefersDarkScheme ? "dark" : "light");
    }
  });
</script>

<nav>
  {#each pages as p}
    <a
      href={p.url.startsWith('http') ? p.url : `${base}${p.url}`}
      class:current={$page.url.pathname === `${base}${p.url}`}
      target={p.url.startsWith('http') ? '_blank' : undefined}
      rel={p.url.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {p.title}
    </a>
  {/each}
</nav>

<label class="color-scheme">
  Theme:
  <select bind:value={theme} on:change={(e) => setColorScheme(e.target.value)}>
    <option value="light dark">Automatic</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</label>

<main>
  <slot />
</main>
