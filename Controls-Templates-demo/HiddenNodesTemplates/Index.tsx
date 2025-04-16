import { forwardRef, ForwardRefRenderFunction, ForwardedRef } from 'react';
import { View as TreeGridView } from 'Controls/treeGrid';
import { gridData } from 'Controls-Templates-demo/HiddenNodesTemplates/DataHelpers/HiddenNodesData';
import { IComponentProps } from 'Controls/interface';

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
    colspanCallback: (item, column) => {
        const isMoreThenOne = item.get('Prices')?.length > 1;
        const isExpanded = item.get('isExpandedFlag');

        if (isMoreThenOne && column.displayProperty === 'title' && !isExpanded) {
            return 2;
        }
    },
};

const CertificateGridTemplate: ForwardRefRenderFunction<
    any,
    IComponentProps
    // eslint-disable-next-line react/function-component-definition
> = (props: IComponentProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <TreeGridView {...GRID_PROPS} ref={ref} />;
};

export default forwardRef(CertificateGridTemplate);
