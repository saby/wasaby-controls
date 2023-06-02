import { Date } from 'Controls/baseDecorator';
import { date } from 'Types/formatter';
import { useRenderData } from 'Controls/gridReact';
import { Model } from 'Types/entity';

interface IDateNumberRenderValue {
    date: Date;
    number: string;
}

export default function DateNumberCell() {
    const { renderValues } = useRenderData<Model<IDateNumberRenderValue>>([
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
