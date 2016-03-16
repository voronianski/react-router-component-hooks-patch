# react-router-hooks-patch

[![build status](http://img.shields.io/travis/voronianski/react-router-hooks-patch.svg?style=flat)](https://travis-ci.org/voronianski/react-router-hooks-patch)
[![npm version](http://badge.fury.io/js/react-router-hooks-patch.svg)](http://badge.fury.io/js/react-router-hooks-patch)

> Patch [react-router](https://github.com/reactjs/react-router)'s [Route](https://github.com/reactjs/react-router/blob/master/docs/Glossary.md#route) components with static hook methods `onEnter`/`onLeave`.

## Install

```bash
npm install react-router-hooks-patch --save
```

## Usage

### `patchRouteHooks(Route: <Route>, data: ?Object)`;

- `Route` - [Route](https://github.com/reactjs/react-router/blob/master/docs/Glossary.md#route) or array or [Routes](https://github.com/reactjs/react-router/blob/master/docs/Glossary.md#route) which component you want to patch with static `onEnter`/`onLeave` methods. **Children routes will be patched too.**
- `data` - pass data that you need in your methods. It's perfect place for instances of some sort of data abstraction (e.g. Flux/Redux in universal apps). **Passed data object will be the first argument in `onEnter`/`onLeave` functions.

### Requirements

Patch works only with latest react-router version (`>= 2`, see [upgrade guide](https://github.com/reactjs/react-router/blob/master/upgrade-guides/v2.0.0.md));

## Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Route from 'react-router/lib/Route';
import browserHistory from 'react-router/lib'
import patchRouteHooks from 'react-router-hooks-patch';
import Flux from '../path/to/flux'; // or any data abstraction

class App extends React.Component {
    static onEnter({ flux }, nextState, replace, done) {
        // do some async actions and call done when you're ready
        done();
    }

    static onLeave({ flux }) {
        // receives only passed data object as argument
    }

    render() {
        return <div>...</div>;
    }
}

const routes = (
    <Route path="/" component={App}>
        <Route path="about" component={About} onEnter={({ flux }) => {
            // methods on Route also get patched
        }} />
        <Route path="users" component={Users} />
    </Route>
);

const flux = new Flux();
const patchedRoutes = patchRouteHooks(routes, { flux });

ReactDOM.render(
    <Router history={browserHistory} routes={patchedRoutes} />,
    document.getElementById('app');
);
```

_NOTE: You can check the detailed application example with server-rendering and patching routes in this [repo](https://github.com/voronianski/universal-react-router-flux-2016)._

---
**MIT Licensed**
