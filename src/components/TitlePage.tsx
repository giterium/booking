import React from "react";

type TitleProps = { title: string };
export const TitlePage = ({ title }: TitleProps) => <div className="titlePage">{title}</div>;