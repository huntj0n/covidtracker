import React from 'react';
import './Table.css';

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
                        <strong>{cases}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
