import { forwardRef, useCallback } from 'react';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';

function Template(props) {
    return <div className={props.className}>Контент внутри инфобокса</div>;
}

function Infobox(props, ref) {
    const getInfoboxContent = useCallback((props) => {
        return (
            <Icon
                {...props}
                viewMode="linkButton"
                ref={props.forwardedRef}
                icon="icon-Question"
                iconSize="m"
            />
        );
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col tw-items-center" style={{ width: '400px' }}>
                <Label
                    className="controls-icon_style-success"
                    caption="backgroundStyle='success' borderStyle='success'"
                />
                <InfoboxTarget
                    className="controls-icon_style-success"
                    backgroundStyle="success"
                    borderStyle="success"
                    content={getInfoboxContent}
                    template={Template}
                />
                <Label
                    className="controls-icon_style-danger"
                    caption="backgroundStyle='danger' borderStyle='danger'"
                />
                <InfoboxTarget
                    className="controls-icon_style-danger"
                    backgroundStyle="danger"
                    borderStyle="danger"
                    content={getInfoboxContent}
                    template={Template}
                />
                <Label
                    className="controls-icon_style-warning"
                    caption="backgroundStyle='warning' borderStyle='warning'"
                />
                <InfoboxTarget
                    className="controls-icon_style-warning"
                    backgroundStyle="warning"
                    borderStyle="warning"
                    content={getInfoboxContent}
                    template={Template}
                />
                <Label
                    className="controls-icon_style-primary"
                    caption="backgroundStyle='primary' borderStyle='primary'"
                />
                <InfoboxTarget
                    className="controls-icon_style-primary"
                    backgroundStyle="primary"
                    borderStyle="primary"
                    content={getInfoboxContent}
                    template={Template}
                />
                <Label
                    className="controls-icon_style-secondary"
                    caption="backgroundStyle='secondary' borderStyle='secondary'"
                />
                <InfoboxTarget
                    className="controls-icon_style-secondary"
                    backgroundStyle="secondary"
                    borderStyle="secondary"
                    content={getInfoboxContent}
                    template={Template}
                />
                <Label
                    className="controls-icon_style-info"
                    caption="backgroundStyle='info' borderStyle='info'"
                />
                <InfoboxTarget
                    className="controls-icon_style-info"
                    backgroundStyle="info"
                    borderStyle="info"
                    content={getInfoboxContent}
                    template={Template}
                />
            </div>
        </div>
    );
}

export default forwardRef(Infobox);
