/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import {
    ICompatibleCellComponentProps,
    ICompatibleCellComponentPropsConverterProps,
} from './cell/interface';
import { default as DefaultCellComponent } from 'Controls/_grid/dirtyRender/cell/CellComponent';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
import { getItemActionsTemplate as getItemActionsTemplateBase } from 'Controls/baseList';
import { EditArrowComponent, IEditArrowProps } from 'Controls/listVisualAspects';
import { Logger } from 'UI/Utils';
import { DefaultCellContentRender } from 'Controls/_grid/cleanRender/cell/contentRenders/DefaultContentRender';
import { HighlightedContentRender } from 'Controls/_grid/cleanRender/cell/contentRenders/HighlightedContentRender';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { CursorUtils } from 'Controls/baseGrid';
import { shouldDisplayEditArrow } from 'Controls/_grid/cleanRender/cell/utils/Props/EditArrow';

export function validateProps(props: ICompatibleCellComponentProps) {
    if (props.column === undefined) {
        Logger.warn(
            'Controls/grid. В шаблон "Controls/grid:ColumnTemplate" не передана область видимости ("scope"). ' +
                'Полноценный рендер невозможен, см. https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/columns/template/from-wml/'
        );
    }
}

/*
 * Функция возвращает компонент "Шеврон редактирования".
 * Этот компонент передаётся в опциях wasaby-совместимого шаблона прикладнику и доступен как
 * contentTemplate.editArrowTemplate
 * @private
 * @param column
 * @param editable
 * @param highlightOnHover
 * @param hoverBackgroundStyle
 * @param textOverflow
 * @param showEditArrowByDefault показываем шеврон рпедактирования по умолчанию - рендер в CellComponent
 */
function getEditArrowTemplate({
    column,
    editable,
    highlightOnHover,
    hoverBackgroundStyle,
    showEditArrowByDefault,
}: {
    column: ICompatibleCellComponentProps['column'];
    highlightOnHover: ICompatibleCellComponentProps['highlightOnHover'];
    hoverBackgroundStyle: ICompatibleCellComponentProps['hoverBackgroundStyle'];
    editable: ICompatibleCellComponentProps['editable'];
    showEditArrowByDefault: ICompatibleCellComponentProps['showEditArrow'];
}): React.ForwardRefExoticComponent<
    React.PropsWithoutRef<IEditArrowProps> & React.RefAttributes<HTMLDivElement>
> | null {
    if (showEditArrowByDefault) {
        return null;
    }

    return React.forwardRef(function FREditArrowComponent(
        customProps: IEditArrowProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement | null {
        const shouldDisplay = shouldDisplayEditArrow({ cell: column, row: column.getOwner() });
        if (!shouldDisplay) {
            return null;
        }
        // editArrowBackgroundStyle существует только для совместимости wasaby.
        // такими опциями обходили тот факт, что wasaby пробрасывает все опции насквозь.
        const backgroundStyle = column.getEditArrowBackgroundStyle(
            customProps.backgroundStyle || customProps.editArrowBackgroundStyle,
            highlightOnHover,
            hoverBackgroundStyle,
            editable
        );
        const textOverflow = customProps.textOverflow;
        return (
            <EditArrowComponent
                ref={ref}
                textOverflow={textOverflow}
                backgroundStyle={backgroundStyle}
                key={'edit-arrow'}
            />
        );
    });
}

/*
 * Функция возвращает пропсы, с которыми создаётся Wasaby-совместимый компонент ячейки.
 * @private
 * @param props
 */
export function getCompatibleGridCellComponentProps(
    props: ICompatibleCellComponentProps & ICellComponentProps
): Partial<ICellComponentProps> {
    validateProps(props);

    const { column } = props;

    //TODO: В некоторых шаблонах прикладники передают itemData вместо item
    const item = props.item || props.itemData;

    const backgroundStyle = props.backgroundColorStyle
        ? props.backgroundColorStyle
        : props.backgroundStyle;

    let highlightOnHover = props.highlightOnHover !== undefined ? props.highlightOnHover : true;
    let hoverBackgroundStyle = props.hoverBackgroundStyle || 'default';
    // Для режима совместимости getCellEditorProps вызывается дважды.
    // Первый раз без учёта прикладных опций на шаблоне ячейки,
    // поэтому тут сбрасываем значения, которые были расчитаны раньше.
    if (
        props.hoverMode !== 'row' &&
        ['list_singleCellEditable', 'list_singleCellNotEditable'].includes(hoverBackgroundStyle)
    ) {
        hoverBackgroundStyle = 'none';
        highlightOnHover = false;
    }

    // Добавляем классы, позволяющие выстроить каскад от типа записи.
    // В совместимом гриде по-другому не работает увеличенный размер
    // шрифта при редактировании нод.
    const className = (props.className || '') + (props?.attrs?.className || '') + column.getRecordTypeClasses();

    const columnScrollProps = getColumnScrollProps({
        cell: column,
        row: column.getOwner(),
    });

    // Курсор зависит от наличия скролла.
    // Но если прикладник при помощи класса js-controls-DragScroll__notDraggable отключил скролл на колонке,
    // То курсоры не меняем.
    const isScrollable =
        columnScrollProps.hasColumnScroll &&
        !columnScrollProps.columnScrollIsFixedCell &&
        className.indexOf('js-controls-DragScroll__notDraggable') === -1;
    const cursor = CursorUtils.getCursor(props.cursor, isScrollable, 'pointer');

    const cellEditorProps = column.getCellEditorProps({
        borderMode: props.borderMode,
        editing: props.editing,
        editable: props.editable,
        backgroundStyle,
        stickiedBackgroundStyle: backgroundStyle,
        hoverBackgroundStyle,
        borderVisibility: props.borderVisibility,
        borderStyle: props.borderStyle,
        className,
        hoverMode: props.hoverMode,
    });

    // Если рендерим через прикладной шаблон contentTemplate - не рендерим editArrow на уровне платформенной ячейки, т.к.
    // прикладной шаблон может выводить его самостоятельно и будут две стрелки (такое поведение было изначально).
    const showEditArrowByDefault =
        !props.contentTemplate && shouldDisplayEditArrow({ cell: column, row: item });

    const compatibleProps: ICompatibleCellComponentProps = {
        ...props,
        gridColumn: column,
        itemData: column,
        colData: column,

        // background, border, editing, editable etc
        ...cellEditorProps,

        // Дополнительно пробрасывается LadderWrapperRef в scope самого шаблона в CompatibleCellComponentResolver
        ladderWrapper: props.ladderWrapper || 'Controls/grid:LadderWrapper',
        stickyProperty: props.stickyProperty || column?.config?.stickyProperty,
        itemPadding: item.getItemPadding?.(),
        // multiSelectTemplate: props.multiSelectTemplate,

        showEditArrow: showEditArrowByDefault,

        content: null,
        cursor,
    };

    // TODO убрать useMemo тут, это не легально с точки зрения eslint
    // Передаем в рендер ячейки editArrowTemplate (его могут вставлять вручную, в прикладном шаблоне контента)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    compatibleProps.editArrowTemplate = React.useMemo(() => {
        return getEditArrowTemplate({
            column: props.column,
            editable: props.editable,
            highlightOnHover,
            hoverBackgroundStyle,
            showEditArrowByDefault,
        });
    }, [props.column, props.editable, highlightOnHover, hoverBackgroundStyle, props.textOverflow]);

    const itemActionsComponentProps = { ...compatibleProps, ...props.actionHandlers };
    itemActionsComponentProps.itemActionsClass =
        itemActionsComponentProps.actionsClassName || itemActionsComponentProps.itemActionsClass;
    // TODO убрать useMemo тут, это не легально с точки зрения eslint
    // eslint-disable-next-line react-hooks/rules-of-hooks
    compatibleProps.itemActionsTemplate = React.useMemo(() => {
        return getItemActionsTemplateBase(itemActionsComponentProps);
    }, [
        props.item,
        itemActionsComponentProps.itemActionsTemplateMountedCallback,
        itemActionsComponentProps.itemActionsTemplateUnmountedCallback,
        itemActionsComponentProps.itemActionsClass,
        itemActionsComponentProps.actionsVisibility,
        highlightOnHover,
        hoverBackgroundStyle,
    ]);

    delete compatibleProps.resolvedTemplate;
    delete compatibleProps.contentTemplate;
    delete compatibleProps.contentTemplateOptions;
    delete compatibleProps.contentRender;
    delete compatibleProps.children;
    // delete compatibleProps.content;
    delete compatibleProps.attrs;
    delete compatibleProps.style;
    delete compatibleProps.getCompatibleCellComponentProps;
    delete compatibleProps._$FunctionalCellComponent;
    delete compatibleProps.compatibleMultiSelectTemplate;

    return compatibleProps;
}

/*
 * Функция возвращает пропсы, с которыми создаётся рендер внутри компонента ячейки.
 * @private
 * @param compatibleCellComponentProps
 * @param templateOptions
 */
function getCompatibleCellContentRenderProps(
    compatibleCellComponentProps: Partial<ICellComponentProps>,
    templateOptions: Partial<ICellComponentProps>
) {
    const compatibleProps = {
        ...compatibleCellComponentProps,
        ...templateOptions?.contentTemplateOptions,
        className: '',
    };

    delete compatibleProps.fontSize;
    delete compatibleProps.fontWeight;
    delete compatibleProps.borderVisibility;
    delete compatibleProps.backgroundStyle;
    delete compatibleProps.textOverflow;
    delete compatibleProps.content;
    delete compatibleProps['data-qa'];
    delete compatibleProps.dataQa;

    return compatibleProps;
}

/*
 * Функция возвращает компонент рендера для вставки в компонент ячейки.
 * @private
 * @param props
 * @param compatibleContentRenderProps
 */
export function getCompatibleCellContentRender(
    props: ICompatibleCellComponentPropsConverterProps<ICellComponentProps>,
    compatibleContentRenderProps: Partial<ICellComponentProps>
): React.ReactNode | null {
    const { column } = props;

    // Пустая ячейка для лесенки
    if (compatibleContentRenderProps.hideContentRender) {
        return null;
    }

    // У spacing нет никакого контента
    if (column?.['[Controls/_display/grid/SpaceCell]']) {
        return null;
    }
    if (props.contentTemplate) {
        return templateLoader(props.contentTemplate, compatibleContentRenderProps);
    }

    /* 1. props.children instanceof Array && props.children.length - это проверка на кейс, когда в wml вызвали
          Controls/grid:ColumnTemplate, но не передали в него контентную опцию (content|contentTemplate). В таком
          случае wasaby-движок установит children пустым массивом. Использовать же нужно рендер по-умолчанию.
          кейс на этой демке: DemoStand/app/Configuration-demo/AppSettings/Index */
    /* 2. Просто так React.isValidElement(props.children) проверять нельзя, т.к. props.children создается wasaby-движком
          в случаях, когда не передана контентная опция и, т.к. props.children является настоящим react-element, то в
          дефолтный рендер мы не попадаем никогда. */
    /* 3. Могут вставить в tsx Controls/grid:ColumnTemplate и передать в него верстку в children, а не опцию content|contentTemplate.
          Тодга children может быть объектом ReactElement а не массивом */
    if (props.children && (props.children.length || (props.children.type && !props.content))) {
        return props.children;
    }

    if (props.content && !props.content.isChildrenAsContent) {
        return templateLoader(props.content, compatibleContentRenderProps);
    }

    // TODO код группы очень размазан, на отладку может уходить много времени.
    // В некоторых случаях props не содержит всех необходимых опций и нас спасает только compatibleCellComponentProps.
    // Например, в прикладном коде при вставке Controls/dropdown:Button может использоваться шаблон Controls/dropdown:GroupTemplate.
    // Тогда Controls/menu:Controller передаст в него ТОЛЬКО itemData, item и className,
    // в результате в props будет какой-то ограниченный набор пропсов.
    if (
        column?.['[Controls/_display/grid/GroupCell]'] &&
        (props.textRender || compatibleContentRenderProps.textRender)
    ) {
        return props.textRender || compatibleContentRenderProps.textRender;
    }

    if (column?.['[Controls/_display/grid/DataCell]']) {
        if (
            column.getHighlightedValue().length &&
            column.getDisplayValue() &&
            column.config?.displayTypeOptions?.searchHighlight !== false
        ) {
            return (
                <HighlightedContentRender
                    displayProperty={column.getDisplayProperty()}
                    textOverflow={props.textOverflow}
                    highlightedValue={column.getHighlightedValue()}
                    showEditArrow={props.showEditArrow}
                />
            );
        }

        return (
            <DefaultCellContentRender
                displayProperty={column.getDisplayProperty()}
                textOverflow={column.getTextOverflow()}
            />
        );
    }

    return null;
}

/*
 * Общий компонент, позволяющий отрендерить wasaby-совместимый шаблон какой-либо ячейки грида.
 * @private
 */
export const CompatibleCellComponentPropsConverter = React.forwardRef(
    function CompatibleCellComponentPropsConverter(
        props: ICompatibleCellComponentPropsConverterProps<ICellComponentProps>,
        ref: React.ForwardedRef<HTMLElement>
    ) {
        const { getCompatibleCellComponentProps } = props;
        const FunctionalCellComponent = props._$FunctionalCellComponent || DefaultCellComponent;

        const compatibleCellComponentProps = getCompatibleCellComponentProps(props);

        const compatibleContentRenderComponentProps = getCompatibleCellContentRenderProps(
            compatibleCellComponentProps,
            props?.templateOptions
        );

        const getCellContentRender =
            props.getCompatibleCellContentRender || getCompatibleCellContentRender;
        const contentRender = getCellContentRender(props, compatibleContentRenderComponentProps);

        return (
            <FunctionalCellComponent
                ref={ref}
                // После перевода ВСЕХ компонентов ячеек на наследника BaseCellComponent - опцию "render" нужно удалить,
                // новое название опции "contentRender", т.к. такое название более точно описывает назначение опции.
                render={contentRender}
                contentRender={contentRender}
                style={props.style}
                {...compatibleCellComponentProps}
            />
        );
    }
);

const CompatibleGridCellComponentForwardRef = React.forwardRef(function CompatibleGridCellComponent(
    props: ICompatibleCellComponentProps,
    ref: React.ForwardedRef<HTMLElement>
) {
    return (
        <CompatibleCellComponentPropsConverter
            {...props}
            ref={ref}
            getCompatibleCellComponentProps={getCompatibleGridCellComponentProps}
        />
    );
});

export const CompatibleGridCellComponent = React.memo(CompatibleGridCellComponentForwardRef);
