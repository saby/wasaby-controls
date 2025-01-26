import { LadderWrapper, useItemData } from 'Controls/grid';
import { Model } from 'Types/entity';

export function DateAndTime() {
    const { renderValues } = useItemData<Model>(['date', 'time']);

    return (
        <div>
            <LadderWrapper
                ladderProperty={'date'}
                className="ControlsDemo_dateTime-cell ControlsDemo_date-cell"
            >
                {renderValues.date}
            </LadderWrapper>
            <LadderWrapper
                ladderProperty={'time'}
                className="ControlsDemo_dateTime-cell ControlsDemo_time-cell"
            >
                {renderValues.time}
            </LadderWrapper>
        </div>
    );
}
