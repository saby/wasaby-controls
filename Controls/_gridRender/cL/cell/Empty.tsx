/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { RecordSet } from 'Types/collection';
import { IHashMap } from 'Types/declarations';
import type { GridEmptyCell, GridEmptyRow } from 'Controls/gridDisplay';
import { TGridHPaddingSize, TGridVPaddingSize } from 'Controls/interface';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_gridRender/cL/cell/interface';
import { CCCPC } from 'Controls/_gridRender/cL/cell/Data';
import { prepareCommonCompatibleProps, filterCommonCompatibleProps } from '../utils/common';
import { IBaseCellComponentProps } from 'Controls/_gridRender/cell/Base';
import { getEmptyContentRenderClasses } from 'Controls/_gridRender/cell/utils/Classes/Empty';
import { validate } from 'Controls/_gridRender/utils/compatibleValidator';

export interface ICompatibleEmptyCellComponentProps
    extends IBaseCellComponentProps,
        TInternalProps {
    item: GridEmptyRow;
    itemData: GridEmptyRow;
    colData: GridEmptyRow;

    gridColumn: GridEmptyCell;
    emptyViewColumn: GridEmptyCell;

    contentTemplate: React.Component | React.FunctionComponent;
    content: React.Component | React.FunctionComponent;
    className?: string;

    topSpacing: string;
    bottomSpacing: string;
    align: 'center' | 'start' | 'end';

    paddingLeft: TGridHPaddingSize;
    paddingRight: TGridHPaddingSize;
    paddingTop: TGridVPaddingSize;
    paddingBottom: TGridVPaddingSize;

    items: RecordSet;
    filter: IHashMap<unknown>;
}

/**
 * Компонент рендера пустой ячейки, совместимый с wasaby синтаксисом.
 * Исторически приклидной шаблон Controls/grid:EmptyTemplate использовали неправильно.
 * В итоге оказывается, что прикладному разработчику нужны какие-то наши CSS классы,
 * Но это совсем не то, что задаёт вокруг contentRender наш честный EmptyCellComponent.
 */
export const CompatibleEmptyCellComponentRender = React.forwardRef(function EmptyContentRender(
    props: ICompatibleEmptyCellComponentProps,
    ref: React.ForwardedRef<HTMLElement>
) {
    if (!props.contentRender) {
        return null;
    }

    const cellModel = props.gridColumn || props.emptyViewColumn;
    const emptyRowModel = props.item || props.itemData || props.colData;

    // Прикладной рендер
    const contentRender = createElement(props.contentRender, {
        column: cellModel,
        emptyViewColumn: cellModel,
        ...emptyRowModel?.getItemTemplateOptions?.(),
        item: emptyRowModel,
        items: props.items,
        filter: props.filter,
    });

    // Классы платформенной обёртки
    const innerClassName = getEmptyContentRenderClasses({
        isSingleCell: cellModel?.isSingleColspanedCell && !!emptyRowModel?.getRowTemplate(),
        halign: props.align,
        paddingTop: props.topSpacing,
        paddingBottom: props.bottomSpacing,
        paddingLeft: emptyRowModel?.getLeftPadding?.(),
        paddingRight: emptyRowModel?.getRightPadding?.(),
    });

    // TODO props.fromTemplate это какой-то прикладной костыль, отключающий наш div с классом.
    //  Вообще не ясно, зачем тогда используется Controls/grid:EmptyTemplate
    return props.fromTemplate ? (
        contentRender
    ) : (
        <div className={innerClassName} ref={ref}>
            {contentRender}
        </div>
    );
});

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки пустого представления.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleEmptyCellComponentProps(props: ICellProps) {
    const compatibleProps = prepareCommonCompatibleProps(props);
    return filterCommonCompatibleProps(compatibleProps);
}

/*
 * Wasaby-совместимый компонент ячейки пустого представления.
 * Вставляется прикладником в опцию emptyTemplate.
 * @param props
 */
export const CompatibleEmptyCellComponent = React.forwardRef(
    (props: ICellProps, ref: React.ForwardedRef<HTMLElement>) => {
        validate(props._$compatibleCallValidator, props._$expectedTemplate, [
            'EmptyTemplate',
            'EmptyColumnTemplate',
        ]);
        return (
            <CCCPC
                {...props}
                ref={ref}
                getCCCP={getCompatibleEmptyCellComponentProps}
                _$FCC={CompatibleEmptyCellComponentRender as React.FunctionComponent}
            />
        );
    }
);
