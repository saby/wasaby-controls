/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import type * as React from 'react';
import type { IGridViewProps } from 'Controls/gridReact';
import type { INavigationComponentProps } from 'Controls/columnScrollReact';
import type { IBeforeItemsContentProps } from './BeforeItemsContent';
import type { ISize } from './mobileView/synchronizer/types';

export type TColumnScrollViewMode = INavigationComponentProps['mode'] | 'unaccented';
export type TColumnScrollNavigationPosition = 'custom';

/**
 * Опции публичного представления контрола "Таблица" со скролом колонок.
 * @interface Controls/_gridColumnScroll/render/view/interface/IGridViewColumnScrollProps
 * @private
 */
export interface IGridViewColumnScrollProps extends IGridViewProps {
    itemsSize?: ISize[];
}

export type TViewBeforeItemsContentComponentProps = IInnerDeviceViewProps &
    Pick<IBeforeItemsContentProps, 'part'>;
export type TViewBeforeItemsContentComponent =
    React.FunctionComponent<TViewBeforeItemsContentComponentProps>;

/**
 * Опции приватных(зависимых от устройств) представлений контрола "Таблица" со скролом колонок.
 * @interface Controls/_gridColumnScroll/render/view/interface/IInnerDeviceViewProps
 * @private
 */
// className удаляется с типа намеренно, чтобы не путаться.
// Есть опции под классы для всей вью, фиксированной части и скроллируемой.
// Родитель (корень вьюхи - View) должен настраивать их, а сам принимает только className.
export interface IInnerDeviceViewProps extends Omit<IGridViewColumnScrollProps, 'className'> {
    shouldUseFakeRender: boolean;
    viewClassName: string;
    fixedWrapperClassName: string;
    fixedElementClassName: string;
    transformedWrapperClassName: string;
    hydrationPreRenderClassName: string;
    leftShadowClassName: string;
    beforeItemsContentComponent: TViewBeforeItemsContentComponent;
    columnScrollViewMode?: TColumnScrollViewMode;
}
