import {
    defaultNavigationStrategy,
    INavigationParams,
    TNavigationDirection,
} from 'FrameEditor/navigation';
import { IItemsOptions } from 'Controls-Containers/interface';

const handleMove = (
    direction: TNavigationDirection,
    navigationParams: INavigationParams,
    defaultNavigationMethod: (params: INavigationParams) => string | null
) => {
    const { element } = navigationParams;
    if (navigationParams.targetId) {
        return null;
    }
    const variants = element.getStaticProperties()?.variants as IItemsOptions['variants'];
    const children = element.getContentProperties()?.children || [];
    let index = 0;
    if (variants?.items) {
        variants.items.forEach((item, i) => {
             if (item.id === variants.selectedKeys[0]) {
                 index = i;
             }
         });
    }
    return children[index].getContentProperties()?.children?.[0]?.getId?.();
};

/**
 * Стратегия навигации виджета Вкладки.
 */
export const tabsNavigationStrategy = {
    moveUp: (navigationParams: INavigationParams) =>
        handleMove('up', navigationParams, defaultNavigationStrategy.moveUp),
    moveRight: (navigationParams: INavigationParams) =>
        handleMove('right', navigationParams, defaultNavigationStrategy.moveRight),
    moveDown: (navigationParams: INavigationParams) =>
        handleMove('down', navigationParams, defaultNavigationStrategy.moveDown),
    moveLeft: (navigationParams: INavigationParams) =>
        handleMove('left', navigationParams, defaultNavigationStrategy.moveLeft),
};
