import * as React from 'react';
import FooterDemo from './Footer';

function DemoEditorComponent(props): React.ReactElement {
    const onChange = (event) => {
        props.setStickyFooter(Number(event.target.value));
    };

    return (
        <div>
            <span>stickyFooter: </span>
            <select onChange={onChange} value={props.stickyFooter}>
                <option value={1}>true</option>
                <option value={0}>false</option>
            </select>
        </div>
    );
}

function StickyHeaderDemo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const [stickyFooter, setStickyFooter] = React.useState(1);
    return (
        <div ref={ref}>
            <FooterDemo ref={null} stickyFooter={Boolean(stickyFooter)} />
            <DemoEditorComponent stickyFooter={stickyFooter} setStickyFooter={setStickyFooter} />
        </div>
    );
}

export default React.forwardRef(StickyHeaderDemo);
