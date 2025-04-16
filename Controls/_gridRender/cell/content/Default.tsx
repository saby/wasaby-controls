/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TOverflow } from 'Controls/interface';
import * as React from 'react';
import { useItemData } from 'Controls/_gridRender/hooks/useItemData';
import { EDITOR_SELECTOR_CAPTION } from 'Controls/_gridRender/constants';

interface IDefaultCellContentRenderProps {
    displayProperty: string;
    tooltipProperty?: string;
    textOverflow?: TOverflow;
}

/**
 * Приватный платформенный компонент рендера содержимого ячейки по умолчанию
 * @private
 */
export function DefaultCellContentRender(
    props: IDefaultCellContentRenderProps
): React.ReactElement {
    const { renderValues } = useItemData([props.displayProperty, props.tooltipProperty]);
    const value = renderValues[props.displayProperty]?.toString();
    const tooltip = renderValues[props.tooltipProperty]?.toString();
    if (props.textOverflow && props.textOverflow === 'ellipsis') {
        return (
            <div className={`tw-truncate ${EDITOR_SELECTOR_CAPTION}`} title={tooltip ?? value}>
                {value}
            </div>
        );
    }

    if (tooltip) {
        return <div title={tooltip}>{value}</div>;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{value}</>;
}
