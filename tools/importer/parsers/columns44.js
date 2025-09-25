/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left column (title and count)
  const leftCol = element.querySelector('.col-md-3');

  // Get the right column (description text)
  // Prefer desktop version if present, else fallback to mobile
  let rightCol = element.querySelector('.col-md-9');
  if (!rightCol) {
    rightCol = element.querySelector('.col-12');
  }

  // Compose left cell: include all text content from leftCol
  let leftCellContent = [];
  if (leftCol) {
    // Clone the leftCol and remove all children except h1 and span
    const h1 = leftCol.querySelector('h1');
    const span = leftCol.querySelector('span');
    if (h1) leftCellContent.push(h1.cloneNode(true));
    if (span) leftCellContent.push(span.cloneNode(true));
  }

  // Compose right cell: include all text content from rightCol
  let rightCellContent = [];
  if (rightCol) {
    // Find all paragraphs in rightCol (desktop and mobile have same content)
    const p = rightCol.querySelector('p');
    if (p) rightCellContent.push(p.cloneNode(true));
  }

  // Table header row
  const headerRow = ['Columns block (columns44)'];
  // Table content row: two columns side by side
  const contentRow = [leftCellContent, rightCellContent];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
