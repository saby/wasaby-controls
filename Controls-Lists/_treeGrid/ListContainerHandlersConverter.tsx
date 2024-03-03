import * as React from 'react';
import type { Model } from 'Types/entity';
import { helpers } from 'Controls/listsCommonLogic';
import { INewListSchemeHandlers, getKey } from 'Controls/baseList';
import { constants } from 'Env/Env';

export interface IListContainerHandlersConverterProps extends INewListSchemeHandlers {
    children: JSX.Element;
}

function ListContainerHandlersConverter({
    onViewMouseDownArrowUpNew,
    onViewMouseDownArrowDownNew,
    onViewMouseDownArrowLeftNew,
    onViewMouseDownArrowRightNew,
    onViewMouseDownSpaceNew,

    onItemClickNew,
    onCheckboxClickNew,
    onExpanderClick,
    ...props
}: IListContainerHandlersConverterProps): JSX.Element {
    const itemHandlers = React.useMemo(
        () => ({
            onClick: (event: React.MouseEvent, item: Model | Model[]) => {
                helpers.events.parseGridViewItemClick<Model | Model[]>(
                    {
                        event,
                        item,
                        cleanScheme: true,
                    },
                    {
                        onCheckbox: () => {
                            onCheckboxClickNew?.(getKey(item));
                        },
                        onItem: () => {
                            onItemClickNew?.(getKey(item));
                        },
                        onExpander: () => {
                            onExpanderClick?.(getKey(item));
                        },
                    }
                );
            },
            onKeyDown: (event: React.KeyboardEvent) => {
                const handlers = {
                    [constants.key.up]: onViewMouseDownArrowUpNew,
                    [constants.key.down]: onViewMouseDownArrowDownNew,
                    [constants.key.left]: onViewMouseDownArrowLeftNew,
                    [constants.key.right]: onViewMouseDownArrowRightNew,
                    [constants.key.space]: onViewMouseDownSpaceNew,
                };
                helpers.events.parseViewKeyDown(event, handlers);
            },
        }),
        [
            onCheckboxClickNew,
            onExpanderClick,
            onItemClickNew,
            onViewMouseDownArrowUpNew,
            onViewMouseDownArrowDownNew,
            onViewMouseDownArrowLeftNew,
            onViewMouseDownArrowRightNew,
            onViewMouseDownSpaceNew,
        ]
    );
    return React.cloneElement(props.children, {
        itemHandlers,
    });
}
ListContainerHandlersConverter.displayName =
    'Controls-Lists/_treeGrid/ListContainerHandlersConverter';
export default React.memo(ListContainerHandlersConverter);
