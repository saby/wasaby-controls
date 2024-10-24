import { PrimaryAction } from 'Controls/form';
import { constants } from 'Env/Env';

describe('Controls/form:PrimaryAction', () => {
    it('trigger called', () => {
        const instance = new PrimaryAction({});
        const event = {
            nativeEvent: {
                keyCode: constants.key.enter,
                altKey: false,
                ctrlKey: true,
            },
            stopPropagation: jest.fn(),
        };
        jest.spyOn(instance, '_notify').mockClear().mockImplementation();
        instance.keyDownHandler(event);
        expect(instance._notify).toHaveBeenCalledWith('triggered');
        instance.destroy();
    });

    it('trigger not called', () => {
        const instance = new PrimaryAction({});
        const event = {
            nativeEvent: {
                keyCode: constants.key.enter,
                altKey: true,
                ctrlKey: true,
            },
        };
        jest.spyOn(instance, '_notify').mockClear().mockImplementation();

        instance.keyDownHandler(event);
        expect(instance._notify).not.toHaveBeenCalled();

        event.nativeEvent.altKey = false;
        event.nativeEvent.keyCode = 0;

        instance.keyDownHandler(event);
        expect(instance._notify).not.toHaveBeenCalled();

        instance.destroy();
    });
});
