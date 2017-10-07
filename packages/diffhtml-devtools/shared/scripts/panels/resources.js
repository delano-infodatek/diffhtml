import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsResourcesPanel extends WebComponent {
  render() {
    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Health</h3>
      </div>

      <div class="ui styled fluid accordion">
        <div class="title active">
          <i class="dropdown icon"></i>
          Object Pooling
        </div>

        <div class="content active">
          <p class="transition visible" style="display: block !important;">
            <div class="ui toggle checkbox">
              <input type="checkbox">

              <label>Free</label>
              <label>Allocated</label>
              <label>Protected</label>
            </div>
          </p>
        </div>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: #3E82F7;
        border-radius: 0 !important;
        color: #FFF;
        user-select: none;
      }

      .ui.accordion {
        box-shadow: none !important;
      }
    `;
  }
}

customElements.define('devtools-resources-panel', DevtoolsResourcesPanel);
