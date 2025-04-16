import { forwardRef, useCallback } from 'react';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';

function Template(props) {
    return <div className={props.className}>Контент внутри всплывающей подсказки</div>;
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
                iconSize="m"
                iconStyle="secondary"
            />
        );
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex controls-margin_top-3xl" style={{ width: '400px' }}>
                <div className="tw-flex tw-flex-col tw-items-center">
                    <Label caption="Открытие окна вправо" />
                    <InfoboxTarget
                        targetSide="right"
                        content={getInfoboxTarget}
                        template={Template}
                    />
                    <Label caption="Открытие окна влево" />
                    <InfoboxTarget
                        targetSide="left"
                        content={getInfoboxTarget}
                        template={Template}
                    />
                </div>
                <div className="tw-flex tw-flex-col tw-items-center">
                    <Label caption="Открытие окна вверх" />
                    <InfoboxTarget
                        targetSide="top"
                        content={getInfoboxTarget}
                        template={Template}
                    />
                    <Label caption="Открытие окна вниз" />
                    <InfoboxTarget
                        targetSide="bottom"
                        content={getInfoboxTarget}
                        template={Template}
                    />
                </div>
            </div>
        </div>
    );
}

export default forwardRef(Infobox);
