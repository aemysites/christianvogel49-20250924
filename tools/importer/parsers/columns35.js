/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Helper: get all content blocks (E05-basic-text) in column, skipping spacers
  function getContentBlocks(col) {
    return Array.from(col.querySelectorAll(':scope > .E05-basic-text'));
  }
  function filterSpacing(blocks) {
    return blocks.filter(b => !b.classList.contains('E46-spacing'));
  }

  // Get content blocks for each column
  const colBlocks = columns.map(col => filterSpacing(getContentBlocks(col)));

  // Find max number of blocks in any column
  const maxRows = Math.max(colBlocks[0].length, colBlocks[1].length);

  // Build table rows: each row is a pair of blocks (one from each column)
  const headerRow = ['Columns block (columns35)'];
  const tableRows = [];
  for (let i = 0; i < maxRows; i++) {
    const row = [];
    for (let c = 0; c < columns.length; c++) {
      row.push(colBlocks[c][i] || '');
    }
    tableRows.push(row);
  }

  // Compose table
  const cells = [headerRow, ...tableRows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
