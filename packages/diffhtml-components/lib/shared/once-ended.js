import { Internals } from 'diffhtml';
import { ComponentTreeCache, InstanceCache } from '../util/caches';
import componentDidMount from './lifecycle/component-did-mount';
import componentWillUnmount from './lifecycle/component-will-unmount';

const { NodeCache } = Internals;
const uppercaseEx = /[A-Z]/g;
const blacklist = new Set();
const whitelist = new Set();
const root = typeof window !== 'undefined' ? window : global;

export default transaction => {
  if (transaction.aborted) {
    return;
  }

  const { patches } = transaction;

  if (patches.SET_ATTRIBUTE || patches.TREE_OPS && patches.TREE_OPS.length) {
    const { SET_ATTRIBUTE } = patches;
    uppercaseEx.lastIndex = 0;

    if (SET_ATTRIBUTE && SET_ATTRIBUTE.length) {
      for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
        const oldTree = SET_ATTRIBUTE[i];
        let name = SET_ATTRIBUTE[i + 1];
        const value = SET_ATTRIBUTE[i + 2];
        const domNode = NodeCache.get(oldTree);

        // Normalize uppercase attributes.
        if (uppercaseEx.test(name)) {
          uppercaseEx.lastIndex = 0;

          name = name.replace(uppercaseEx, ch => `-${ch.toLowerCase()}`);

          if (value && typeof value === 'string') {
            domNode.setAttribute(name, value);
          }
        }

        // If working with a custom element, we want to do some special logic
        // to make sure attributeChangedCallback triggers properly with dynamic
        // values.
        if (root.customElements && customElements.get(oldTree.nodeName)) {
          const blacklistName = oldTree.nodeName + '-' + name;

          // We remove and re-add the attribute to trigger a change in a web
          // component or mutation observer. Although you could use a setter or
          // proxy, this is more natural.
          if (domNode.hasAttribute(name) && domNode[name] !== value) {
            domNode.removeAttribute(domNode, name);
          }
          else if (typeof value !== 'string') {
            // Since this is a property value it gets set directly on the node.
            if (whitelist.has(blacklistName)) {
              domNode[name] = value;
            }
            else if (!blacklist.has(blacklistName)) {
              try {
                domNode[name] = value;
                whitelist.add(blacklistName);
              } catch (unhandledException) {
                blacklist.add(blacklistName);
              }
            }

            // Remove the attribute and then re-add to trigger the
            // attributeChangedCallback.
            domNode.removeAttribute(domNode, name);

            // Necessary to track the attribute/prop existence. WebComponents
            // trigger this, when they are
            domNode.setAttribute(name, '');

            // FIXME This is really unfortunate, but after trigger a change via
            // attr, we need to reset the actual value in the instance for
            // things like event handlers. In the future it would be great to
            // limit this to actual attr -> prop keys. Custom attributes do not
            // suffer from this problem as they are not translated.
            if (whitelist.has(blacklistName)) {
              domNode[name] = value;
            }
            else if (!blacklist.has(blacklistName)) {
              try {
                domNode[name] = value;
                whitelist.add(blacklistName);
              } catch (unhandledException) {
                blacklist.add(blacklistName);
              }
            }
          }
        }
      }
    }

    patches.TREE_OPS.forEach(({ INSERT_BEFORE, REPLACE_CHILD, REMOVE_CHILD }) => {
      if (INSERT_BEFORE) {
        for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
          componentDidMount(INSERT_BEFORE[i + 1]);
        }
      }

      if (REPLACE_CHILD) {
        for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
          const newTree = REPLACE_CHILD[i];
          const oldTree = REPLACE_CHILD[i + 1];
          const oldComponentTree = ComponentTreeCache.has(oldTree);
          const newComponentTree = ComponentTreeCache.has(newTree);

          if (oldComponentTree) {
            componentWillUnmount(oldTree);
          }
          if (newComponentTree) {
            componentDidMount(newTree);
          }
        }
      }

      if (REMOVE_CHILD) {
        for (let i = 0; i < REMOVE_CHILD.length; i++) {
          componentWillUnmount(REMOVE_CHILD[i]);
        }
      }
    });
  }
};
