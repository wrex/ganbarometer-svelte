<script>
  import Ganbarometer from "./components/Ganbarometer.svelte";

  let wkofLoaded = wkof ? true : false;
</script>

<section data-testid="ganbarometer">
  {#if wkofLoaded }
  <Ganbarometer />
  {:else}
  <div class="placeholder">
    <h2>GanbarOmeter</h2>  
    <p>
      The GanbarOmeter needs the Wankani Open Framework to be installed prior to use.
    </p> 
    
    <p>Please refer to the <a
    href="http://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549">WKOF
    installation instructions.</a></p>
  </div>
  {/if}

</section>


<style>
  section {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
    column-gap: 20px;

    background-color: #f4f4f4;
    border-radius: 5px;
    margin: 0 0 30px;
    padding: 0.5em 0 0;
  }

  .placeholder {
    height: 150px;
    color: red;
    align-content: center;
  }
</style>