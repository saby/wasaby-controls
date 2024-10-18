import * as React from 'react';

export type TBlockProps = {
    minHeight?: React.CSSProperties['minHeight'];
    boxShadow?: boolean;
    children: JSX.Element;
    title?: string;
    style?: React.CSSProperties;
};

function Block({
    minHeight,
    children,
    boxShadow = true,
    title,
    style: propsStyle = {},
}: TBlockProps): JSX.Element {
    const style = React.useMemo<React.CSSProperties>(
        () => ({
            ...propsStyle,
            boxShadow: boxShadow ? 'var(--box-shadow_block)' : undefined,
            minHeight,
        }),
        [boxShadow, minHeight]
    );
    return (
        <div
            className="tw-relative controls-padding-l controls_border-radius-l controls-margin_bottom-xl"
            style={style}
        >
            {children}
            {title && (
                <div
                    className="tw-absolute controls-margin_right-3xl controls-padding_right-xs controls-padding_left-xs"
                    style={{
                        bottom: -10,
                        right: 0,
                        maxWidth: '100%',
                        height: 20,
                        backgroundColor: 'white',
                        color: 'var(--unaccented_text-color)',
                    }}
                >
                    {title}
                </div>
            )}
        </div>
    );
}

const BlockMemo = React.memo(Block);
export default BlockMemo;
