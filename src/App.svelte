<script>
  import Ganbarometer from "./components/Ganbarometer.svelte";
  import SettingsForm from "./components/SettingsForm.svelte";
  import Modal, {getModal} from './components/Modal.svelte'

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

  <Modal>
    <SettingsForm />
  </Modal>
</section>


<style>
  button {
    border: 0;
    float: right;
    color: transparent;
    background-color: initial;
    fill: #777;
    padding: 0;
    filter: drop-shadow(3px 5px 3px rgb(0 0 0 / 0.1));
  }

  button:hover,
  button:focus {
    fill: #333;
  }
  section {
    /* border: 1px solid black; */
    background-color: #f4f4f4;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    /* display: grid;
    grid-template-columns: repeat(6, 1fr); */
    /* grid-template-rows: 150px auto; */
    gap: 10px 20px;
    margin: 0 0 20px;
    align-items: stretch;
    padding: 0;
  }

  .placeholder {
    height: 150px;
    color: red;
    align-content: center;
  }
</style>