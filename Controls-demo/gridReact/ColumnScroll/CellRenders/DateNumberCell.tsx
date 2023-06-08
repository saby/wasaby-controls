import { Date } from 'Controls/baseDecorator';
import { date } from 'Types/formatter';
import { useRenderData } from 'Controls/gridReact';

interface IDateNumberRenderValue {
    date: Date;
    number: string;
}

export default function DateNumberCell() {
    const { renderValues } = useRenderData<IDateNumberRenderValue>([
        'date',
        'number',
    ]);
    return (
        <div className={'ws-flex-column'}>
            {renderValues.date && (
                <Date
                    value={renderValues.date}
                    format={date.FULL_DATE_FULL_YEAR}
                />
            )}
            {renderValues.number && (
                <div className={'controls-fontsize-xs'}>
                    {renderValues.number}
                </div>
            )}
        </div>
    );
}
