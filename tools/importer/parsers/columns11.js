/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row that contains all columns
  const mainRow = element.querySelector('.row.mx-0');
  if (!mainRow) return;

  // Get all direct column children of the main row
  const colSelectors = [
    '.col-md-1', '.col-lg-1', // logo
    '.col-md-7', '.col-lg-7', // links
    '.col-md-4', '.col-lg-4' // newsletter/social
  ];
  // Select only direct children that match any of the selectors
  const columns = Array.from(mainRow.children).filter(child =>
    colSelectors.some(sel => child.matches(sel))
  );

  // For the links column, get its inner columns (O HOFERju, INFORMACIJE, etc)
  let expandedColumns = [];
  for (const col of columns) {
    // If this is the links column, expand its .no-border children
    if (col.classList.contains('col-md-7') || col.classList.contains('col-lg-7')) {
      const innerCols = col.querySelectorAll('.row > .no-border');
      // Only push non-empty .no-border columns
      for (const innerCol of innerCols) {
        // Accept columns with text or links/images/forms
        if (innerCol.textContent.trim() !== '' || innerCol.querySelector('img,form,a')) {
          expandedColumns.push(innerCol);
        }
      }
    } else {
      // Otherwise, just push the column itself
      expandedColumns.push(col);
    }
  }

  // Table header
  const headerRow = ['Columns block (columns11)'];

  // Table row: each column as a cell, clone to avoid mutation
  const contentRow = expandedColumns.map(col => {
    // Use the whole column's HTML content
    const cell = document.createElement('div');
    // Copy all child nodes (not just text)
    Array.from(col.childNodes).forEach(node => cell.appendChild(node.cloneNode(true)));
    return cell;
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
