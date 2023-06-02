import { useRenderData } from 'Controls/gridReact';
import { Money } from 'Controls/baseDecorator';
import { Icon } from 'Controls/icon';
import { MyModel } from 'Controls-demo/gridReact/resources/Data';

interface IProps {
    showImportantFlag: boolean;
}

export default function SumStateCell(props: IProps) {
    const { renderValues } = useRenderData<MyModel>(['sum', 'icons']);
    return (
        <div
            className={'ws-flexbox ws-justify-content-between'}
            style={{ width: '100%' }}
        >
            <Money
                value={renderValues.sum}
                fontColorStyle={'secondary'}
                fontWeight={'bold'}
            />

            <div className={'ws-flexbox'} style={{ width: '80px' }}>
                <div className={'ws-flexbox'}>
                    {renderValues.icons.map((it) => {
                        return (
                            <Icon
                                key={it}
                                icon={it}
                                iconSize={'s'}
                                className={'controls-padding_right-xs'}
                            />
                        );
                    })}
                </div>
                {props.showImportantFlag && (
                    <Icon
                        icon={'icon-ExclamationCircle'}
                        iconSize={'s'}
                        iconStyle={'success'}
                    />
                )}
            </div>
        </div>
    );
}
