import * as React from 'react';
import { date as formatDate } from 'Types/formatter';
import { Model } from 'Types/entity';

const DYNAMIC_COLUMN_DATA_FIELD = 'dynamicColumnsData';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

interface IProps {
    item: Model;
    date: Date;
}

export default function DynamicColumnComponent(props: IProps): React.ReactElement {
    const { item, date } = props;
    const dynamicColumnsData = item.get(DYNAMIC_COLUMN_DATA_FIELD);
    const dateStr = formatDate(date, DATE_FORMAT);
    const dayData = dynamicColumnsData.getRecordById(dateStr);
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{dayData?.get('dynamicTitle')}</>
    );
}