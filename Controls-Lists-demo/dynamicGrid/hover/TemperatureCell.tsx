import * as React from 'react';

export default function TemperatureCell(props): React.ReactElement {
    const { item, date } = props;
    const dynamicTitle = Math.pow(item.getKey(), 2) + item.getKey() * date.getDate();
    return dynamicTitle;
}
