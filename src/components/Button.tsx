import React  from 'react';

interface ButtonTypes {
    title: string,
    onClick?: (e: Event) => void,
    className?: string,
}

export const Button = ( props : ButtonTypes) => (
    <button onClick={props.onClick} className={props.className}>{props.title}</button>
);