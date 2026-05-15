const getPagination = (page, limit) => {
  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 10;

  return {
    page: currentPage,
    limit: perPage,
    offset: (currentPage - 1) * perPage
  };
};

module.exports = { getPagination };
