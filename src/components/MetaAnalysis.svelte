<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // Path to your CSV file in the public folder
    const csvFilePath = './code-analysis.csv';

    // Reactive variables to store stats
    let totalCommits = 0;
    let uniqueAuthorsCount = 0;
    let linesOfCode = 0;
    let commitDateRange = { min: null, max: null };

    // Load and process CSV data on client-side only
    onMount(async () => {
        try {
            // Fetch and parse the CSV data
            const data = await d3.csv(csvFilePath);

            // Process the CSV data to compute stats
            data.forEach(row => {
                if (row.metric === 'Total Commits') {
                    totalCommits = row.value;
                }
                if (row.metric === 'Unique Authors') {
                    uniqueAuthorsCount = row.value;
                }
                if (row.metric === 'Lines of Code') {
                    linesOfCode = row.value;
                }
                if (row.metric === 'Commit Dates') {
                    // Split commit dates into an array and convert to Date objects
                    const commitDates = row.value.split(', ').map(dateStr => {
                        const parsedDate = new Date(dateStr);
                        return isNaN(parsedDate.getTime()) ? null : parsedDate; // Ensure valid date
                    }).filter(date => date !== null); // Remove invalid dates

                    // If there are valid dates, use the first and last date
                    if (commitDates.length > 0) {
                        commitDateRange.min = commitDates[0].toDateString(); // First date
                        commitDateRange.max = commitDates[commitDates.length - 1].toDateString(); // Last date
                    } else {
                        commitDateRange.min = commitDateRange.max = 'Invalid Dates';
                    }
                }
            });
        } catch (error) {
            console.error('Error loading CSV file:', error);
        }
    });
</script>

<style>
    /* Add some basic styling */
    #stats {
        font-family: Arial, sans-serif;
    }
    .stat-item {
        margin: 0.5em 0;
    }
</style>

<div id="stats">
    <h2>Project Commit Summary</h2>
    <p class="stat-item">Total Commits: {totalCommits}</p>
    <p class="stat-item">Unique Authors: {uniqueAuthorsCount}</p>
    <p class="stat-item">Lines of Code: {linesOfCode}</p>
    <p class="stat-item">Commit Date Range:{commitDateRange.max} - {commitDateRange.min} </p>
</div>
