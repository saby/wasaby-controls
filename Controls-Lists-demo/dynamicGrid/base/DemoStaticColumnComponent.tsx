import * as React from 'react';
import { useRenderData } from 'Controls/gridReact';

export default function DemoStaticColumnComponent(): React.ReactElement {
    const { renderValues } = useRenderData(['fullName', 'job']);
    return (
        <span className="tw-flex tw-overflow-hidden tw-items-center">
            <div className="controlsListsDemo__dynamicGridBase-photo controls-background-secondary-same controls-margin-s"></div>
            <div className="tw-overflow-hidden">
                <div className="tw-truncate controls-fontweight-bold">
                    {renderValues.fullName}
                </div>
                <div className="tw-truncate controls-text-readonly">
                    {renderValues.job}
                </div>
            </div>
        </span>
    );
}
