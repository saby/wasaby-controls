import { useRenderData } from 'Controls/gridReact';
import { Model } from 'Types/entity';

interface IRenderValues {
    company: string;
    sender: string;
    account: string;
    comment: string;
    additionalData: string[];
}

export default function MainDataCell() {
    const { renderValues } = useRenderData<Model<IRenderValues>>([
        'company',
        'sender',
        'account',
        'comment',
        'additionalData',
    ]);
    return (
        <div className={'ws-flex-column'} style={{ width: '100%' }}>
            <div className={'ws-flexbox ws-justify-content-between'}>
                <h3 className={'controls-text-secondary'}>{renderValues.company}</h3>
                <div className={'controls-text-label'}>{renderValues.sender}</div>
            </div>

            <div
                className={'ws-flexbox ws-justify-content-between'}
                style={{ paddingLeft: '16px' }}
            >
                <div className={'controls-fontsize-xs'}>{renderValues.account}</div>
                <div className={'controls-fontsize-xs controls-text-label'}>
                    {renderValues.comment}
                </div>
            </div>

            {renderValues.additionalData.map((it) => {
                return (
                    <div
                        key={it}
                        className={'controls-fontsize-xs controls-text-unaccented'}
                        style={{ paddingLeft: '16px' }}
                    >
                        {it}
                    </div>
                );
            })}
        </div>
    );
}
