function computePrevEnabled(page) {
  return page > 1;
}

function computeNextEnabled(page, totalPages) {
  return page < totalPages;
}

function clampPage(target, totalPages) {
  if (!Number.isFinite(target) || target < 1) return 1;
  if (!Number.isFinite(totalPages) || totalPages < 1) return 1;
  return Math.max(1, Math.min(totalPages, Math.floor(target)));
}

module.exports = { computePrevEnabled, computeNextEnabled, clampPage };