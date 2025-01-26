import { IBaseCellComponentProps } from 'Controls/_gridRender/cell/Base';
import { TBackgroundStyle } from 'Controls/interface';

interface IGetBaseCellComponentProps extends IBaseCellComponentProps {
    backgroundColorStyle?: TBackgroundStyle;
}

const DEFAULT_DATA_QA = 'cell';

export function getBaseCellProps(props: IGetBaseCellComponentProps): IBaseCellComponentProps {
    return {
        className: props.className,
        style: props.style,
        title: props.title,
        tooltip: props.tooltip,
        href: props.href,
        tabIndex: props.tabIndex,
        'data-qa': props['data-qa'] || props.dataQa || DEFAULT_DATA_QA,
        dataName: props['data-name'] || props.dataName,
        attributes: props.attributes,
        contentRender: props.contentRender,
        onClick: props.onClick,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,
        onMouseOver: props.onMouseOver,
        isSticky: props.isSticky,
        stickyMode: props.stickyMode,
        stickyPosition: props.stickyPosition,
        fixedBackgroundStyle: props.fixedBackgroundStyle || props.backgroundColorStyle,
        stickiedBackgroundStyle: props.stickiedBackgroundStyle || props.backgroundColorStyle,
        fixedZIndex: props.fixedZIndex,
        shadowVisibility: props.shadowVisibility,
        pixelRatioBugFix: props.pixelRatioBugFix,
        subPixelArtifactFix: props.subPixelArtifactFix,
    };
}
