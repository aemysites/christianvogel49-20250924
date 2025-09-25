/* global WebImporter */
export default function parse(element, { document }) {
  // Find left column (title/count)
  const leftCol = element.querySelector('.col-md-3, .col-sm-12');
  // Find right column (description)
  let rightCol = element.querySelector('.col-md-9, .col-lg-9');
  // Fallback: If not found, try mobile description
  if (!rightCol) {
    rightCol = element.querySelector('.col-12');
  }

  // Compose left cell: include all text content from leftCol
  let leftCellContent = [];
  if (leftCol) {
    // Get all children (not just h1 and span)
    leftCellContent = Array.from(leftCol.childNodes).filter(node => {
      // Only include elements and text nodes with actual content
      return (node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim());
    });
  }

  // Compose right cell: include all text content from rightCol
  let rightCellContent = [];
  if (rightCol) {
    // Find all paragraphs and direct text nodes
    rightCellContent = Array.from(rightCol.querySelectorAll('p'));
    // If no <p>, fallback to any text nodes
    if (rightCellContent.length === 0) {
      rightCellContent = Array.from(rightCol.childNodes).filter(node => {
        return (node.nodeType === 3 && node.textContent.trim());
      });
    }
  }

  // Table header
  const headerRow = ['Columns block (columns43)'];
  // Table content row (2 columns)
  const contentRow = [leftCellContent, rightCellContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace element
  element.replaceWith(table);
}
