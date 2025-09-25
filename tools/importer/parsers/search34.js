/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Search (search34)'];

  // The query index URL is always the same for this block type
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.live/block-collection/sample-search-data/query-index.json';

  // Extract the search input placeholder from the source html
  let placeholder = '';
  const input = element.querySelector('input[type="text"][placeholder]');
  if (input && input.placeholder) {
    placeholder = input.placeholder;
  }

  // Compose cell content: show the placeholder text above the query index link if available
  const cellContent = [];
  if (placeholder) {
    cellContent.push(document.createTextNode(placeholder));
    cellContent.push(document.createElement('br'));
  }
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;
  cellContent.push(link);

  // Table rows
  const rows = [
    headerRow,
    [cellContent],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
