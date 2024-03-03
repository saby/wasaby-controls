/**
 * Действие вывода Alert
 */
export default class Alert {
    execute(options: any, props: object): void {
        alert(`Вызвано действие кнопки с аргументами ${propsAsString(props)}`);
    }
}

function propsAsString(obj) {
    return Object.keys(obj)
        .map(function (k) {
            return k + ': ' + obj[k];
        })
        .join(' и ');
}
