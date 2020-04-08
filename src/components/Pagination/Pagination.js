import React from 'react';

import { Pagination } from 'react-bootstrap';

const pagination = (props) => {
    const currentActivePage = props.currentActivePage;
    const totalPages = props.totalPages;
    const items = [];
    for (let pageNo = 1; pageNo <= totalPages; pageNo++) {
        items.push(
            <Pagination.Item key={pageNo} active={pageNo === currentActivePage}>
                {pageNo}
            </Pagination.Item>,
        );
    }

    return (
        <div>
            <Pagination onClick={props.onPageChange}>{items}</Pagination>
        </div>
    )
}

export default pagination;