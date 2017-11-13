# Getting started

## About

diffHTML is a view library for creating reactive interfaces for the web. You
would use it in the same way as tools like [React](https://reactjs.org/) and
[Vue](https://vuejs.org/), along with many others that assist with creative
rich user interfaces.

This tool is a logical progression from learning `innerHTML` on a page, you destroy all state and have no hooks
into the changes that would occur between the states.  With diffHTML you get to
write familiar declarative markup (HTML), use a simple core API (minimal
learning required), and 

The diffHTML core library

**turns:**

``` javascript
const div = document.createElement('div');

div.innerHTML = 'Hello world';
docuent.body.appendChild(div);
div.textContent = 'Hello world!';
```

**into:**

``` javascript
diff.innerHTML(document.body, '<div>Hello world</div>');
diff.innerHTML(document.body, '<div>Hello world!</div>');
```

Unlike React, the core engine of diffHTML was designed with the browser in mind
first so includes the DOM rendering engine. This makes diffHTML suitable for
web applications with a single package.

The core of diffHTML is a powerful and easy-to-use virtual dom library that can
help devs get from the basics to something like React. Being designed to be
flexible and allow graceful. Use HTML or JSX, they both get normalized to the
same DOM tree. You can diff plain HTML strings, or get fancy with a tagged
template handler that will allow you to get React-like capabilities without
needing a build step.

## Installing

We encourage brand new developers who want to try diffHTML to use our pre-made Glitch examples. This will let you mess with the API without having to download or configure anything.

* CDN (Recommended for Beginners):

  ```
  <script src="https://diffhtml.org/master/diffhtml/dist/diffhtml.js"></script>
  ```

* <svg viewBox="0 0 18 7" width="40" style="position: relative; top: 2px;">
    <path fill="#CB3837" d="M0,0v6h5v1h4v-1h9v-6"></path>
    <path fill="#FFF" d="M1,1v4h2v-3h1v3h1v-4h1v5h2v-4h1v2h-1v1h2v-4h1v4h2v-3h1v3h1v-3h1v3h1v-4"></path>
  </svg>

  ``` sh
  npm install diffhtml
  ```

* <img width="60" src="images/yarn-logo.svg">

  ``` sh
  yarn add diffhtml
  ```

_While `diffhtml` is the core package to install, there are many other modules you may also want to install depending on your use cases._

## Accessing the API

* Browser:

  ``` xml
  <script src="node_modules/diffhtml/dist/diffhtml.js"></script>
  ```

  ``` javascript
  diff.innerHTML(document.body, 'Hello world!')
  ```

* ES Modules:

  ``` javascript
  import { innerHTML } from 'diffhtml'

  innerHTML(document.body, 'Hello world!')
  ```

* Node:

  ``` javascript
  const { innerHTML } = require('diffhtml')

  innerHTML(document.body, 'Hello world!')
  ```
