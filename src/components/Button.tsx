import React  from 'react';

interface ButtonTypes {
    title: string,
    onClick?: Function,
    className?: string,
}

export const Button = ( props : ButtonTypes) => (
    <button onClick={props.onClick} className={props.className}>{props.title}</button>
);