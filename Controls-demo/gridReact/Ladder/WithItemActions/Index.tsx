import * as React from 'react';
import { IGroupDemoProps } from 'Controls-demo/gridReact/Group/Editors';
import { getColumns, getData, getHeader } from 'Controls-demo/gridReact/resources/DataWithGrouping';
import { Container as ScrollContainer } from 'Controls/scroll';
import { ItemsView as GridItemsView, ITrackedPropertiesTemplateProps } from 'Controls/grid';
import { TrackedPropertiesTemplate } from 'Controls/list';

type TTrackerPos = 'left ' | 'right';

const WithItemActions = React.forwardRef<HTMLDivElement, IGroupDemoProps>(
    (_, ref: React.ForwardedRef<HTMLDivElement>) => {
        const [switchValue, setSwitchValue] = React.useState<boolean>(false);
        const [trackerPos, setTrackerPos] = React.useState<TTrackerPos>('left');

        const items = React.useMemo(() => getData(), []);
        const columns = React.useMemo(() => getColumns(), []);
        const header = React.useMemo(() => getHeader(), []);

        const handleSwitchChange = React.useCallback(
            (event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.checked;
                setTrackerPos(value ? 'right' : 'left');
                setSwitchValue(value);
            },
            []
        );
        return (
            <div ref={ref} className="p">
                <label>
                    <span style={{ marginRight: '10px' }}>Переключить положение трэкера</span>
                    <input type="checkbox" checked={switchValue} onChange={handleSwitchChange} />
                </label>
                <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                    <GridItemsView
                        items={items}
                        columns={columns}
                        header={header}
                        groupProperty={'group'}
                        stickyGroup={true}
                        ladderProperties={['date']}
                        trackedProperties={['date']}
                        trackedPropertiesTemplate={(props: ITrackedPropertiesTemplateProps) => (
                            <TrackedPropertiesTemplate
                                trackedProperties={props.trackedProperties}
                                position={trackerPos}
                            >
                                {props?.trackedValues.date}
                            </TrackedPropertiesTemplate>
                        )}
                    />
                </ScrollContainer>
            </div>
        );
    }
);

export default WithItemActions;
