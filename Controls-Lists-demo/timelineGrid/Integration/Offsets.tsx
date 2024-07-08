import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import type { IDataConfig } from 'Controls/dataFactory';
import { ITimelineGridDataFactoryArguments } from 'Controls-Lists/timelineGrid';
import { TGridVPaddingSize } from 'Controls/interface';
import TimelineGridDemoVariant from 'Controls-Lists-demo/timelineGrid/WI/Offsets/Index';

function TimelineGridDemo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div className="tw-flex tw-flex-wrap" ref={ref}>
            {(['null', '2xs', 'xs', 's', 'm', 'xl'] as TGridVPaddingSize[]).map(
                (padding, index) => {
                    const key = `TimelineGrid_Integration_Offsets_${index}`;
                    return (
                        <div
                            key={key}
                            data-qa={key}
                            className="controls-padding_bottom-l controls-padding_right-l"
                        >
                            <div>Отступ размера {padding}</div>
                            <TimelineGridDemoVariant padding={padding} />
                        </div>
                    );
                }
            )}
        </div>
    );
}

export default Object.assign(React.forwardRef(TimelineGridDemo), {
    getLoadConfig(): Record<string, IDataConfig<ITimelineGridDataFactoryArguments>> {
        return {
            ...TimelineGridDemoVariant.getLoadConfig(),
        };
    },
});
