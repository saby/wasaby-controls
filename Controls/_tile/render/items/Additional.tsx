/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { createElement } from 'UICore/Jsx';
import { AutoResizer } from 'Controls/_tile/render/itemComponents/AutoResizer';
import { getItemEventHandlers } from 'Controls/baseList';

function AdditionalItemTemplate(props) {
    const {
        className,
        item,
        itemType,
        size,
        width,
        itemWidth,
        staticHeight,
        children,
        contentTemplate,
        content,
        $wasabyRef,
    } = props;

    const additionalItemClasses =
        item.getAdditionalItemClasses(props) + item.getCursorClasses(props.cursor, props.clickable);
    const imageWrapperClasses = item.getImageWrapperClasses({
        ...props,
        itemType: 'default',
    });

    const itemStyle = {
        ...props.styleProp,
        ...item.getImageWrapperStyles(props),
        ...item.getAdditionalItemStyles(itemType, width || itemWidth, staticHeight, size),
    };

    const resizerContent = item.getContentTemplate(item.getItemType(itemType));
    const fakeContent =
        size !== 'custom'
            ? createElement(resizerContent, {
                  ...props,
                  attrStyle: item.getVerticalResizerStyles(),
              })
            : null;
    const resizer = (
        <>
            {fakeContent}
            {size !== 'custom' ? <AutoResizer {...props} position={'item'} /> : null}
        </>
    );
    const itemContent = createElement(children || contentTemplate || content);
    const handlers = getItemEventHandlers(props.item, props);

    return (
        <div
            className={className + ' ' + additionalItemClasses + ' ' + imageWrapperClasses}
            style={itemStyle}
            data-qa={item.listElementName}
            ref={$wasabyRef}
            {...handlers}
        >
            {resizer}
            {itemContent}
        </div>
    );
}

export default React.memo(AdditionalItemTemplate);
