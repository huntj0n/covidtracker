import React from 'react';
import './InfoBox.css';

//Material UI
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, total}) {
    return (
        <Card className="infobox">
            <CardContent>
                {/* Title */}
                <Typography className='infobox__title' color="textSecondary">
                    {title}
                </Typography>

                {/* Number of Cases today */}
                <h2 className="infobox__cases">{cases}</h2>

                {/* total cases */}
                <Typography className="infobox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
