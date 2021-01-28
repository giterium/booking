import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import React from "react"
import browserEnv from 'browser-env';
import 'babel-polyfill';

React.useLayoutEffect = React.useEffect;
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
browserEnv();
jest.mock('react-dom');
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.toJson = toJson;

// Fail tests on any warning
console.error = message => {
    throw new Error(message);
};