import { IBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { TBackgroundStyle } from 'Controls/interface';

interface IGetBaseCellComponentProps extends IBaseCellComponentProps {
    backgroundColorStyle?: TBackgroundStyle;
}

export function getBaseCellComponentProps(
    props: IGetBaseCellComponentProps
): IBaseCellComponentProps {
    return {
        className: props.className,
        style: props.style,
        tooltip: props.tooltip,
        tabIndex: props.tabIndex,
        'data-qa': props['data-qa'] || props?.dataQa,
        title: props.title,
        contentRender: props.contentRender,
        onClick: props.onClick,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,
        isSticky: props.isSticky,
        stickyMode: props.stickyMode,
        stickyPosition: props.stickyPosition,
        fixedBackgroundStyle: props.fixedBackgroundStyle || props.backgroundColorStyle,
        stickiedBackgroundStyle: props.stickiedBackgroundStyle || props.backgroundColorStyle,
        fixedZIndex: props.fixedZIndex,
        shadowVisibility: props.shadowVisibility,
        pixelRatioBugFix: props.pixelRatioBugFix,
        subPixelArtifactFix: props.subPixelArtifactFix,
        leftSeparatorSize: props.leftSeparatorSize,
        rightSeparatorSize: props.rightSeparatorSize,
    };
}
