import React  from 'react';

export type TableErrorsProps = {
    errors: string
};

export const TableErrors = ({ errors }: TableErrorsProps) =>
    <tr>
        <td colSpan={2}>
            <div className="errorBox">{errors && (<div className="invalid-feedback-box">{errors}</div>)}</div>
        </td>
    </tr>
;