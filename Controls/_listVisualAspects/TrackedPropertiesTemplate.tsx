import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import type { TTrackedValues } from 'Controls/display';
import type { ICellPadding } from 'Controls/grid';
import { ITrackedPropertiesItem } from 'Controls/interface';
import { useCollection } from 'Controls/listsCommonLogic';

export interface ITrackedPropertiesContext {
    stickyBlockContextClasses?: string;
    afterContentTemplateContextClasses?: string;
}

export const TrackedPropertiesContext = React.createContext<ITrackedPropertiesContext>({});

/**
 * Интерфейс конфигурации для компонента, отвечающего за вывод отслеживаемых (tracked) значений.
 * @public
 */
export interface ITrackedPropertiesTemplateProps {
    /**
     * Массив объектов, представляющих отслеживаемые свойства.
     * @cfg
     */
    trackedProperties: ITrackedPropertiesItem[];
    /**
     * Заливка заднего фона шаблона.
     * @cfg
     * @default contrast
     * @demo Controls-demo/gridNew/TrackedTemplate/Dev/Index
     */
    backgroundStyle?: 'contrast' | 'transparent';
    /**
     * Выравнивание содержимого.
     */
    contentAlign?: string;
    /**
     * Размер отступов вокруг содержимого.
     * @default default
     */
    paddingSize?: string;
    /**
     * Отступы ячеек.
     */
    cellPadding?: ICellPadding;
    /**
     * Положение шаблона.
     * @cfg
     * @default left
     * @demo Controls-demo/list_new/TrackedProperties/TrackedPropertiesTemplate/Index
     * @see Controls/_interface/ITrackedProperties#trackedPropertiesTemplate
     */
    position?: 'left' | 'right';
    /**
     * Дочерние элементы, которые могут быть переданы в компонент.
     */
    children?: React.ReactNode;
    /**
     * Функция шаблона для отображения содержимого.
     */
    content?: TemplateFunction;
    /**
     * Передаваемые CSS-классы для настройки стилей компонента.
     */
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

export function useWatchTrackedValues(): Record<string, string> {
    const collection = useCollection();
    const [trackedValues, setTrackedValues] = React.useState<TTrackedValues>(
        collection.getTrackedValues()
    );

    React.useEffect(() => {
        const handler = (_event: unknown, newTrackedValues: TTrackedValues) =>
            setTrackedValues(newTrackedValues);
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
    const collection = useCollection();
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

    const checkboxVisibility = useCollection().getMultiSelectVisibility();
    const multiSelectPosition = useCollection().getMultiSelectPosition();
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

    return (
        <Inner
            {...props}
            trackedValues={trackedValues}
            stickyBlockContextClasses={stickyBlockContextClasses}
            afterContentTemplateContextClasses={afterContentTemplateContextClasses}
        />
    );
}

type TInnerProps = ITrackedPropertiesComponentWrapperProps & {
    trackedValues: Record<string, string>;
    stickyBlockContextClasses: string;
    afterContentTemplateContextClasses: string;
};

export function Inner({
    trackedValues,
    stickyBlockContextClasses,
    afterContentTemplateContextClasses,
    ...props
}: TInnerProps) {
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
