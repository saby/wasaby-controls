import * as React from 'react';
import 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IGroupProps, useItemData } from 'Controls/gridReact';
import { getItems, getColumns } from '../resources/CountriesData';
import { IGroupDemoProps, GroupPropsEditors } from './Editors';
import { URL } from 'Browser/Transport';

export function GroupRender(): React.ReactElement {
    const { item } = useItemData();
    return (
        <div className={'tw-flex tw-w-full tw-flex-col controls-padding_bottom-s'}>
            <div className={'tw-w-full tw-flex tw-justify-center'}>
                Свой шаблон для группы {item}
            </div>
        </div>
    );
}

function GroupDemo(props: IGroupDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = React.useMemo(() => getItems(), []);
    const columns = React.useMemo(() => getColumns(), []);
    const hasGroupRender = URL.getQueryParam('hasGroupRender') || false;
    const [groupProps, setGroupProps] = React.useState({});
    const groupRender = React.useMemo(
        () => (hasGroupRender ? GroupRender : undefined),
        [hasGroupRender]
    );
    const groupPropsEditor = React.useMemo(
        () =>
            !hasGroupRender ? (
                <GroupPropsEditors {...props} value={groupProps} onChange={setGroupProps} />
            ) : null,
        [hasGroupRender, groupProps, props]
    );

    const getGroupProps = React.useCallback(
        (groupName: string): IGroupProps => {
            return groupProps;
        },
        [groupProps]
    );

    return (
        <div ref={ref}>
            {groupPropsEditor}
            <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    groupProperty={'group'}
                    groupRender={groupRender}
                    getGroupProps={getGroupProps}
                    stickyGroup={true}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(GroupDemo);
