import TokenExplorer from '../routes/TokenExplorer.svelte'; // Adjust path as needed

// Create a custom element that wraps your Svelte component
class TokenExplorerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Initialize the Svelte component when the custom element is added to the page
    const apiKey = this.getAttribute('api-key') || '';
    
    this.svelteComponent = new TokenExplorer({
      target: this.shadowRoot,
      props: {
        apiKey: apiKey
      }
    });
  }

  disconnectedCallback() {
    // Clean up when the element is removed from the page
    if (this.svelteComponent) {
      this.svelteComponent.$destroy();
    }
  }
  
  // Handle attribute changes
  static get observedAttributes() {
    return ['api-key'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'api-key' && this.svelteComponent) {
      this.svelteComponent.$set({ apiKey: newValue });
    }
  }
}

// Register the custom element
customElements.define('token-explorer', TokenExplorerElement);