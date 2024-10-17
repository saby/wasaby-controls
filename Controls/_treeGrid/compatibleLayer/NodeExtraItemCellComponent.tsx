import * as React from 'react';
import { IColumnTemplateProps as ICellProps, templateLoader } from 'Controls/grid';
import NodeExtraItemCellComponent, {
    INodeExtraItemCellComponentProps,
} from 'Controls/_treeGrid/cleanRender/cell/NodeExtraItemCellComponent';
import { getNodeExtraItemCellComponentProps } from 'Controls/_treeGrid/cleanRender/cell/utils/NodeExtraItem';
import { HierarchicalLevelPadding } from 'Controls/_treeGrid/cleanRender/HierarchicalLevelPadding';

/**
 * Конвертор опций для совместимости с React-рендером
 * @param props
 */
function getCompatibleNodeExtraItemCellComponentProps(
    props: ICellProps
): INodeExtraItemCellComponentProps {
    const item = props.column?.getOwner();

    const compatibleProps: INodeExtraItemCellComponentProps = {
        ...props,
    };

    if (
        !compatibleProps.backgroundColorStyle &&
        item?.getItemTemplateOptions()?.backgroundColorStyle
    ) {
        compatibleProps.backgroundColorStyle = item?.getItemTemplateOptions()?.backgroundColorStyle;
    }

    delete compatibleProps.contentTemplate;
    delete compatibleProps.className;
    delete compatibleProps.attrs;
    delete compatibleProps.style;

    return compatibleProps;
}

function getContentRender(props: ICellProps, preparedProps: INodeExtraItemCellComponentProps) {
    const contentRenderProps = { ...preparedProps };
    delete contentRenderProps['data-qa'];

    if (props.contentTemplate) {
        return templateLoader(props.contentTemplate, contentRenderProps);
    }

    // Загружаем контент только тогда, когда это реально content из wasaby шаблона
    if (props.content && !props.content.isChildrenAsContent) {
        return templateLoader(props.content, contentRenderProps);
    }

    return null;
}

/**
 * Wasaby-совместимая обёртка над шаблоном ячейки шапки или подвала развёрнутого узла.
 * @param props
 * @constructor
 */
export const CompatibleNodeExtraItemCellComponent = React.memo(
    React.forwardRef(function CompatibleNodeExtraItemCellComponent(
        props: ICellProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement {
        const { column } = props;

        const cellProps = getNodeExtraItemCellComponentProps({
            cell: column,
            row: column.getOwner(),
            rowProps: props
        });

        const preparedProps = getCompatibleNodeExtraItemCellComponentProps(props, cellProps);

        return (
            <NodeExtraItemCellComponent
                contentRender={getContentRender(props, preparedProps) as React.ReactElement}
                beforeContentRender={
                    <HierarchicalLevelPadding
                        cell={column}
                        withoutLevelPadding={props.withoutLevelPadding}
                        withoutExpanderPadding={props.withoutExpanderPadding}
                        levelIndentSize={props.withoutExpanderPadding}
                        expanderIcon={props.expanderIcon}
                        expanderSize={props.expanderSize}
                    />
                }
                ref={ref}
                {...preparedProps}
            />
        );
    })
);
