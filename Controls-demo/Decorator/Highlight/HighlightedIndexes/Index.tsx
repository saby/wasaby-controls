import { forwardRef, LegacyRef } from 'react';
import { Highlight } from 'Controls/baseDecorator';

const value =
    '[ФИО контактного лица], подождите, я еще ничего не предложил(а). [ФИО контактного лица], ' +
    'нам важна обратная связь от клиентов, чтобы учитывать ее в работе СБИС. Вы с нами работает по отчетности, ' +
    'а по ЕНС так же работаете через СБИС? (пауза) Как контролируете поступления и списания средств на ЕНС?';

const indexes: [number, number][] = [
    [3, 7],
    [7, 9],
    [12, 15],
    [19, 20],
    [30, 60],
    [120, 250],
];

export default forwardRef(function StrictSearchDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="controlsDemo_fixedWidth500">
                <div>
                    <div className="controls-text-label">Подсветка по индексам</div>
                    <Highlight value={value} highlightedValue={indexes} />
                </div>
            </div>
        </div>
    );
});
