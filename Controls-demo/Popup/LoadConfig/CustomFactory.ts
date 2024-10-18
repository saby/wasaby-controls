import { Slice } from 'Controls-DataEnv/slice';

const loadData = () => {
    return Promise.resolve({
        title: 'Очень важные данные',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    });
};

const slice = Slice;

export { loadData, slice };
