<script>
    export let data = [];

  </script>
  
  <div class="legend">
    {#each data as { year, count }}
      <div class="legend-item">
        <div class="swatch" style="background-color: /* Set color based on year or another property */;"></div>
        <span>{year}: {count} project{count > 1?'s':''} done</span>
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
  