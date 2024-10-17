import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { DataContext } from 'Controls-DataEnv/context';
import { RangeSelectorConnectedComponent, IRange } from 'Controls-Lists/timelineGrid';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

const STORE_ID = 'RangeSelectorBaseDemo';

// Контекст только для этой демки. В оригинале компонент работает
// с фабрикой Controls-Lists/timelineGrid:TimelineGridFactory
function mockLoadConfig(): { [p: string]: object } {
    const currentDate = new Date(2023, 0, 1);
    return {
        [STORE_ID]: {
            visibleRange: {
                start: BaseDateUtils.getStartOfMonth(currentDate),
                end: BaseDateUtils.getEndOfMonth(currentDate),
            },
            setRange(newRange: IRange) {
                this.visibleRange = newRange;
            },
        },
    };
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const context = React.useMemo(() => mockLoadConfig(), []);
    return (
        <div
            ref={ref}
            style={{
                width: '250px',
            }}
            className={'controls-padding-m'}
        >
            <DataContext.Provider value={context}>
                <RangeSelectorConnectedComponent storeId={STORE_ID} fontColorStyle={'primary'} />
            </DataContext.Provider>
        </div>
    );
}

export default React.forwardRef(Demo);
