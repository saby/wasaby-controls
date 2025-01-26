import { IEmptyCellComponentProps } from 'Controls/_gridRender/cell/interface/IEmptyCellComponent';
import { getHorizontalPaddingsClasses } from 'Controls/_gridRender/cell/utils/Classes/Offset';

/**
 * Эти классы вынесены, т.к. используются в двух местах:
 * - в cL/EmptyCellComponent, чтобы прикладник мог настроить отступы и выравнивание
 * - в cleanRender/cell/EmptyCellComponent, всегда по умолчанию, кроме случая, когда задан прикладной emptyTemplate
 * @param props
 */
export function getEmptyContentRenderClasses(
    props: Pick<
        IEmptyCellComponentProps,
        'isSingleCell' | 'halign' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'
    >
) {
    const {
        isSingleCell,
        halign = 'center',
        paddingTop = 'l',
        paddingBottom = 'l',
        paddingLeft = 'null',
        paddingRight = 'null',
    } = props;
    let className = ' controls-BaseControl__emptyTemplate__contentWrapper';
    if (isSingleCell) {
        className +=
            ' controls-ListView__empty' +
            ` tw-text-${halign}` +
            ` controls-ListView__empty_topSpacing_${paddingTop}` +
            ` controls-ListView__empty_bottomSpacing_${paddingBottom} ` +
            getHorizontalPaddingsClasses(paddingLeft, paddingRight);
    } else {
        className += ' controls-GridView__emptyTemplate tw-contents';
    }
    return className;
}
