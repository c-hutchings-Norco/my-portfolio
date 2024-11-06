<script>
    export let data = [];
    export let hoveredYear = '';
  </script>
  
  <div class="legend">
    {#each data as { year, count, color }}
      <div class="legend-item" style="opacity: {hoveredYear === year ? 0.7 : 1};">
        <div class="swatch" style="background-color: {color};"></div>
        <span>{year}: {count} project{count > 1 ? 's' : ''} done</span>
      </div>
    {/each}
  </div>
  
  <style> 
    .legend {
      display: flex;
      flex-direction: column;
    }
    .legend-item {
      display: flex;
      align-items: center;
    }
    .swatch {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  </style>
  