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

    onItemClick,
    onItemClickNew,
    onCheckboxClickNew,
    onExpanderClick,
    expand,
    children,
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
                                    onItemClick?.(item, event);
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
            onItemClickNew,
            onItemClick,
            onExpanderClick,
            expand,
            onViewKeyDownArrowUpNew,
            onViewKeyDownArrowDownNew,
            onViewKeyDownArrowLeftNew,
            onViewKeyDownArrowRightNew,
            onViewKeyDownSpaceNew,
            onItemKeyDownEnterNew,
            onViewKeyDownDelNew,
        ]
    );
    return React.cloneElement(children, {
        itemHandlers,
    });
}
ListContainerHandlersConverter.displayName =
    'Controls-Lists/_treeGrid/ListContainerHandlersConverter';
export default React.memo(ListContainerHandlersConverter);
