import * as React from 'react';
import type { Model } from 'Types/entity';
import { helpers } from 'Controls/listsCommonLogic';
import { getKey, INewListSchemeHandlers } from 'Controls/baseList';
import { constants } from 'Env/Env';
import { IComponentHandlers } from './interface/IComponentProps';

export interface IListContainerHandlersConverterProps
    extends INewListSchemeHandlers,
        IComponentHandlers {
    children: JSX.Element;
}

function ListContainerHandlersConverter({
    onViewKeyDownArrowUpNew,
    onViewKeyDownArrowDownNew,
    onViewKeyDownArrowLeftNew,
    onViewKeyDownArrowRightNew,
    onViewKeyDownDelNew,
    onViewKeyDownSpaceNew,
    onItemKeyDownEnterNew,

    onItemClickNew,
    onCheckboxClickNew,
    onExpanderClick,
    expand,
    ...props
}: IListContainerHandlersConverterProps): JSX.Element {
    const itemHandlers = React.useMemo(
        () => ({
            onClick: (event: React.MouseEvent, item: Model | Model[]) => {
                helpers.events.parseTreeGridViewItemClick<Model | Model[]>(
                    {
                        event,
                        item,
                        cleanScheme: true,
                    },
                    {
                        onCheckbox: () => {
                            onCheckboxClickNew?.(getKey(item));
                        },
                        onItem: (event) => {
                            onItemClickNew?.(getKey(item), {
                                onActivate: () => {
                                    // TODO: ColumnIndex третим параметром
                                    props?.onItemClick?.(item, event);
                                },
                            });
                        },
                        onExpander: () => {
                            onExpanderClick?.(getKey(item));
                        },
                        onHasMore: () => {
                            // Коллекция накидывает префикс
                            expand?.((getKey(item) as string).replace('node-footer-', ''));
                        },
                    }
                );
            },
            onKeyDown: (event: React.KeyboardEvent) => {
                const handlers = {
                    [constants.key.up]: onViewKeyDownArrowUpNew,
                    [constants.key.down]: onViewKeyDownArrowDownNew,
                    [constants.key.left]: onViewKeyDownArrowLeftNew,
                    [constants.key.right]: onViewKeyDownArrowRightNew,
                    [constants.key.space]: onViewKeyDownSpaceNew,
                    [constants.key.enter]: onItemKeyDownEnterNew,
                    [constants.key.del]: onViewKeyDownDelNew,
                };
                helpers.events.parseViewKeyDown(event, handlers);
            },
        }),
        [
            onCheckboxClickNew,
            onExpanderClick,
            onItemClickNew,
            onViewKeyDownArrowUpNew,
            onViewKeyDownArrowDownNew,
            onViewKeyDownArrowLeftNew,
            onViewKeyDownArrowRightNew,
            onViewKeyDownDelNew,
            onViewKeyDownSpaceNew,
            onItemKeyDownEnterNew,
        ]
    );
    return React.cloneElement(props.children, {
        itemHandlers,
    });
}
ListContainerHandlersConverter.displayName =
    'Controls-Lists/_treeGrid/ListContainerHandlersConverter';
export default React.memo(ListContainerHandlersConverter);
