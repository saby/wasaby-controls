import { default as ShowMoreButton } from 'Controls/ShowMoreButton';
import 'css!Controls-demo/toggle/BigSeparator/Color/Color';
import { forwardRef, LegacyRef, useState } from 'react';

export default forwardRef(function BasicButtonDemo(_, ref: LegacyRef<HTMLDivElement>) {
    const [expanded, setExpanded] = useState(false);

    const clickHandler = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <div
            ref={ref}
            className="tw-flexbox tw-items-start tw-justify-content-center controlsDemo__wrapper controlsDemo__flex controlsDemo_fixedWidth500"
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-secondary">filled</div>
                <ShowMoreButton
                    value={expanded}
                    onClick={clickHandler}
                    iconMode="ellipsis"
                    viewMode="filled"
                    data-qa="Controls-demo_toggle_BigSeparator_IconMode__show-more-ellipsis"
                />
            </div>
            <div className="controlsDemo__cell controls-margin_left-m">
                <div className="controls-text-secondary">readonly</div>
                <ShowMoreButton
                    value={expanded}
                    onClick={clickHandler}
                    iconMode="ellipsis"
                    viewMode="filled"
                    readOnly={true}
                    data-qa="Controls-demo_toggle_BigSeparator_IconMode__show-more-ellipsis"
                />
            </div>
            <div className="controlsDemo__cell controls-margin_left-m">
                <div className="controls-text-secondary">custom color</div>
                <ShowMoreButton
                    value={expanded}
                    onClick={clickHandler}
                    iconMode="ellipsis"
                    viewMode="ghost"
                    data-qa="Controls-demo_toggle_BigSeparator_IconMode__show-more-ellipsis"
                    className="my-custom-icon-color"
                />
            </div>
            <div className="controlsDemo__cell controls-margin_left-m">
                <div className="controls-text-secondary">arrow</div>
                <ShowMoreButton
                    value={expanded}
                    onClick={clickHandler}
                    iconMode="arrow"
                    viewMode="filled"
                    data-qa="Controls-demo_toggle_BigSeparator_IconMode__show-more-ellipsis"
                />
            </div>
            <div className="controlsDemo__cell controls-margin_left-m">
                <div className="controls-text-secondary">custom size</div>
                <ShowMoreButton
                    value={expanded}
                    onClick={clickHandler}
                    iconMode="arrow"
                    viewMode="filled"
                    className="my-custom-button-size"
                    data-qa="Controls-demo_toggle_BigSeparator_IconMode__show-more-ellipsis"
                />
            </div>
        </div>
    );
});
