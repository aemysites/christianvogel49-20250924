/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector(':scope > .row');
  if (!row) return;

  // Get the direct column divs
  const columns = Array.from(row.children);
  if (columns.length === 0) return;

  // Each cell should reference the existing column element
  const columnsRow = columns.map((col) => col);

  // Build the table rows: header + columns
  const tableRows = [
    ['Columns (columns13)'],
    columnsRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
