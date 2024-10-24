import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import type { ICellPadding } from 'Controls/grid';
import {
    CollectionContext,
    ITrackedPropertiesContext,
    TrackedPropertiesContext,
} from 'Controls/baseList';
import { ITrackedPropertiesItem } from 'Controls/interface';

export interface ITrackedPropertiesTemplateProps {
    trackedProperties: ITrackedPropertiesItem[];
    contentAlign?: string;
    paddingSize?: string;
    cellPadding?: ICellPadding;
    position?: 'left' | 'right';
    children?: React.ReactNode;
    content?: TemplateFunction;
    className?: string;
}

interface ITrackedValuesProps {
    trackedValues: Record<string, unknown>;
}

interface ITrackedPropertiesComponentWrapperProps extends ITrackedPropertiesTemplateProps {
    trackedPropertiesTemplate: React.FunctionComponent<
        ITrackedPropertiesTemplateProps & ITrackedValuesProps
    >;
}

function useWatchTrackedValues(): Record<string, string> {
    const collection = React.useContext(CollectionContext);
    const [trackedValues, setTrackedValues] = React.useState(collection.getTrackedValues());

    React.useEffect(() => {
        const handler = (_event, newTrackedValues) => setTrackedValues(newTrackedValues);
        collection.subscribe('trackedValuesChanged', handler);
        return () => {
            collection.unsubscribe('trackedValuesChanged', handler);
        };
    }, [collection]);

    return trackedValues;
}

// Обертка, которая отслеживает изменение trackedValues и прокидывает их дальше
// От нее можно избавиться, если концептуально переписать использование trackedTemplate.
// сейчас прикладники пишут <ws:trackedTemplate> {{trackedTemplate.trackedValues}} </ws:trackedTemplate>,
// без обертки сюда не прокинуть опции
export default function TrackedPropertiesComponentWrapper(
    props: ITrackedPropertiesComponentWrapperProps
) {
    const trackedValues = useWatchTrackedValues();
    const collection = React.useContext(CollectionContext);
    const column = collection.getGridColumnsConfig()[0];
    let contentAlign = 'start';
    let cellPadding = {};
    if (column.getCellProps && collection.getCollection().getCount()) {
        const cellProps = column.getCellProps(collection.getCollection().at(0));
        if (cellProps.halign) {
            contentAlign = cellProps.halign;
        }
        if (cellProps.padding) {
            contentAlign = cellProps.padding;
        }
    } else {
        if (column.align) {
            contentAlign = column.align ?? contentAlign;
        }
        if (column.cellPadding) {
            cellPadding = column.cellPadding ?? cellPadding;
        }
    }
    if (contentAlign === 'right') {
        contentAlign = 'end';
    }
    let contentAlignClass = '';
    if (contentAlign === 'right') {
        contentAlignClass = 'tw-justify-end ';
    } else {
        contentAlignClass = `tw-justify-${contentAlign} `;
    }

    let cellPaddingClass = 'controls-padding_right-grid_';

    if (cellPadding?.right) {
        cellPaddingClass += `${cellPadding.right.toLowerCase()}`;
    } else {
        cellPaddingClass += 'default';
    }

    const checkboxVisibility = React.useContext(CollectionContext).getMultiSelectVisibility();
    const multiSelectPosition = React.useContext(CollectionContext).getMultiSelectPosition();
    let checkboxVisibilityGridClass = 'controls-Grid__TrackedPropertiesTemplate_grid_start_end';
    let checkboxVisibilityColumnPlaceholderClass =
        'controls-Grid__TrackedPropertiesTemplate_columnPlaceholder';
    let trapezeWrapper = '';
    if (checkboxVisibility === 'hidden' || multiSelectPosition === 'custom') {
        checkboxVisibilityGridClass += '_without_checkbox';
        checkboxVisibilityColumnPlaceholderClass += '_without_checkbox';
        trapezeWrapper += ` controls-ListView__item-leftPadding_${props.paddingSize ?? 'default'} `;
    } else {
        checkboxVisibilityGridClass += '_with_checkbox';
        checkboxVisibilityColumnPlaceholderClass += '_with_checkbox';
    }

    const stickyBlockContextClasses = `${contentAlignClass} ${checkboxVisibilityGridClass} ${trapezeWrapper} ${cellPaddingClass}`;
    const afterContentTemplateContextClasses = checkboxVisibilityColumnPlaceholderClass;

    const context = React.useMemo<ITrackedPropertiesContext>(() => {
        const value: ITrackedPropertiesContext = {
            stickyBlockContextClasses,
            afterContentTemplateContextClasses,
        };

        return value;
    }, []);

    return (
        props.trackedPropertiesTemplate && (
            <TrackedPropertiesContext.Provider value={context}>
                <props.trackedPropertiesTemplate {...props} trackedValues={trackedValues} />
            </TrackedPropertiesContext.Provider>
        )
    );
}
