import { forwardRef, useMemo } from 'react';
import { default as RadioGroup } from 'Controls-Input/RadioGroupConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const WrapText = forwardRef((_, ref) => {
    const variants = useMemo(() => {
        return {
            items: [
                {
                    id: 1,
                    title: 'very very over very long long long long text for testing option wrapText',
                    parent: null,
                    node: false,
                },
                {
                    id: 2,
                    title: 'normal text',
                    parent: null,
                    node: false,
                },
                {
                    id: 3,
                    title: 'normal text 2',
                    parent: null,
                    node: false,
                }
            ]
        };
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <RadioGroup
                name={getBinding('RadioGroup')}
                label={getOuterTextLabel('WrapText = true')}
                wrapText={true}
                variants={variants}
            />
            <RadioGroup
                name={getBinding('RadioGroup')}
                label={getOuterTextLabel('WrapText = false')}
                wrapText={false}
                variants={variants}
            />
        </div>
    );
});

WrapText.getLoadConfig = getLoadConfig;

export default WrapText;
