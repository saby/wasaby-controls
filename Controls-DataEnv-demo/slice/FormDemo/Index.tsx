import { Text } from 'Controls-Input/inputConnected';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { MyConnectedComponent } from './MyConnectedComponent';

export function Index(props): JSX.Element {
    return (
        <div class="controlsDemo__wrapper__horizontal controlsDemo__cell">
            <Text name={['Пользователь', 'Фамилия']} />
            <Text name={['Пользователь', 'Имя']} />
            <Text name={['Пользователь', 'Отчество']} />
            <MyConnectedComponent name={['Контакт', 'Телефон']} />
        </div>
    );
}

function onDataChangeCallback(store: FormSlice): void {
    alert(`Контекст данных изменен:
        ${JSON.stringify(store.store.getStore().getRawData())}`);
}

Index.getLoadConfig = () => {
    return {
        FormData: {
            dataFactoryName: 'Controls-DataEnv-demo/slice/FormDemo/MyFactory',
            dataFactoryArguments: {
                onDataChange: onDataChangeCallback,
            },
        },
    };
};

export default Index;
