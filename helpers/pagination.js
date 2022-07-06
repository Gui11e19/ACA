//creates userInfo object for use in views
function createPageInfo(page, itemsPerPage, totalItems) {
  //se define los atributos de cada pagina
  const pageInfo = {
    currentPage: page,
    hasNextPage: itemsPerPage * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(totalItems / itemsPerPage),
  };

  return pageInfo;
}

module.exports = createPageInfo;
