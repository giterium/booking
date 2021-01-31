import React from "react";
import {Loading} from "../src/components/Loading";
import { shallow } from 'enzyme';
const setUp = () => shallow(<Loading />);

describe("should render loading component", () => {
    let component;
    beforeEach(() => {
        component = setUp();
    });

    it("should contain loading", () => {
        const wrapper = component.find(".loading");
        expect(wrapper.length).toBe(1);
    });

});