<script>
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
  import DataFetcher from '../components/DataFetcher.svelte';

  const pages = [
    { url: '/', title: 'Home' },
    { url: '/projects', title: 'Projects' },
    { url: '/contact', title: 'Contact' },
    { url: '/cv', title: 'CV/Resume' },
    { url: 'https://github.com/c-hutchings-Norco', title: 'GitHub' },
  ];

</script>

<nav>
  {#each pages as p}
    <a
      href={p.url.startsWith('http') ? p.url : `${base}${p.url}`}
      class:current={$page?.url?.pathname === `${base}${p.url}`}
      target={p.url.startsWith('http') ? '_blank' : undefined}
      rel={p.url.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {p.title}
    </a>
  {/each}
</nav>



<main>
  <ThemeSwitcher />
  <slot />
  <DataFetcher />
</main>
