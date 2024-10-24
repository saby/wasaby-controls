import * as React from 'react';

import { MoreButtonTemplate } from 'Controls/baseList';

interface IProps {
    renderHasMoreButton: boolean;
    isMoreButton: boolean;
    customRender: React.ReactElement;

    linkFontColorStyle: string;
    loadMoreCaption: string;
    buttonView: 'separator' | 'link';
    buttonConfig: object;
}
function ExtraItemCellRender(props: IProps) {
    if (props.renderHasMoreButton) {
        return (
            <MoreButtonTemplate
                buttonView={props.buttonView}
                buttonConfig={props.buttonConfig}
                loadMoreCaption={props.loadMoreCaption}
                linkFontColorStyle={props.linkFontColorStyle}
                linkFontSize={'xs'}
            />
        );
    }

    if (!props.isMoreButton) {
        return props.customRender;
    }

    return null;
}

export default React.memo(ExtraItemCellRender);
