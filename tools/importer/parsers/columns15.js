/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column containers
  const columns = Array.from(element.children).filter((child) => child.classList.contains('parsys_column'));

  // Defensive: fallback to all direct children if not found
  let leftCol = columns[0] || element.children[0];
  let rightCol = columns[1] || element.children[1];

  // Extract left column content (text block)
  let leftContent = null;
  if (leftCol) {
    // Find the deepest .text block
    let textBlock = leftCol.querySelector('.text');
    if (textBlock) {
      leftContent = textBlock;
    } else {
      leftContent = leftCol;
    }
  }

  // Extract right column content (image block)
  let rightContent = null;
  if (rightCol) {
    // Find the img element
    let img = rightCol.querySelector('img');
    if (img) {
      rightContent = img;
    } else {
      rightContent = rightCol;
    }
  }

  // Build the table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = [leftContent, rightContent];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
