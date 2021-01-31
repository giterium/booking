import React from "react";
import {LoadError} from "../src/components/LoadError";
import { shallow } from 'enzyme';
const setUp = () => shallow(<LoadError />);

describe("should render loadError component", () => {
    let component;
    beforeEach(() => {
        component = setUp();
    });

    it("should contain loadError", () => {
        const wrapper = component.find(".loadError");
        expect(wrapper.length).toBe(1);
    });

});