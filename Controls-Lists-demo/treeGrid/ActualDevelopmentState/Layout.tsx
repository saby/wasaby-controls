import * as React from 'react';

export type TLayoutProps = {
    leftContent?: JSX.Element;
    mainContent?: JSX.Element;
    rightContent?: JSX.Element;
};

export type TLayoutRef = React.ForwardedRef<HTMLDivElement>;

const SIDEBARS_STYLES = {
    minWidth: 250,
    width: '25%',
    maxWidth: 500,
};

const CONTENT_STYLES = {
    minWidth: 400,
    width: '50%',
    maxWidth: 1500,
};

function Layout(props: TLayoutProps, ref: TLayoutRef): JSX.Element {
    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            {props.leftContent && (
                <div
                    style={SIDEBARS_STYLES}
                    className="controls-padding-s"
                    children={props.leftContent}
                />
            )}

            <div
                style={CONTENT_STYLES}
                className="controls-padding-s"
                children={props.mainContent}
            />

            {props.rightContent && (
                <div
                    style={SIDEBARS_STYLES}
                    className="controls-padding-s"
                    children={props.rightContent}
                />
            )}
        </div>
    );
}

const LayoutForwardedForwardedMemo = React.memo(React.forwardRef(Layout));
export default LayoutForwardedForwardedMemo;
