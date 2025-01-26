import { useMemo } from 'react';
import { Text as TextControl } from 'Controls/input';
import { WarningTemplate, ValidationContainer } from 'Controls-editors/object-type';

/**
 * Пример комплексного редактора
 * @param props
 * @constructor
 */
export default function Editor(props: any) {
    const { LayoutComponent, attributes, value, onChange, metaType, validation } = props;
    const warning = useMemo(() => {
        if (!validation) {
            return;
        }

        return Object.keys(attributes).reduce<string>((str, name) => {
            let result = str;

            if (result) {
                result += '\n';
            }

            const attrWarning = validation[name as string]?.warning;

            if (attrWarning) {
                result += name + ': ' + attrWarning;
            }

            return result;
        }, '');
    }, [attributes, validation]);

    return (
        <LayoutComponent title={''} skipGridLayout={true} doNotValidate={true}>
            <div>
                <div className={'ws-flexbox'}>
                    {Object.entries(attributes).map(([attributeName]) => {
                        const validators = validation?.[attributeName]?.validators;

                        return (
                            <div key={attributeName} className={'ws-flexbox ws-flex-column'}>
                                <span>{metaType.getProperties()[attributeName].getTitle()}</span>
                                <ValidationContainer validators={validators}>
                                    <TextControl
                                        className="tw-w-full"
                                        value={value?.[attributeName]}
                                        onInput={(e: any) => {
                                            onChange({
                                                ...value,
                                                [attributeName]: e.target.value,
                                            });
                                        }}
                                    />
                                </ValidationContainer>
                            </div>
                        );
                    })}
                </div>
                {warning && <WarningTemplate text={warning} />}
            </div>
        </LayoutComponent>
    );
}
