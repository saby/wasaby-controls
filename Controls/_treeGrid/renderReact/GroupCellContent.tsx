import * as React from 'react';
import { createElement } from 'UICore/Jsx';

function GroupCellContent(props) {
    const { item, gridColumn, itemData, fontColorStyle, fontSize, fontWeight, textTransform } =
        props;
    const groupNodeConfig = (gridColumn || itemData).column.groupNodeConfig || {};

    let leftSeparatorRender = null;
    if (
        (gridColumn || itemData).shouldDisplayLeftSeparator(
            groupNodeConfig.separatorVisibility,
            groupNodeConfig.textVisible,
            groupNodeConfig.textAlign
        )
    ) {
        leftSeparatorRender = (
            <div className="controls-ListView__groupSeparator controls-ListView__groupSeparator-left">
                &nbsp;
            </div>
        );
    }

    let textRender = null;
    if (groupNodeConfig.textVisible !== false) {
        textRender = (
            <div
                className={
                    (gridColumn || itemData).getContentTextWrapperClasses(
                        fontColorStyle,
                        fontSize,
                        fontWeight,
                        textTransform,
                        groupNodeConfig.separatorVisibility
                    ) +
                    ' ' +
                    (gridColumn || itemData).getBaseLineClasses(fontSize)
                }
            >
                <div
                    className={
                        (gridColumn || itemData).getContentTextClasses(groupNodeConfig.textAlign) +
                        ' ' +
                        (gridColumn || itemData).getExpanderClasses(
                            groupNodeConfig.expanderVisible,
                            groupNodeConfig.expanderAlign,
                            groupNodeConfig.iconSize,
                            groupNodeConfig.iconStyle
                        )
                    }
                    data-qa={item.listElementName + '-expander'}
                >
                    {groupNodeConfig.contentTemplate
                        ? createElement(groupNodeConfig.contentTemplate, {
                              item: item || itemData,
                              itemData: item || itemData,
                              column: gridColumn || itemData,
                          })
                        : (gridColumn || itemData).getDefaultDisplayValue()}
                </div>
            </div>
        );
    }

    let rightSeparatorRender = null;
    if (
        (gridColumn || itemData).shouldDisplayRightSeparator(
            groupNodeConfig.separatorVisibility,
            groupNodeConfig.textVisible,
            groupNodeConfig.textAlign
        )
    ) {
        rightSeparatorRender = (
            <div
                className={
                    'controls-ListView__groupSeparator' +
                    (groupNodeConfig.textVisible !== false
                        ? ' controls-ListView__groupSeparator-right'
                        : '')
                }
            >
                &nbsp;
            </div>
        );
    }

    return (
        <div className={(gridColumn || itemData).getContentClasses()}>
            {leftSeparatorRender}
            {textRender}
            {rightSeparatorRender}
        </div>
    );
}

export default React.memo(GroupCellContent);
