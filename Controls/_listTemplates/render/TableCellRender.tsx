import * as React from 'react';
import { ITableCellTemplateOptions } from '../interface/ITableCellTemplate';
import { ColumnTemplate, IColumnTemplateProps } from 'Controls/grid';
import { TreeGridDataRow as CollectionItem } from 'Controls/treeGrid';
import CleanGridCell from './CleanGridCell';

interface ITableCellRenderProps extends ITableCellTemplateOptions, IColumnTemplateProps {
    item: CollectionItem;
    fallbackImage?: string;
}

const Content = React.memo(function ListTemplatesTableCellRenderContent(props) {
    return (
        <CleanGridCell
            {...props}
            isNode={props.item.isNode()}
            imageSrc={props.item.contents.get(props.imageProperty)}
        />
    );
});

const TableCellRender = React.memo(function ListTemplatesTableCellRender(
    props: ITableCellRenderProps
): React.ReactElement {
    return <ColumnTemplate {...props} contentTemplate={<Content {...props} />}></ColumnTemplate>;
});

export default TableCellRender;
