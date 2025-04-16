import { IPadding } from 'Controls/interface';

export interface ITileItemVerticalPadding extends Pick<IPadding, 'top' | 'bottom'> {}
export interface ITileItemHorizontalPadding extends Pick<IPadding, 'left' | 'right'> {}

export function getHorizontalMarginsClasses(padding: ITileItemHorizontalPadding) {
    return (
        `controls-TileView__item_spacingLeft_${padding.left}` +
        ` controls-TileView__item_spacingRight_${padding.right}`
    );
}
export function getVerticalMarginsClasses(padding: ITileItemVerticalPadding) {
    return (
        ` controls-TileView__item_spacingTop_${padding.top}` +
        ` controls-TileView__item_spacingBottom_${padding.bottom}`
    );
}
