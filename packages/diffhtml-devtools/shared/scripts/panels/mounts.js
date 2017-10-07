import React from 'react'
import { Dropdown } from 'semantic-ui-react'

import { html } from 'diffhtml';
import { WebComponent } from 'diffhtml-components';
import PropTypes from 'prop-types';

class DevtoolsMountsPanel extends WebComponent {
  static propTypes = {
    mounts: PropTypes.array,
  }

  render() {
    const { mounts = [] } = this.props;

    const options = mounts.map(({ selector }) => ({
      text: selector,
      value: selector,
    }));

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Mounts</h3>

        <${Dropdown}
          placeholder='Select DOM Node'
          fluid
          selection
          value=${options[0] && options[0].value}
          options=${options}
        />
      </div>

      ${mounts[0] && html`
        <div class="wrapper">
          ${this.renderVTree(mounts[0].tree)}
        </div>
      `}
    `;
  }

  renderVTree(vTree) {
    return html`
      <div class="vtree">
        <h2 class="vtree-header">${vTree.nodeName}</h2>

        ${Boolean(vTree.childNodes.length) && html`
          <div class="vtree-children">
            ${vTree.childNodes.map(vTree => {
              if (vTree.nodeType !== 3) {
                return this.renderVTree(vTree);
              }
            })}
          </div>
        `}
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      * { box-sizing: border-box; }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
        margin-bottom: 0;
        position: sticky;
        top: 0;
        z-index: 100;
        background: #3E82F7;
        border-radius: 0 !important;
        color: #FFF;
        user-select: none;
      }

      .vtree {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 48px;
        padding: 20px;
        background-color: #E2E2E2;
      }

      .vtree-header {
        margin-bottom: 0;
      }

      .vtree-children {
        display: flex;
        flex-direction: row;
      }
    `;
  }
}

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
