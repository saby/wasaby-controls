import * as React from 'react';
import ResultsDemo from './Results';

function DemoEditorComponent(props): React.ReactElement {
    const onChange = (event) => {
        props.setStickyResults(Number(event.target.value));
    };

    return (
        <div>
            <span>stickyResults: </span>
            <select onChange={onChange} value={props.stickyResults}>
                <option value={1}>true</option>
                <option value={0}>false</option>
            </select>
        </div>
    );
}

function StickyHeaderDemo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>) {
    const [stickyResults, setStickyResults] = React.useState(1);
    return (
        <div ref={ref}>
            <ResultsDemo ref={null} stickyResults={Boolean(stickyResults)} />
            <DemoEditorComponent
                stickyResults={stickyResults}
                setStickyResults={setStickyResults}
            />
        </div>
    );
}

export default React.forwardRef(StickyHeaderDemo);
