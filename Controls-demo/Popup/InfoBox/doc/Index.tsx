import { forwardRef, useCallback } from 'react';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';

function Template(props) {
    return <div className={props.className}>Контент внутри инфобокса</div>;
}

function Infobox(props, ref) {
    const getInfoboxTarget = useCallback((props) => {
        return (
            <Icon
                {...props}
                viewMode="linkButton"
                className="controls-margin_bottom-m"
                ref={props.forwardedRef}
                icon="icon-Question"
                iconStyle="secondary"
                iconSize="m"
            />
        );
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col tw-items-center" style={{ width: '400px' }}>
                <Label caption="Наведите для открытия инфобокса" />
                <InfoboxTarget content={getInfoboxTarget} template={Template} />
                <Label caption="Кликните для открытия инфобокса" />
                <InfoboxTarget trigger="click" content={getInfoboxTarget} template={Template} />
            </div>
        </div>
    );
}

export default forwardRef(Infobox);
