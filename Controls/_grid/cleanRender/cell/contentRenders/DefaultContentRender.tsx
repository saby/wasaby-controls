/*
 * Компонент, для дефолтного отображения содержимого ячейки
 */
import { TOverflow } from 'Controls/interface';
import * as React from 'react';
import { useItemData } from 'Controls/_grid/gridReact/hooks/useItemData';

interface IDefaultCellContentRenderProps {
    displayProperty: string;
    textOverflow?: TOverflow;
}

export function DefaultCellContentRender(
    props: IDefaultCellContentRenderProps
): React.ReactElement {
    const { renderValues } = useItemData([props.displayProperty]);
    const value = renderValues[props.displayProperty]?.toString();
    if (props.textOverflow && props.textOverflow === 'ellipsis') {
        return <div className={'tw-truncate'}>{value}</div>;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{value}</>;
}
