<script>
  import Modal from "./Modal.svelte";

  export let type;

  const content = {
    "gbRange": "<p>This controls the desired range of GanbarOmeter values. This is the highlighted area on the dial.</p>",
  };

  let modal;

  
</script>

<svelte:window
    on:keydown={e => {
    if (e.key === "Escape") {
      modal.hide();
    }
  }} />

<svg on:click|preventDefault={() => modal.toggle()} class="icon" id="e8de67ab-69e8-4dd2-9e7e-08244f53c8b3" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 296 296">
  <circle cx="148" cy="148" r="143" style="fill: none;stroke: #000;stroke-linecap: round;stroke-linejoin: round;stroke-width: 10px"/>
  <path d="M216.2,121a16.2,16.2,0,1,1-16.1-16A16,16,0,0,1,216.2,121Zm-27.1,47.6c0-6.3,4.1-9.4,10.8-9.4s11,3.1,11,9.4V285.4c0,6.5-4.5,9.6-11,9.6s-10.8-3.1-10.8-9.6Z" transform="translate(-52 -52)"/>
</svg>
<Modal bind:this={modal}>
  <div class="content">{@html content[type]}</div>
</Modal>

<style>
  .icon {
    width: 15px;
    height: 15px;
    margin: -2px;
    opacity: 0.6;
  }
  .content{
    padding: 1em;
    width: 20rem;
  }
</style>