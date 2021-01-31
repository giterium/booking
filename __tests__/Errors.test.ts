import React from "react";
import {TableErrors} from "../src/components/TableErrors";
import { shallow } from 'enzyme';
const setUp = (props) => shallow(<TableErrors {...props} />);

describe("should render Error component", () => {
    let component;
    beforeEach(() => {
        component = setUp();
    });

    it("should contain errorBox", () => {
        const wrapper = component.find(".errorBox");
        expect(wrapper.length).toBe(1);
    });

    it("should contain div", () => {
        const wrapper = component.find("div");
        expect(wrapper.length).toBe(1);
    });

    it("should render error message", () => {
        component = setUp({ errors: 'error' });
        const errorBox = component.find(".errorBox");
        expect(errorBox.text()).toBe('error');
    });
});