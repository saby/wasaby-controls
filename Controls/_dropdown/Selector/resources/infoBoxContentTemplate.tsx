import * as rk from 'i18n!Controls';
import * as React from 'react';
import { ForwardedRef } from 'react';
import { Title } from 'Controls/heading';
import { Container } from 'Controls/scroll';
import { Model } from 'Types/entity';

interface IInfoBoxContentTemplateProps {
    selectedItems: Model[];
    displayProperty: string;
    className: string;
}

function InfoBoxContentTemplate(
    props: IInfoBoxContentTemplateProps,
    ref: ForwardedRef<HTMLDivElement>
) {
    const { selectedItems, displayProperty, className } = props;

    return (
        <div ref={ref} className={'ws-flexbox ws-flex-column test-test ' + className || ''}>
            <Title
                className="controls-padding_left-m controls-padding_right-m controls-InfoBox__message_margin"
                caption={rk('Выбрано')}
                fontColorStyle="secondary"
                fontSize="m"
                readOnly={true}
            />

            <Container>
                <div className="controls-padding_left-m controls-padding_right-m">
                    {selectedItems.map((item) => (
                        <div>{item.get(displayProperty)}</div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

InfoBoxContentTemplate.displayName = 'InfoBoxContentTemplate';

export default React.forwardRef(InfoBoxContentTemplate);
