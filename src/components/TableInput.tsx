import React  from 'react';

interface TableInputTypes {
    title: string,
    type?: string,
    className: string,
    name: string,
    changeUpdate: (e: any) => void,
    onKeyPress?: (e: EventTarget) => void,
    onFocus?: (e: EventTarget) => void,
    onClick?: (e: EventTarget) => void,
    defaultValue: string | number
}

export const TableInput = ( props : TableInputTypes) => (
    <tr>
        <td className="updateFieldTitle">{props.title}:</td>
        <td>
            <input
                type={(typeof props.type == 'undefined') ? 'text': props.type}
                className={(typeof props.className == 'undefined') ? '': props.className}
                name={props.name}
                onChange={props.changeUpdate}
                onFocus={props.onFocus}
                onClick={props.onClick}
                onKeyUp={props.changeUpdate}
                onKeyPress={props.onKeyPress}
                defaultValue={props.defaultValue}
            />
        </td>
    </tr>
);