import * as React from 'react';
import type { Model } from 'Types/entity';
import { helpers } from 'Controls/listsCommonLogic';
import { INewListSchemeHandlers, getKey } from 'Controls/baseList';

export interface IListContainerHandlersConverterProps extends INewListSchemeHandlers {
    children: JSX.Element;
}

function ListContainerHandlersConverter(props: IListContainerHandlersConverterProps): JSX.Element {
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
                            props.onCheckboxClickNew?.(getKey(item));
                        },
                        onItem: () => {
                            props.onItemClickNew?.(getKey(item));
                        },
                        onExpander: () => {
                            props.onExpanderClick?.(getKey(item));
                        },
                    }
                );
            },
        }),
        [props.onItemClickNew, props.onCheckboxClickNew, props.onExpanderClick]
    );
    return React.cloneElement(props.children, {
        itemHandlers,
    });
}

export default React.memo(ListContainerHandlersConverter);
