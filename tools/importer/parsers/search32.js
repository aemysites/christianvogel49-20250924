/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as header
  const headerRow = ['Search (search32)'];

  // The second row must contain ONLY the absolute URL to the query index
  // This is static for this block type as per the markdown example
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.live/block-collection/sample-search-data/query-index.json';

  // Build the table with only the required rows and columns
  const cells = [
    headerRow,
    [queryIndexUrl],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
