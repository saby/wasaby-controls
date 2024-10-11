/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleRowComponentProps as IItemProps } from 'Controls/_grid/compatibleLayer/row/interface';
import { default as RowComponent } from 'Controls/_grid/gridReact/row/RowComponent';
import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';
import { getItemEventHandlers, CollectionItemContext } from 'Controls/baseList';
import { default as GroupCellComponent } from 'Controls/_grid/dirtyRender/group/GroupCellComponent';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';

/*
 * Функция возвращает пропсы, с которыми создаётся компонент Wasaby-совместимый компонент строки таблицы.
 * @private
 */
export function getCompatibleGridRowComponentProps(
    props: IItemProps,
    rowProps: IRowComponentProps
): IRowComponentProps {
    const beforeContentRender = props.beforeColumnContentTemplate
        ? templateLoader(props.beforeColumnContentTemplate, {
              ...props,
              key: 'beforeContentRender',
          })
        : null;
    const afterContentRender = props.afterColumnContentTemplate
        ? templateLoader(props.afterColumnContentTemplate, { ...props, key: 'afterContentRender' })
        : null;
    // Важнее всего то, что выставил приклданик,
    // На втором месте то, что было расчитано на уровне getRowComponentProps.
    // Но если там было null, то проверим ещё props.highlightOnHover
    const defaultHoverBackground = props.highlightOnHover ? 'default' : 'none';
    // Некоторые прикладники подсвечивают всю строку, а редактируют поячеечно.
    const hoverBackgroundStyle =
        props.hoverBackgroundStyle ||
        (rowProps.hoverBackgroundStyle !== 'none'
            ? rowProps.hoverBackgroundStyle
            : defaultHoverBackground);
    const editingConfig = props.item.getEditingConfig();
    const hoverMode =
        hoverBackgroundStyle === 'none' && editingConfig?.mode ? editingConfig.mode : 'row';

    let className = props.className
        ? `${props.className} ${rowProps.className} `
        : rowProps.className;

    if (props.cursor) {
        className += ` tw-cursor-${props.cursor}`;
    }

    return {
        highlightOnHover: props.highlightOnHover,
        cursor: props.cursor,
        backgroundStyle:
            props.backgroundColorStyle ||
            props.backgroundStyle ||
            rowProps.backgroundColorStyle ||
            rowProps.backgroundStyle,
        className,
        contentTemplate: props.contentTemplate,
        itemActionsClass: props.itemActionsClass,
        hoverBackgroundStyle,
        hoverMode,
        href: props.href,
        fontWeight: props.fontWeight,
        fontSize: props.fontSize,
        fontColorStyle: props.fontColorStyle,
        attrs: props.attrs,
        cCountStart: props.cCountStart,
        cCountEnd: props.cCountEnd,
        groupProperty: props.groupProperty,
        itemsContainerPadding: props.itemsContainerPadding,
        showItemActionsOnHover: props.showItemActionsOnHover,
        markerVisible: props.marker, // Опция marker: boolean используется в панели фильтра
        markerPosition: props.markerPosition,
        markerSize: props.markerSize,
        beforeContentRender,
        afterContentRender,
    };
}

interface ICompatibleRowComponentPropsConverterProps extends IItemProps {
    getCompatibleRowComponentProps: (
        props: IItemProps,
        rowProps: IRowComponentProps
    ) => Partial<IRowComponentProps>;
}

/*
 * Компонент, позволяющий отрендерить wasaby-совместимый шаблон строки грида.
 * @private
 */
export function CompatibleRowComponentPropsConverter(
    props: ICompatibleRowComponentPropsConverterProps
): React.ReactElement {
    const { rowProps, getCompatibleRowComponentProps, forwardedRef } = props;

    // TODO перенести в treeGrid
    // Кейс актуален, в том числе, при *** nodeTypeProperty +**, т.к. там
    //  в некоторых случаях могут передавать через itemTemplate опции
    //   highlightOnHover, fontColorStyle, fontSize, fontWeight, общие для всех ячеек строки
    const _$FunctionalCellComponent = props.item['[Controls/treeGrid:TreeGridGroupDataRow]']
        ? GroupCellComponent
        : props._$FunctionalCellComponent;

    const handlers = getItemEventHandlers(props.item, props, true);
    const rowComponentProps =
        rowProps || props.item.getRowComponentProps(handlers, props.actionHandlers);
    rowComponentProps.handlers = {
        ...rowComponentProps.handlers,
        ...handlers,
    };
    if (props['data-qa']) {
        rowComponentProps['data-qa'] = props['data-qa'];
    }
    const compatibleRowComponentProps = getCompatibleRowComponentProps(props, rowComponentProps);

    return (
        <RowComponent
            ref={forwardedRef}
            {...rowComponentProps}
            {...compatibleRowComponentProps}
            _$FunctionalCellComponent={_$FunctionalCellComponent}
        />
    );
}

function CompatibleGridCollectionItemContextProvider(props: IItemProps) {
    return (
        <CollectionItemContext.Provider value={props.item}>
            <CompatibleRowComponentPropsConverter
                {...props}
                forwardedRef={props.ref}
                getCompatibleRowComponentProps={getCompatibleGridRowComponentProps}
            />
        </CollectionItemContext.Provider>
    );
}

/*
 * Wasaby-совместимый компонент строки таблицы.
 * Вставляется прикладником в опцию itemTemplate.
 * @param props
 */
const CompatibleGridRowComponentForwardRef = React.forwardRef(
    (props: IItemProps, ref: React.ForwardedRef<HTMLElement>) => {
        const item = React.useContext(CollectionItemContext);
        if (!item && props.item) {
            return <CompatibleGridCollectionItemContextProvider {...props} forwardedRef={ref} />;
        }
        return (
            <CompatibleRowComponentPropsConverter
                {...props}
                forwardedRef={ref}
                getCompatibleRowComponentProps={getCompatibleGridRowComponentProps}
            />
        );
    }
);

CompatibleGridRowComponentForwardRef.displayName = 'CompatibleGridRowComponentForwardRef';

export const CompatibleGridRowComponent = React.memo(CompatibleGridRowComponentForwardRef);

CompatibleGridRowComponent.displayName = 'CompatibleGridRowComponentMemo';
