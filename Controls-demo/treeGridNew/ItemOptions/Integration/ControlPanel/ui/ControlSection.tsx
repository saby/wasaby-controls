import * as React from 'react';

interface ControlSectionProps {
    title: string;
    children: React.ReactNode;
    'data-qa': string;
}

export function ControlSection(props: ControlSectionProps): JSX.Element {
    const { title, children, 'data-qa': dataQa } = props;

    return (
        <section className="control-section" data-qa={dataQa}>
            <h4 data-qa={`${dataQa}Title`} className="control-section-header">
                {title}
            </h4>
            <div className="control-content" data-qa={`${dataQa}Content`}>
                {children}
            </div>
        </section>
    );
}
