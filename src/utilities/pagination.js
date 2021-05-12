/* Pagination */
module.exports = (count, page, limit = 5) => {
  let maxPages = Math.floor(count / limit);
  let offset = 0;

  if (page <= 0) return { maxPages, canPaginate: false };

  if (page > maxPages) {
    return {
      maxPages,
      canPaginate: false,
    };
  }

  if (page > 1) {
    offset = page * limit - limit;
  }

  return {
    limit,
    offset,
    maxPages,
    canPaginate: true,
  };
};

/** Pagination ends here */
