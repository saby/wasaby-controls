import { useState } from 'react';

function useDemoData() {
    const [address, setAddress] = useState('г. Ярославль, ул. Победы, д. 33');

    function addressHandler(_, value) {
        setAddress(value);
    }

    const [tel, setTel] = useState('8 800 355 35 35');

    function telHandler(_, value) {
        setTel(value);
    }

    const [mail, setMail] = useState('privet-poka@kek.ru');

    function mailHandler(_, value) {
        setMail(value);
    }

    return { address, addressHandler, tel, telHandler, mail, mailHandler };
}

export { useDemoData };
