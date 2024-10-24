import { LadderWrapper, useItemData } from 'Controls/gridReact';
import { Model } from 'Types/entity';
export function DateAndTime() {
    const { renderValues } = useItemData<Model>(['date', 'time']);

    return (
        <div>
            <LadderWrapper
                ladderProperty={'date'}
                stickyProperty={['date', 'time']}
                className="ControlsDemo_dateTime-cell ControlsDemo_date-cell"
            >
                {renderValues.date}
            </LadderWrapper>
            <LadderWrapper
                ladderProperty={'time'}
                stickyProperty={['date', 'time']}
                className="ControlsDemo_dateTime-cell ControlsDemo_time-cell"
            >
                {renderValues.time}
            </LadderWrapper>
        </div>
    );
}
