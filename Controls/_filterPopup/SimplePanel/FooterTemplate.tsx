import * as React from 'react';
import Async from 'Controls/Container/Async';

const showMoreOptions = {
    iconSize: 'm',
};

export default React.forwardRef(function HasMoreFooter(props, ref) {
    const { showMoreButton, moreButtonClick, name, addSpacer } = React.useMemo(() => {
        return props.footerItemData;
    }, [props.footerItemData]);

    const onMoreButtonClick = React.useCallback(() => {
        moreButtonClick?.(name);
    }, [moreButtonClick]);

    if (showMoreButton) {
        return (
            <div>
                <div
                    className="controls-Menu__moreButton controls-Menu__footer-moreButton"
                    data-qa="SimplePanel-List__hasMoreButton"
                    onClick={onMoreButtonClick}
                >
                    <Async
                        templateName="Controls/ShowMoreButton"
                        data-qa="controls-Menu__moreButton"
                        templateOptions={showMoreOptions}
                    ></Async>
                </div>
                {props.showFooterSeparator ? (
                    <div className="controls-SimplePanel__multiple_separator"></div>
                ) : null}
            </div>
        );
    } else if (addSpacer) {
        return <div className="controls-margin_top-xs"></div>;
    } else {
        return <div className="controls-SimplePanel__multiple_separator"></div>;
    }
});
