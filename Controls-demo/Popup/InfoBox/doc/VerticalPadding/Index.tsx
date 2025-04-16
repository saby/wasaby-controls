import { forwardRef, useCallback } from 'react';
import { InfoboxTarget } from 'Controls/popupTargets';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';
import { Container } from 'Controls/scroll';

function Template(props) {
    return (
        <Container style={{ maxHeight: '200px', maxWidth: '250px' }}>
            <div className={props.className}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi blanditiis error,
                incidunt modi molestias omnis placeat quaerat quasi quidem soluta ut voluptatibus? A
                consequuntur fugit illo iste perferendis repellendus velit. Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Animi blanditiis error, incidunt modi molestias
                omnis placeat quaerat quasi quidem soluta ut voluptatibus? A consequuntur fugit illo
                iste perferendis repellendus velit. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Animi blanditiis error, incidunt modi molestias omnis placeat
                quaerat quasi quidem soluta ut voluptatibus? A consequuntur fugit illo iste
                perferendis repellendus velit.
            </div>
        </Container>
    );
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
                <Label caption="Всплывающая подсказка без вертикальных и горизонтальных паддингов" />
                <Label caption="verticalPadding=null, horizontalPadding=null" />
                <InfoboxTarget
                    content={getInfoboxTarget}
                    template={Template}
                    verticalPadding={null}
                    horizontalPadding={null}
                />
            </div>
        </div>
    );
}

export default forwardRef(Infobox);
