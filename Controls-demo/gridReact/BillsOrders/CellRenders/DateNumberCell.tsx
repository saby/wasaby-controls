import { Date } from 'Controls/baseDecorator';
import { date } from 'Types/formatter';
import { useItemData } from 'Controls/gridReact';
import { MyModel } from 'Controls-demo/gridReact/resources/Data';

export default function DateNumberCell() {
    const { renderValues } = useItemData<MyModel>(['date', 'number']);
    return (
        <div className={'ws-flex-column'}>
            {renderValues.date && (
                <Date value={renderValues.date} format={date.FULL_DATE_FULL_YEAR} />
            )}
            {renderValues.number && (
                <div className={'controls-fontsize-xs'}>{renderValues.number}</div>
            )}
        </div>
    );
}
