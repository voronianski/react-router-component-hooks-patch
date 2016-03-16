import React from 'react';
import { mount } from 'enzyme';
import { Route, Router, createMemoryHistory } from 'react-router'; // eslint-disable-line no-unused-vars
import patchRouteHooks from '../src/patchRouteHooks';

const patchData = {foo: 'bar'};
let patchedRoutes;

describe('patchRouteHooks', () => {
    it('should be ok', () => {
        expect(patchRouteHooks).to.be.ok;
    });

    describe('when using hook methods on es6 classes', function () {
        before(() => {
            class Parent extends React.Component {
                static onEnter(data, nextState, replace, done) {
                    expect(data).to.equal(patchData);
                    expect(nextState).to.be.an('object');
                    expect(replace).to.be.a('function');
                    expect(done).to.be.a('function');
                    done();
                }
                render() {
                    return <div>Parent</div>;
                }
            }
            class Child extends React.Component {
                static onEnter(data, nextState, replace) {
                    expect(data).to.equal(patchData);
                    expect(nextState).to.be.an('object');
                    expect(replace).to.be.a('function');
                }
                static onLeave(data) {
                    expect(data).to.equal(patchData);
                }
                render() {
                    return <div>Child</div>;
                }
            }
            const routes = (
                <Route path="/" component={Parent}>
                    <Route path="/child" component={Child} />
                </Route>
            );
            patchedRoutes = patchRouteHooks(routes, patchData);
        });

        it('should call onEnter methods', () => {
            sinon.spy(patchedRoutes.props, 'onEnter');
            sinon.spy(patchedRoutes.props.children.props, 'onEnter');

            mount(<Router history={createMemoryHistory('/child')} routes={patchedRoutes} />);
            expect(patchedRoutes.props.onEnter.calledOnce).to.equal(true);
            expect(patchedRoutes.props.children.props.onEnter.calledOnce).to.equal(true);
        });

        it('should call onLeave methods', () => {
            sinon.spy(patchedRoutes.props.children.props, 'onLeave');

            const history = createMemoryHistory('/child')
            mount(<Router history={history} routes={patchedRoutes} />);
            history.push('/');
            expect(patchedRoutes.props.children.props.onLeave.calledOnce).to.equal(true);
        });
    });

    describe('when using as statics on React.createClass()', () => {
        before(() => {
            const Parent = React.createClass({
                statics: {
                    onEnter(data, nextState, replace, done) {
                        expect(data).to.equal(patchData);
                        expect(nextState).to.be.an('object');
                        expect(replace).to.be.a('function');
                        expect(done).to.be.a('function');
                        done();
                    }
                },
                render() {
                    return <div>Parent</div>;
                }
            });
            const Child = React.createClass({
                statics: {
                    onEnter(data, nextState, replace) {
                        expect(data).to.equal(patchData);
                        expect(nextState).to.be.an('object');
                        expect(replace).to.be.a('function');
                    },
                    onLeave(data) {
                        expect(data).to.equal(patchData);
                    }
                },
                render() {
                    return <div>Child</div>;
                }
            });
            const routes = (
                <Route path="/" component={Parent}>
                    <Route path="/child" component={Child} />
                </Route>
            );
            patchedRoutes = patchRouteHooks(routes, patchData);
        });

        it('should call onEnter methods', () => {
            sinon.spy(patchedRoutes.props, 'onEnter');
            sinon.spy(patchedRoutes.props.children.props, 'onEnter');

            mount(<Router history={createMemoryHistory('/child')} routes={patchedRoutes} />);
            expect(patchedRoutes.props.onEnter.calledOnce).to.equal(true);
            expect(patchedRoutes.props.children.props.onEnter.calledOnce).to.equal(true);
        });

        it('should call onLeave methods', () => {
            sinon.spy(patchedRoutes.props.children.props, 'onLeave');

            const history = createMemoryHistory('/child')
            mount(<Router history={history} routes={patchedRoutes} />);
            history.push('/');
            expect(patchedRoutes.props.children.props.onLeave.calledOnce).to.equal(true);
        });
    });

    describe('when using hook methods on Routes directly', () => {
        before(() => {
            class Parent extends React.Component {
                render() {
                    return <div>Parent</div>;
                }
            }
            class Child extends React.Component {
                render() {
                    return <div>Child</div>;
                }
            }
            const routes = (
                <Route path="/" component={Parent} onEnter={(data, nextState, replace, done) => {
                    expect(data).to.equal(patchData);
                    expect(nextState).to.be.an('object');
                    expect(replace).to.be.a('function');
                    expect(done).to.be.a('function');
                    done();
                }}>
                    <Route path="/child" component={Child} onEnter={(data, nextState, replace) => {
                        expect(data).to.equal(patchData);
                        expect(nextState).to.be.an('object');
                        expect(replace).to.be.a('function');
                    }} onLeave={(data) => {
                        expect(data).to.equal(patchData);
                    }}/>
                </Route>
            );
            patchedRoutes = patchRouteHooks(routes, patchData);
        });

        it('should call onEnter methods', () => {
            sinon.spy(patchedRoutes.props, 'onEnter');
            sinon.spy(patchedRoutes.props.children.props, 'onEnter');

            mount(<Router history={createMemoryHistory('/child')} routes={patchedRoutes} />);
            expect(patchedRoutes.props.onEnter.calledOnce).to.equal(true);
            expect(patchedRoutes.props.children.props.onEnter.calledOnce).to.equal(true);
        });

        it('should call onLeave methods', () => {
            sinon.spy(patchedRoutes.props.children.props, 'onLeave');

            const history = createMemoryHistory('/child')
            mount(<Router history={history} routes={patchedRoutes} />);
            history.push('/');
            expect(patchedRoutes.props.children.props.onLeave.calledOnce).to.equal(true);
        });
    });
});
