/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */

/**
 * Библиотека "Обзорное дерево". Предоставляет компоненты для отображения иерархических данных реестра в виде плоского списка, с выделением иерархии с помощью размера и жирности шрифта.
 * - {@link Controls-Lists/overviewTree:ConnectedComponent Контрол "Обзорное дерево"}
 * @includes ConnectedComponent Controls-Lists/overviewTree:ConnectedComponent
 * @library
 * @demo Controls-Lists-demo/overviewTree/Base/Index
 * @public
 */

import { IOverviewTreeConnectedComponentProps } from 'Controls-Lists/_overviewTree/interface/IOverviewTreeConnectedComponentProps';
import * as React from 'react';
import { View as TreeGrid } from 'Controls/treeGrid';
import { useRowPropsProcessor } from 'Controls-Lists/_overviewTree/hooks/useRowPropsProcessor';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { getBreadCrumbs } from 'Controls-Lists/_overviewTree/utils/getBreadCrumbs';
import { BreadCrumbs } from 'Controls-Lists/_overviewTree/render/BreadCrumbs/BreadCrumbs';
import 'css!Controls-Lists/overviewTree';
import type { TKey } from 'Controls-DataEnv/interface';
import { Logger } from 'UI/Utils';
import { Model } from 'Types/entity';

export { IOverviewTreeConnectedComponentProps };

const VIRTUAL_SCROLL_FIXED_LINE = { feature1183225611: true };

function ConnectedComponentRef(props: IOverviewTreeConnectedComponentProps): React.ReactElement {
    const { storeId, getRowProps, columns, ...restProps } = props;
    const slice = useSlice<ListSlice>(storeId);

    const [activeElement, setActiveElement] = React.useState<TKey>(
        slice?.state.items?.at(0).getKey() || null
    );

    const getModifiedRowProps = useRowPropsProcessor(slice, getRowProps);

    const defaultColumns = React.useMemo(
        () => [
            {
                displayProperty: slice?.state.displayProperty,
                key: 'defaultColumn',
            },
        ],
        [slice?.state.displayProperty]
    );

    const header = React.useMemo(() => {
        if (
            !slice ||
            !slice.state.parentProperty ||
            !slice.state.nodeProperty ||
            !slice.state.displayProperty
        ) {
            Logger.error('В слайсе не задан nodeProperty или parentProperty или displayProperty');
            return;
        }

        const breadCrumbs = getBreadCrumbs(slice, activeElement, slice.state.root);

        return [
            {
                render: <BreadCrumbs slice={slice} breadCrumbs={breadCrumbs} />,
                isBreadCrumbs: true,
                startColumn: 1,
                endColumn: -1,
            },
        ];
    }, [activeElement, slice]);

    const handleActiveElementChange = React.useCallback(
        (key: TKey) => {
            if (activeElement !== key) {
                setActiveElement(key);
            }
        },
        [activeElement]
    );

    const colspanCallback = React.useCallback(
        (item: Model) => {
            return item.get('type') ? 'end' : 1;
        },
        [slice?.state?.nodeProperty, slice?.state?.root]
    );

    return (
        <div>
            <TreeGrid
                onActiveElementChanged={handleActiveElementChange}
                // @ts-ignore
                virtualScrollConfig={VIRTUAL_SCROLL_FIXED_LINE}
                customEvents={['onActiveElementChanged']}
                header={header}
                colspanCallback={colspanCallback}
                storeId={storeId}
                columns={columns || defaultColumns}
                {...restProps}
                getRowProps={getModifiedRowProps}
            />
        </div>
    );
}

const ConnectedComponent = React.forwardRef(ConnectedComponentRef);

export { ConnectedComponent, ConnectedComponent as OverviewTreeConnectedComponent };

/**
 * Компонент “Обзорное дерево”.
 *
 * Компонент обеспечивает представление дерева в виде списка, с выделением иерархии с помощью размера и жирности шрифта.
 * @class Controls-Lists/overviewTree:ConnectedComponent
 * @implements Controls-Lists/_overviewTree/interface/IOverviewTreeConnectedComponentProps
 * @example
 * <pre class="brush: js">
 * import { ConnectedComponent as OverviewTree } from 'Controls-Lists/overviewTree';
 *
 * export default function MyComponent(props: IProps): React.ReactComponent {
 *
 *   return (
 *           <OverviewTree
 *              storeId={'overviewTreeSlice'}
 *          />
 *   );
 *  }
 * </pre>
 * @demo Controls-Lists-demo/overviewTree/Base/Index
 * @public
 */
