/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Search (search29)'];

  // The second row must contain ONLY the absolute URL to the query index
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.live/block-collection/sample-search-data/query-index.json';
  const secondRow = [queryIndexUrl];

  // Build the table structure: 1 column, 2 rows
  const rows = [headerRow, secondRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
