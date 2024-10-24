import * as React from 'react';
import type { Record } from 'Types/entity';
import type BreadcrumbsItemCell from '../display/BreadcrumbsItemCell';
import {
    CompatibleCellComponentPropsConverter,
    getCompatibleGridCellComponentProps,
    getCompatibleCellContentRender as getGridCompatibleCellComponentRender,
    IColumnTemplateProps,
    ICellComponentProps,
    ICompatibleCellComponentPropsConverterProps,
} from 'Controls/grid';
import {
    default as SearchBreadcrumbsCellComponent,
    ISearchBreadcrumbsCellComponentProps,
} from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchBreadcrumbsCellComponent';
import { getSearchBreadcrumbsProps } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/utils/SearchBreadcrumbs';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';

export interface IItemTemplateProps {
    gridColumn: BreadcrumbsItemCell;
    _onBreadcrumbItemClick: (event: Event, item: Record) => void;
    className?: string;
}

/**
 * Пропсы ячейки хлебных крошек и её рендера
 * @param props
 */
function getCompatibleSearchBreadcrumbsCellComponentProps(
    props: IColumnTemplateProps
): ISearchBreadcrumbsCellComponentProps {
    const cellComponentProps = getCompatibleGridCellComponentProps(props);

    const searchBreadcrumbsProps = getSearchBreadcrumbsProps({
        cell: props.column as unknown as BreadcrumbsItemCell,
        row: props.column.getOwner() as unknown as BreadcrumbsItemRow,
        rowProps: props,
    });

    return {
        ...cellComponentProps,
        ...searchBreadcrumbsProps,
        fixedBackgroundStyle:
            cellComponentProps.fixedBackgroundStyle ||
            cellComponentProps.backgroundColorStyle ||
            searchBreadcrumbsProps.fixedBackgroundStyle,
        contentTemplate: props.contentTemplate,
        content: props.content,
    };
}

/**
 * Рендер крнтента хлебных крошек
 * @param props
 * @param compatibleContentRenderProps
 */
function getCompatibleCellContentRender(
    props: ICompatibleCellComponentPropsConverterProps<ICellComponentProps>,
    compatibleContentRenderProps: Partial<ICellComponentProps>
) {
    const isValidReactChildren =
        props.children && (props.children.length || (props.children.type && !props.content));
    const isValidWasabyContent = props.content && !props.content.isChildrenAsContent;

    // Для хлебных крошек рендер по умолчанию уже находится в чистом компоненте,
    // и возвращать туда при отсутствии прикладного шаблона рендер обычной ячейки не надо.
    if (!props.contentTemplate && !isValidReactChildren && !isValidWasabyContent) {
        return null;
    }
    return getGridCompatibleCellComponentRender(props, compatibleContentRenderProps);
}

/**
 * Wasaby-совместимая обёртка над ячейкой с хлебными крошками.
 */
export default React.forwardRef(function CompatibleSearchBreadcrumbsCellComponent(
    props: IItemTemplateProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const column = props.column || props.gridColumn || props.colData || props.itemData;

    return (
        <CompatibleCellComponentPropsConverter
            {...props}
            column={column}
            ref={ref}
            _$FunctionalCellComponent={SearchBreadcrumbsCellComponent}
            getCompatibleCellContentRender={getCompatibleCellContentRender}
            getCompatibleCellComponentProps={getCompatibleSearchBreadcrumbsCellComponentProps}
        />
    );
});

/**
 * Шаблон отображения элемента с хлебными крошками по умолчанию. Не имеет настраиваемых опций, может быть встроен в пользовательский шаблон. см {@link Controls/_explorer/interface/IExplorer#searchBreadCrumbsItemTemplate Иерархический проводник}
 * @class Controls/_searchBreadcrumbsGrid/render/ItemTemplate
 * @public
 */
