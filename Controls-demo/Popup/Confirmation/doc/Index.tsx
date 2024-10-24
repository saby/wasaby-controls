import {useCallback} from 'react';
import { Confirmation } from 'Controls/popup';
import {Button} from 'Controls/buttons';
import {Label} from 'Controls/input';

export default function ConfirmationDemo() {
    const openConfirmation = useCallback((config) => {
        Confirmation.openPopup(
            config
        ).then((result: boolean) => {
            // Логика обработки результата
        });
    }, []);

    const openDefaultConfirmation = useCallback(() => {
        openConfirmation({
            message: 'Сохранить изменения?',
            type: 'yesnocancel'
        });
    }, []);

    const openDangerConfirmation = useCallback(() => {
        openConfirmation({
            message: 'При сохранении данных произошла ошибка',
            details: 'Повторите попытку позднее',
            type: 'ok',
            markerStyle: 'danger'
        });
    }, []);

    const openCustomButtonsConfirmation = useCallback(() => {
        openConfirmation({
            message: 'Сохранить изменения?',
            buttons: [{
                caption: 'Да',
                buttonStyle: 'primary',
                value: true
            }, {
                caption: 'Нет, не спрашивать больше',
                fontColorStyle: 'unaccented',
                viewMode: 'link',
                value: false
            }]
        });
    }, []);

    return (
        <div className='tw-flex tw-justify-center'>
            <div className='tw-flex tw-flex-col' style={{width: '400px'}}>
                <Label caption='type="yesnocancel"'/>
                <Button caption='Открыть окно подверждения' onClick={openDefaultConfirmation}/>
                <Label caption='type="ok" markerStyle="danger"'/>
                <Button caption='Открыть окно подверждения' onClick={openDangerConfirmation}/>
                <Label caption='Кастомное значение buttons, markerStyle="success"'/>
                <Button caption='Открыть окно подверждения' onClick={openCustomButtonsConfirmation}/>
            </div>
        </div>
    );
}