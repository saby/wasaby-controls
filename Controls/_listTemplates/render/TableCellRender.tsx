import * as React from 'react';
import { ITableCellTemplateOptions } from '../interface/ITableCellTemplate';
import { ColumnTemplate, IColumnTemplateProps } from 'Controls/grid';
import { TreeGridDataRow as CollectionItem } from 'Controls/treeGrid';
import CleanGridCell from './CleanGridCell';

interface TableCellRenderProps extends ITableCellTemplateOptions, IColumnTemplateProps {
    src: string;
    item: CollectionItem;
    fallbackImage: string;
}

const Content = React.memo((props) => (
    <CleanGridCell
        {...props}
        isNode={props.item.isNode()}
        imageSrc={props.item.contents.get(props.imageProperty)}
    />
));

const TableCellRender = React.memo(function (props: TableCellRenderProps): React.ReactElement {
    return (
        <ColumnTemplate
            {...props}
            contentTemplate={<Content {...props}/>}
        ></ColumnTemplate>
    );
});

export default TableCellRender;
