<script>
  import Ganbarometer from "./components/Ganbarometer.svelte";
  import {gbSettings} from "./store/stores";

  let wkofLoaded = wkof ? true : false;
</script>

<section data-testid="ganbarometer" class="ganbarometer" style={` 
    --bgColor: ${$gbSettings.bgColor}; 
    --trackColor: ${$gbSettings.trackColor}; 
    --textColor: ${$gbSettings.textColor}; 
    --hlTextColor: ${$gbSettings.hlTextColor}; 
    --fillColor: ${$gbSettings.fillColor}; 
    --warnColor: ${$gbSettings.warnColor}; 
    --lTrackColor: ${$gbSettings.lTrackColor}; 
    --hTrackColor: ${$gbSettings.hTrackColor};`
  } > 
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
  .ganbarometer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
    column-gap: 20px;

    background-color: --var(bgColor, #f2f2f2);
    border-radius: 5px;
    margin: 0 0 30px;
  }

  .placeholder {
    height: 150px;
    color: --var(alertColor, #ff00aa);
    align-content: center;
  }
</style>