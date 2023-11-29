import PageButton from './PageButton';

const PaginationNav = ({page, setPage, hasPreviousPage, hasNextPage, totalPages}) => {

    const pagesArray = Array(totalPages).fill().map((_, index) => index + 1)

    const lastPage = () => setPage(totalPages)

    const firstPage = () => setPage(1)

    return (
        <nav className="nav">
            <button onClick={firstPage} disabled={!hasPreviousPage || page === 1}>&lt;&lt;</button>
            {pagesArray.map(pg => <PageButton key={pg} pg={pg} setPage={setPage} />)}
            <button onClick={lastPage} disabled={!hasNextPage || page === totalPages}>&gt;&gt;</button>
        </nav>

    );
};

export default PaginationNav;