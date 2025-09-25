/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Hero (hero12)'];

  // There is no background image in the source HTML, so row 2 is empty
  const bgImageRow = [''];

  // Find the main text content
  // Defensive: grab the first .text element within the block
  const textContent = element.querySelector('.text');
  let contentRow;
  if (textContent) {
    // Place the entire textContent div in the cell
    contentRow = [textContent];
  } else {
    // Fallback: empty cell
    contentRow = [''];
  }

  // Assemble table rows
  const rows = [
    headerRow,
    bgImageRow,
    contentRow,
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
