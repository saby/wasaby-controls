import { forwardRef, useCallback } from 'react';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';

function Template(props) {
    const getBodyContentTemplate = useCallback(() => {
        return <div className={props.className}>Контент внутри инфобокса</div>;
    }, []);
    return getBodyContentTemplate();
}

function Infobox(props, ref) {
    const getInfoboxTargetSuccessContent = useCallback((props) => {
        return (
            <Icon
                {...props}
                viewMode="linkButton"
                ref={props.forwardedRef}
                icon="icon-EmoiconLaughInvert"
                iconSize="m"
                iconStyle="success"
            />
        );
    }, []);

    const getInfoboxTargetDangerContent = useCallback((props) => {
        return (
            <Icon
                {...props}
                ref={props.forwardedRef}
                viewMode="linkButton"
                icon="icon-EmoiconAngryInvert"
                iconSize="m"
                iconStyle="danger"
            />
        );
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption="Наведите для открытия инфобокса" />
                <InfoboxTarget
                    backgroundStyle="success"
                    content={getInfoboxTargetSuccessContent}
                    template={Template}
                />
                <Label caption="Кликните для открытия инфобокса" />
                <InfoboxTarget
                    trigger="click"
                    backgroundStyle="danger"
                    content={getInfoboxTargetDangerContent}
                    template={Template}
                />
            </div>
        </div>
    );
}

export default forwardRef(Infobox);
