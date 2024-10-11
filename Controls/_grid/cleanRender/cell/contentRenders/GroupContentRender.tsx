import * as React from 'react';
import { IBaseGroupTemplate } from 'Controls/_baseList/interface/BaseGroupTemplate';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';
import {
    TFontColorStyle,
    TFontSize,
    TFontWeight,
    TTextTransform,
    TIconSize,
    TIconStyle,
} from 'Controls/interface';
import { controller as localeController } from 'I18n/singletonI18n';

export const GROUP_EXPANDER_SELECTOR = 'js-controls-Tree__row-expander';

function getTextWrapperClassName(
    fontColorStyle?: TFontColorStyle,
    fontSize?: TFontSize,
    fontWeight?: TFontWeight,
    textTransform?: TTextTransform,
    separatorVisibility?: boolean
): string {
    let className = 'controls-ListView__groupContent-text_wrapper';

    if (fontSize) {
        className += ` controls-fontsize-${fontSize}`;
    } else {
        className += ' controls-ListView__groupContent-text_default';
    }

    if (fontColorStyle) {
        className += ` controls-text-${fontColorStyle}`;
    } else {
        className += ' controls-ListView__groupContent-text_color_default';
    }

    if (fontWeight) {
        className += ` controls-fontweight-${fontWeight}`;
    }

    if (textTransform) {
        className +=
            ` controls-ListView__groupContent_textTransform_${textTransform}` +
            ` controls-ListView__groupContent_textTransform_${textTransform}_${fontSize || 's'}`;
    }

    if (separatorVisibility === false) {
        className += ' tw-flex-grow';
    }

    className += ' controls-ListView__groupContent_baseline';
    if (fontSize && fontSize !== 's' && fontSize !== 'xs' && fontSize !== 'inherit') {
        className += ` controls-ListView__groupContent_baseline_${fontSize}`;
    } else {
        className += ' controls-ListView__groupContent_baseline_default';
    }

    return className;
}

function getTextClassName(
    textAlign: string = 'center',
    expanderVisible?: boolean,
    expanderAlign: string = 'left',
    expanded?: boolean,
    iconSize?: TIconSize,
    iconStyle?: TIconStyle,
    fontSize?: TFontSize
): string {
    let className = 'controls-ListView__groupContent-text';
    className += ` controls-ListView__groupContent_${textAlign}`;
    if (expanderVisible !== false) {
        className += ' controls-ListView__groupContent-text-with_expander';
        if (textAlign === 'center') {
            className += ' tw-justify-center';
        } else if (textAlign === 'right') {
            className += ' tw-justify-end';
        }
        if (!fontSize || fontSize === 'default') {
            className += ` controls-ListView__groupExpander_${expanderAlign}-line-height_default`;
        } else {
            className += ` controls-ListView__groupExpander_${expanderAlign}-line-height_${fontSize}`;
        }
        if (!expanded) {
            className += ' controls-ListView__groupExpander_collapsed';
            className += ` controls-ListView__groupExpander_collapsed_${expanderAlign}`;

            const directionality = localeController.currentLocaleConfig.directionality;
            if (directionality === 'rtl') {
                className += ' controls-ListView__groupExpander_reverse';
            }
        }

        className +=
            ' controls-ListView__groupExpander ' +
            ` controls-ListView__groupExpander_${expanderAlign}` +
            ` controls-ListView__groupExpander-iconSize_${iconSize || 'default'}` +
            ` controls-ListView__groupExpander-iconStyle_${iconStyle || 'default'}` +
            ` ${GROUP_EXPANDER_SELECTOR}`;
    }

    return className;
}

export interface IGroupContentRenderProps extends IBaseGroupTemplate {
    contentRender?: React.ReactElement;
    className?: string;

    customTemplateProps?: object;
    expanded?: boolean;
    expanderPosition?: string;
    rightTemplateProps?: object;
    textRender?: string | React.ReactElement;

    // sticky
    headerFixedPosition?: string;

    // Должно уйти в будущем, для этого надо поправить компонент группировки
    decorationStyle?: string; // default или master
    isFirstItem?: boolean;
    leftPaddingClassName?: string;
    rightPaddingClassName?: string;
    rightTemplateCondition?: boolean;
    // Растягивание шаблона справа.  Применяется в гриде при скролле колонок
    rightTemplateStretch?: boolean;

    // colspan
    startColspanIndex?: number; // ?
    endColspanIndex?: number;
}

const HALIGN_MAPPER = {
    start: 'left',
    end: 'right',
    center: 'center',
    left: 'left',
    right: 'right',
};

/*----------------------------------------------------------------------------------*/

function getSeparatorVisible(
    separatorVisible: boolean | undefined,
    separatorVisibility: boolean | undefined
) {
    return separatorVisible !== undefined ? separatorVisible : separatorVisibility;
}

function getLeftSeparator(props: IGroupContentRenderProps) {
    const separatorVisible = getSeparatorVisible(props.separatorVisible, props.separatorVisibility);

    const textAlign = props.textAlign || (props.halign && HALIGN_MAPPER[props.halign]);

    if (separatorVisible !== false && props.textVisible !== false && textAlign !== 'left') {
        const separatorClasses =
            'controls-ListView__groupSeparator controls-ListView__groupSeparator-left';
        return <div className={separatorClasses}>&nbsp;</div>;
    }
    return null;
}

function getRightSeparator(props: IGroupContentRenderProps) {
    const separatorVisible = getSeparatorVisible(props.separatorVisible, props.separatorVisibility);

    const textAlign = props.textAlign || (props.halign && HALIGN_MAPPER[props.halign]);

    const displayText = props.textVisible !== false;

    if (separatorVisible !== false && (textAlign !== 'right' || props.textVisible === false)) {
        const separatorClasses =
            'controls-ListView__groupSeparator' +
            `${displayText ? ' controls-ListView__groupSeparator-right' : ''}`;
        return <div className={separatorClasses}>&nbsp;</div>;
    }
    return null;
}

function getRightTemplate(props: IGroupContentRenderProps) {
    const hasRightTemplate = !!props.rightTemplate && props.rightTemplateCondition !== false;
    const separatorVisible = getSeparatorVisible(props.separatorVisible, props.separatorVisibility);

    if (hasRightTemplate) {
        let rightTemplateClasses =
            'controls-ListView__groupContent-rightTemplate ' + props.rightPaddingClassName;

        if (
            props.rightTemplateStretch ||
            (separatorVisible === false && props.textVisible === false)
        ) {
            rightTemplateClasses += ' tw-flex-grow controls-ListView__groupContent_right';
        }

        return (
            <div className={rightTemplateClasses}>
                {templateLoader(props.rightTemplate, { ...props.rightTemplateProps })}
            </div>
        );
    }

    return null;
}

function getGroupContentRenderBaseClasses(props: IGroupContentRenderProps) {
    let classes =
        'controls-ListView__groupContent controls-ListView__groupContent_height' +
        (props.expanderVisible === false ? ' tw-cursor-default ' : ' ');

    if (props.className) {
        classes += ` ${props.className}`;
    }

    return classes;
}

function getContentRender(props: IGroupContentRenderProps) {
    const contentRender = templateLoader(
        props.contentRender,
        props.customTemplateProps
    ) as unknown as React.ReactElement;
    const displayText = props.textVisible !== false;
    const textAlign = props.textAlign || (props.halign && HALIGN_MAPPER[props.halign]);
    const separatorVisible = getSeparatorVisible(props.separatorVisible, props.separatorVisibility);

    if (displayText) {
        const contentTextWrapperClasses = getTextWrapperClassName(
            props.fontColorStyle,
            props.fontSize,
            props.fontWeight,
            props.textTransform,
            separatorVisible
        );

        const contentTextClasses = getTextClassName(
            textAlign,
            props.expanderVisible,
            props.expanderPosition,
            props.expanded,
            props.iconSize,
            props.iconStyle,
            props.fontSize
        );

        return (
            <div className={contentTextWrapperClasses}>
                <div className={contentTextClasses} data-qa={'group-expander'}>
                    {typeof contentRender === 'string' ? (
                        <span className={'tw-truncate'}>{contentRender}</span>
                    ) : (
                        contentRender
                    )}
                </div>
            </div>
        );
    }

    return null;
}

/*----------------------------------------------------------------------------------*/

/**
 * TODO Это почти клон Controls/_baseList/GroupTemplate.tsx, их надо свести.
 * Рендер заголовка группы по умолчанию.
 * Умеет в зависимости от переданных опций выводить контент в виде:
 * * ------заголовок------;
 * *        заголовок      ;
 * *  ---------------------;
 * *  ----заголовок-- right;
 * *  заголовок------ right;
 * *  ------заголовок right;
 * *  --------------- right;
 * *  --ПРИКЛАДНОЙ_ШАБЛОН--; <-- кейс groupRender.
 * * ПРИКЛАДНОЙ_ШАБЛОН     ; <-- кейс groupRender.
 * @param props
 * @param ref
 * @constructor
 */
function GroupContentRender(
    props: IGroupContentRenderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const leftSeparator = getLeftSeparator(props);

    const rightSeparator = getRightSeparator(props);

    const rightTemplate = getRightTemplate(props);

    const className = getGroupContentRenderBaseClasses(props);

    const contentRender = getContentRender(props);

    return (
        <div className={className} ref={ref}>
            {leftSeparator}
            {contentRender}
            {rightSeparator}
            {rightTemplate}
        </div>
    );
}

export default React.memo(React.forwardRef(GroupContentRender));
