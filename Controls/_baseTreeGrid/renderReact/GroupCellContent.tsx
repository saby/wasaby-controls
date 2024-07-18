import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import {
    IFontProps,
    TTextTransform,
    IIconSizeOptions,
    ITextTransformOptions,
    IIconStyleOptions,
} from 'Controls/interface';
import { GroupClassNameUtils } from 'Controls/display';

interface IGroupDataCellRender
    extends IFontProps,
        IIconSizeOptions,
        IIconStyleOptions,
        ITextTransformOptions {
    expanderAlign?: string;
    separatorVisibility?: boolean;
    expanderVisible?: boolean;
    textAlign?: string;
    textVisible?: boolean;
    textRender?: React.ReactElement;
    textTransform?: TTextTransform;
    expanded: boolean;
}

export function GroupDataCellRender({
    separatorVisibility,
    textVisible,
    textAlign,
    textRender,
    fontSize,
    fontWeight,
    fontColorStyle,
    textTransform,
    expanderVisible,
    expanderAlign,
    expanded,
    iconStyle,
    iconSize,
}: IGroupDataCellRender) {
    let leftSeparatorRender = null;
    if (separatorVisibility !== false && textVisible !== false && textAlign !== 'left') {
        leftSeparatorRender = (
            <div className="controls-ListView__groupSeparator controls-ListView__groupSeparator-left">
                &nbsp;
            </div>
        );
    }

    let textWrapperRender = null;
    if (textVisible !== false) {
        const textWrapperClassName = GroupClassNameUtils.getTextWrapperClassName(
            fontColorStyle,
            fontSize,
            fontWeight,
            textTransform,
            separatorVisibility
        );
        const textClassName = GroupClassNameUtils.getTextClassName(
            textAlign,
            expanderVisible,
            expanderAlign,
            expanded,
            iconSize,
            iconStyle,
            fontSize
        );
        textWrapperRender = (
            <div className={textWrapperClassName}>
                <div className={textClassName} data-qa={'group-expander'}>
                    {textRender}
                </div>
            </div>
        );
    }

    let rightSeparatorRender = null;
    if (separatorVisibility !== false && (textAlign !== 'right' || textVisible === false)) {
        const rightSeparatorClassName =
            'controls-ListView__groupSeparator' +
            (textVisible !== false ? ' controls-ListView__groupSeparator-right' : '');
        rightSeparatorRender = <div className={rightSeparatorClassName}>&nbsp;</div>;
    }

    return (
        <>
            {leftSeparatorRender}
            {textWrapperRender}
            {rightSeparatorRender}
        </>
    );
}

function GroupCellContent(props) {
    const { item, gridColumn, itemData, fontColorStyle, fontSize, fontWeight, textTransform } =
        props;
    const config = (gridColumn || itemData).column;
    const groupNodeConfig = config.groupNodeConfig || {};

    const fontColorStyleResult =
        groupNodeConfig?.fontColorStyle || config.fontColorStyle || fontColorStyle;
    const fontSizeResult = groupNodeConfig?.fontSize || config.fontSize || fontSize;
    const fontWeightResult = groupNodeConfig?.fontWeight || config.fontWeight || fontWeight;
    const textTransformResult = groupNodeConfig?.textTransform || textTransform;
    const separatorVisibility = groupNodeConfig?.separatorVisibility;

    const textRender = groupNodeConfig.contentTemplate
        ? createElement(groupNodeConfig.contentTemplate, {
              item: item || itemData,
              itemData: item || itemData,
              column: gridColumn || itemData,
          })
        : (gridColumn || itemData).getDefaultDisplayValue();

    return (
        <div className={(gridColumn || itemData).getContentClasses()}>
            <GroupDataCellRender
                expanded={item.isExpanded()}
                textVisible={groupNodeConfig.textVisible}
                textAlign={groupNodeConfig.textAlign}
                textTransform={textTransformResult}
                fontColorStyle={fontColorStyleResult}
                fontSize={fontSizeResult}
                fontWeight={fontWeightResult}
                separatorVisibility={separatorVisibility}
                expanderVisible={groupNodeConfig.expanderVisible}
                expanderAlign={groupNodeConfig.expanderAlign}
                iconSize={groupNodeConfig.iconSize}
                iconStyle={groupNodeConfig.iconStyle}
                textRender={textRender}
            />
        </div>
    );
}

export default React.memo(GroupCellContent);
