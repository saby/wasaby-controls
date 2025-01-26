import * as React from 'react';
import { useItemData } from 'Controls/gridReact';

export default function DemoStaticColumnComponent(): React.ReactElement {
    const { renderValues } = useItemData(['name', 'position', 'image']);
    return (
        <span className="tw-flex tw-overflow-hidden tw-items-center">
            <div
                className={
                    'controlsListsDemo__timelineGrid_WI_Base-photo ' +
                    'controls-margin_top-s controls-margin_bottom-s controls-margin_right-s ' +
                    'controls_border-radius-s'
                }
                style={{
                    backgroundImage: `url(${renderValues.image})`,
                }}
            ></div>
            <div className="tw-overflow-hidden">
                <div className="tw-truncate controls-fontweight-bold">{renderValues.name}</div>
                <div className="tw-truncate controls-text-readonly">{renderValues.position}</div>
            </div>
        </span>
    );
}
