/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IBaseCellComponentProps } from 'Controls/_gridRender/cell/Base';
import { TBackgroundStyle } from 'Controls/interface';

interface IGetBaseCellComponentProps extends IBaseCellComponentProps {
    backgroundColorStyle?: TBackgroundStyle;
}

const DEFAULT_DATA_QA = 'cell';

/**
 * Возвращает пропсы, необходимые для рендера базовой ячейки
 * @private
 */
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
        onMouseDown: props.onMouseDown,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,
        onMouseOver: props.onMouseOver,
        isSticky: props.isSticky,
        stickyMode: props.stickyMode,
        stickyPosition: props.stickyPosition,
        fixedBackgroundStyle: props.fixedBackgroundStyle || props.backgroundColorStyle,
        stickiedBackgroundStyle:
            ((!props.stickiedBackgroundStyle || props.stickiedBackgroundStyle === 'default') &&
                props.backgroundColorStyle) ||
            props.stickiedBackgroundStyle,
        fixedZIndex: props.fixedZIndex,
        shadowVisibility: props.shadowVisibility,
        pixelRatioBugFix: props.pixelRatioBugFix,
        subPixelArtifactFix: props.subPixelArtifactFix,
        fixedClassName: props.fixedClassName,
    };
}
