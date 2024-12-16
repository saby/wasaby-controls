import { Text as TextControl } from 'Controls/input';

/**
 * Пример комплексного редактора
 * @param props
 * @constructor
 */
export default function Editor(props: any) {
    const { LayoutComponent, attributes, value, onChange, metaType } = props;

    return (
        <LayoutComponent title={''} skipGridLayout={true}>
            <div className={'ws-flexbox'}>
                {Object.entries(attributes).map(([attributeName]) => {
                    return (
                        <div key={attributeName} className={'ws-flexbox ws-flex-column'}>
                            <span>{metaType.getProperties()[attributeName].getTitle()}</span>
                            <TextControl
                                className="tw-w-full"
                                value={value?.[attributeName]}
                                onInput={(e) => {
                                    onChange({
                                        ...value,
                                        [attributeName]: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </LayoutComponent>
    );
}
