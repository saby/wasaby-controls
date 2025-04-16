import { forwardRef, LegacyRef } from 'react';
import {
    default as QwertyOpener,
    IGNORE_CLASS_NAME as QwertyIgnoreClass,
} from 'Controls-Keyboard/QwertyOpener';
import { Label, Text } from 'Controls/input';

export default forwardRef(function Ignored(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <QwertyOpener>
                <div className="tw-flex tw-flex-col controlsDemo_fixedWidth400">
                    <div className="tw-flex tw-justify-between controls-margin_bottom-s">
                        <Label caption={'Игнорируется одно поле'} />
                        <div className="tw-flex tw-flex-col">
                            <Text placeholder="Поле 1" />
                            <Text
                                className={QwertyIgnoreClass}
                                placeholder={'Клавиатура не покажется'}
                            />
                            <Text placeholder={'Поле 3'} />
                        </div>
                    </div>
                    <div className={`tw-flex tw-justify-between ${QwertyIgnoreClass}`}>
                        <Label caption={'Все игнорируются'} />
                        <div className="tw-flex tw-flex-col">
                            <Text placeholder={'Клавиатура не покажется'} />
                            <Text placeholder={'Клавиатура не покажется'} />
                        </div>
                    </div>
                </div>
            </QwertyOpener>
        </div>
    );
});
