/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleRowComponentProps as IItemProps } from 'Controls/_gridRender/cL/row/interface';
import { default as RowComponent } from 'Controls/_gridRender/row/Base';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';
import {
    CollectionItemContext,
    ICollectionItemContextValue,
    helpers,
} from 'Controls/listsCommonLogic';
import { templateLoader } from 'Controls/_gridRender/utils/templateLoader';
import { validate } from 'Controls/_gridRender/utils/compatibleValidator';

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

    const parentProperty = props.parentProperty || props.item?.getOwner?.()?.getParentProperty?.();

    let attrs = { ...props.attrs };
    if (parentProperty && props.item?.contents?.get?.(parentProperty)) {
        attrs = {
            ...attrs,
            'item-parent-key': props.item.contents.get(parentProperty),
        };
    }

    // backgroundColorStyle - приоритетная опция для установки цвета ячеек строки
    const backgroundColorStyle = props.backgroundColorStyle || rowProps.backgroundColorStyle;

    // backgroundStyle - опция для установки цвета только стики элементов строки
    // По умолчанию берёт значение от приоритетной backgroundColorStyle
    const backgroundStyle =
        backgroundColorStyle || props.backgroundStyle || rowProps.backgroundStyle;

    //TODO: Костылюга для https://online.sbis.ru/opendoc.html?guid=33fd30eb-41a5-4273-9b20-4ff81b3faa4d&client=3
    // нужно срочно убрать
    const fix88221034469062 = {};
    if (props.fix88221034469062) {
        fix88221034469062._$checkTemplateValidator = props._$checkTemplateValidator;
    }

    return {
        ...fix88221034469062,
        highlightOnHover: props.highlightOnHover,
        cursor: props.cursor,
        backgroundStyle,
        backgroundColorStyle,
        shadowVisibility: props.shadowVisibility || rowProps.shadowVisibility,
        className,
        contentTemplate: props.contentTemplate,
        itemActionsClass: props.itemActionsClass,
        hoverBackgroundStyle,
        hoverMode,
        href: props.href,
        fontWeight: props.fontWeight,
        fontSize: props.fontSize,
        fontColorStyle: props.fontColorStyle,
        attrs,
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
        // props, заданные на шаблоне ItemTemplate актуальнее, чем rowProps, рассчитанные в гриде.
        actionsClassName: props.itemActionsClass || rowProps.actionsClassName,
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

    const handlers = helpers.events.getItemEventHandlers(props.item, props, true);
    const rowComponentProps =
        rowProps || props.item.getRowComponentProps(handlers, props.actionHandlers);
    rowComponentProps.handlers = {
        ...rowComponentProps.handlers,
        ...handlers,
    };
    if (props['data-qa']) {
        rowComponentProps['data-qa'] = props['data-qa'];
    }
    if (props['data-name']) {
        rowComponentProps['data-name'] = props['data-name'];
    }
    const compatibleRowComponentProps = getCompatibleRowComponentProps(props, rowComponentProps);

    return (
        <RowComponent
            ref={forwardedRef}
            {...rowComponentProps}
            {...compatibleRowComponentProps}
            _$FCC={props._$FCC}
        />
    );
}

function CompatibleGridCollectionItemContextProvider(props: IItemProps) {
    const collectionItemContextValue: ICollectionItemContextValue = React.useMemo(
        () => ({
            item: props.item,
            itemContents: Array.isArray(props.item?.contents)
                ? props.item.contents[props.item.contents.length - 1]
                : props.item?.contents,
        }),
        [props.item, props.item?.contents]
    );

    return (
        <CollectionItemContext.Provider value={collectionItemContextValue}>
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
export const CompatibleGridRowComponent = React.forwardRef(
    (props: IItemProps, ref: React.ForwardedRef<HTMLElement>) => {
        validate(props._$compatibleCallValidator, props._$expectedTemplate, ['GridItemTemplate']);
        const { item } = React.useContext(CollectionItemContext) as ICollectionItemContextValue;
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
