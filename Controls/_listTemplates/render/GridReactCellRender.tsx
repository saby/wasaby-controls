import * as React from 'react';
import { ITableCellTemplateOptions } from '../interface/ITableCellTemplate';
import { IColumnTemplateProps } from 'Controls/grid';
import { useRenderData } from 'Controls/gridReact';
import { TreeGridDataRow as CollectionItem } from 'Controls/treeGrid';
import CleanGridCell from './CleanGridCell';

interface GridReactCellRenderProps extends ITableCellTemplateOptions, IColumnTemplateProps {
    src: string;
    item: CollectionItem;
    fallbackImage: string;
    nodeProperty: string;
}

const GridReactCellRender = React.memo(function (props: GridReactCellRenderProps): React.ReactElement {
    const { renderValues } = useRenderData([props.nodeProperty, props.imageProperty]);
    return (
        <CleanGridCell
            {...props}
            isNode={renderValues[props.nodeProperty]}
            imageSrc={renderValues[props.imageProperty]}
        />
    );
});
GridReactCellRender.defaultProps = {
    nodeProperty: 'type'
};
export default GridReactCellRender;
