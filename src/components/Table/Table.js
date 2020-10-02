import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({ countries }) {
    return (
        <div className="table">
            {/* map through countries, destructured into country and cases */}
            {countries.map(({country, cases})  => (
                <tr>
                    {/* country.country => country */}
                    <td>{country}</td>
                    {/* country.cases => cases */}
                    <td>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
