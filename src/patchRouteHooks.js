import React from 'react';

function patchRouteHooks (Route, patchData = {}) {
    const { props: { children, component, onEnter, onLeave } } = Route;

    function _patchChildren (children) {
        if (Array.isArray(children)) {
            return React.Children.map(children, ChildRoute => patchRouteHooks(ChildRoute, patchData));
        } else {
            return patchRouteHooks(children, patchData);
        }
    }

    return {
        ...Route,
        props: {
            ...Route.props,
            onEnter: component && component.onEnter && component.onEnter.bind(Route, patchData) || onEnter && onEnter.bind(Route, patchData),
            onLeave: component && component.onLeave && component.onLeave.bind(Route, patchData) || onLeave && onLeave.bind(Route, patchData),
            children: children ? _patchChildren(children) : null
        }
    };
}

export default patchRouteHooks;
