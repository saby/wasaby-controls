import { Form } from 'Controls-DataEnv/dataFactory';

const loadData = () => {
    return Promise.reject(new Error('Something happened...'));
};

const slice = Form.slice;

export { loadData, slice };
