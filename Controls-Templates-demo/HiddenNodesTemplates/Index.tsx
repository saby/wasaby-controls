import { forwardRef, ForwardRefRenderFunction, ForwardedRef } from 'react';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IControlOptions } from 'UI/Base';
import { gridData } from 'Controls-Templates-demo/HiddenNodesTemplates/DataHelpers/HiddenNodesData';

const source = gridData.getData();
const columns = gridData.getColumns();
const header = gridData.getHeader();
const itemActions = gridData.getItemActions();

const GRID_PROPS: object = {
    source,
    columns,
    header,
    itemActions,
    keyProperty: 'key',
    parentProperty: 'parent',
    nodeProperty: 'type',
    itemActionsClass: 'controls-itemActionsV_position_topRight',
    feature1187930642: true,
    colspanCallback: (item, column) => {
        const isMoreThenOne = item.get('Prices')?.length > 1;
        const isExpanded = item.get('isExpandedFlag');

        if (
            isMoreThenOne &&
            column.displayProperty === 'title' &&
            !isExpanded
        ) {
            return 2;
        }
    },
};

const CertificateGridTemplate: ForwardRefRenderFunction<
    any,
    IControlOptions
    // eslint-disable-next-line react/function-component-definition
> = (props: IControlOptions, ref: ForwardedRef<HTMLDivElement>) => {
    return <TreeGridView {...GRID_PROPS} ref={ref} />;
};

export default forwardRef(CertificateGridTemplate);
