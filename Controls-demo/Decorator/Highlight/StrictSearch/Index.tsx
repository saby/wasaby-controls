import { forwardRef, LegacyRef } from 'react';
import { Highlight } from 'Controls/baseDecorator';

export default forwardRef(function StrictSearchDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const highValue = [
        '[ФИО',
        'контактного лица], нам ',
        'Вы',
        'нами',
        'работает',
        'по',
        'отчетности,',
        'а',
        'по',
        'ЕНС',
        'так',
        'же',
        'работаете',
        'через',
        'СБИС?',
        '(пауза)',
        'Как',
        'контролируете',
    ];

    const value =
        '[ФИО контактного лица], подождите, я еще ничего не предложил(а). [ФИО контактного лица], ' +
        'нам важна обратная связь от клиентов, чтобы учитывать ее в работе СБИС. Вы с нами работает по отчетности, ' +
        'а по ЕНС так же работаете через СБИС? (пауза) Как контролируете поступления и списания средств на ЕНС?';

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="controlsDemo_fixedWidth500">
                <div className="controls-margin_bottom-2xl">
                    <Highlight value={value} highlightedValue={highValue} />
                </div>
                <div>
                    <div className="controls-text-label">strictSearch='true'</div>
                    <Highlight value={value} highlightedValue={highValue} strictSearch={true} />
                </div>
            </div>
        </div>
    );
});
