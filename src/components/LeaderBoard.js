import React, { useEffect, useState, useContext, useRef } from 'react';
import DataTable from 'react-data-table-component';
import appProp from '../server';

// const appProp = server.appProp;

const leaderBoardTableHeader = [
    {
        name: 'Address',
        selector: row => row.Address,
        width: "400pt",
    },
    {
        name: 'Point',
        selector: row => row.Point,
        width: "70pt",
        sortable: true,
    },
];

const postData = async (url = '', data = {}) => {
    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(data),
    })
        .then(response => response.json());
};

const StartDate = '2020-01-01';
const EndDate = '2030-01-01';

export default (props) => {

    const [board, setBoard] = useState([]);

    useEffect(() => {
        startApp();
    }, []);

    const startApp = async () => {

        try {

            let res = await postData(appProp.boardURL, { startdate: StartDate, enddate: EndDate })
            if (res !== null) {
                setBoard(res);
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (board !== null && board.length <= 0) ? <div align="center"></div> : (
        <>
            <DataTable
                title='Leader Board'
                columns={leaderBoardTableHeader}
                data={board}
                keyField='Address'
                defaultSortFieldId='Point'
                defaultSortAsc={false}
            />
        </>
    );

}
