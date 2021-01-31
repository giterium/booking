import React  from 'react';
import { TableInput } from "../src/components/TableInput";
const setUp = (props) => shallow(<TableInput {...props} />);

describe("should render TableInput component", () => {
    let component = '';
    beforeEach(() => {
        component = setUp();
    });

    it("should render TableInput component", () => {
        expect(component.debug()).toMatchSnapshot();
    });

    it("should call changeUpdate method", () => {
        const mockCallBack = jest.fn();
        const component = shallow(<TableInput changeUpdate={mockCallBack} />);
        expect(mockCallBack.mock.calls.length).toBe(0);
        component.find("input").simulate("change");
        expect(mockCallBack.mock.calls.length).toBe(1);
    });

    it("should call changeUpdate with increased value", () => {
        const mockCallBack = jest.fn();
        const component = shallow(<TableInput changeUpdate={mockCallBack} />);
        expect(mockCallBack.mock.calls.length).toBe(0);
        component.find('input').simulate('change', 'the-value');
        expect(mockCallBack).toHaveBeenCalledWith( 'the-value');
    });

    it("should use className", () => {
        component = setUp({ className: 'class' });
        expect(component.find('input').hasClass('class')).toEqual(true)
    });

    it("should use defaultValue", () => {
        component = setUp({ defaultValue: 'Hello' });
        const input = component.find('input');
        expect(input.prop('defaultValue')).toEqual('Hello');
    });
});