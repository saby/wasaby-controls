import * as React from 'react';

interface IProps {
    header: string;
    level?: number;
    expanded?: boolean;
    children: React.ReactElement | React.ReactElement[];
}

export default function (props: IProps): React.ReactElement {
    const [expanded, setExpanded] = React.useState(props.expanded);

    const HeaderTag = `h${props.level || 1}` as keyof JSX.IntrinsicElements;
    return (
        <div
            className={'controls__block-layout controls__block-layout-background'}
            style={{ cursor: 'pointer' }}
        >
            <HeaderTag
                onClick={() => {
                    return setExpanded((prev) => {
                        return !prev;
                    });
                }}
            >
                {props.header}
            </HeaderTag>
            {expanded ? <div className={'ws-flexbox ws-flex-wrap'}> {props.children} </div> : null}
        </div>
    );
}
