import { forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';

export default forwardRef(function SquaredButtonsDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="primary"
                        iconStyle="primary"
                    />
                </div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="secondary"
                        iconStyle="secondary"
                    />
                </div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="success"
                        iconStyle="success"
                    />
                </div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="danger"
                        iconStyle="danger"
                    />
                </div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="warning"
                        iconStyle="warning"
                    />
                </div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="info"
                        iconStyle="info"
                    />
                </div>
                <div className="controls-margin_bottom-m">
                    <Button
                        icon="icon-Gift"
                        viewMode="squared"
                        buttonStyle="default"
                        iconStyle="default"
                    />
                </div>
                <div>
                    <Button icon="icon-Gift" viewMode="squared" readOnly={true} />
                </div>
            </div>
        </div>
    );
});
