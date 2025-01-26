import * as React from 'react';
import { useItemData } from 'Controls/gridReact';

export default function DemoStaticColumnComponent(): React.ReactElement {
    const { renderValues, item } = useItemData(['fullName', 'job', 'image']);
    if (item.get('type') === true) {
        return (
            <div className="tw-flex tw-items-baseline">
                <div>
                    <div className="tw-truncate controls-fontweight-bold">
                        {renderValues.fullName}
                    </div>
                    <div className="tw-truncate controls-text-readonly">{renderValues.job}</div>
                </div>
            </div>
        );
    }
    return (
        <span className="tw-flex tw-overflow-hidden tw-items-center">
            <div
                className={
                    'controlsListsDemo__dynamicGridBase-photo ' +
                    'controls-margin_top-s controls-margin_bottom-s controls-margin_right-s ' +
                    'controls_border-radius-s'
                }
                style={{
                    background: `url(${renderValues.image})`,
                }}
            ></div>
            <div className="tw-overflow-hidden">
                <div className="tw-truncate controls-fontweight-bold">{renderValues.fullName}</div>
                <div className="tw-truncate controls-text-readonly">{renderValues.job}</div>
            </div>
        </span>
    );
}
