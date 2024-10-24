import * as React from 'react';
import HeaderDemo from './Header';

function DemoEditorComponent(props): React.ReactElement {
    const onChange = (event) => {
        props.setStickyHeader(Number(event.target.value));
    };

    return (
        <div>
            <span>stickyHeader: </span>
            <select onChange={onChange} value={props.stickyHeader}>
                <option value={1}>true</option>
                <option value={0}>false</option>
            </select>
        </div>
    );
}

function StickyHeaderDemo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const [stickyHeader, setStickyHeader] = React.useState(1);
    return (
        <div ref={ref}>
            <HeaderDemo ref={null} stickyHeader={Boolean(stickyHeader)} />
            <DemoEditorComponent stickyHeader={stickyHeader} setStickyHeader={setStickyHeader} />
        </div>
    );
}

export default React.forwardRef(StickyHeaderDemo);
