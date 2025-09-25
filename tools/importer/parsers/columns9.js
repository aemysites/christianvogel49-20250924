/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the two columns (parsys_column)
  const columns = Array.from(element.querySelectorAll(':scope > .parsys_column'));
  if (columns.length < 2) return;

  // 2. Extract content for each column
  // --- COLUMN 1 ---
  const col1 = columns[0];
  let col1Content = [];
  // Find first image (if any)
  const col1Img = col1.querySelector('img');
  if (col1Img) col1Content.push(col1Img);
  // Find all text blocks (text-component)
  col1.querySelectorAll('.text-component').forEach(tc => {
    // Avoid pushing parent of image if image is already included
    if (!col1Img || !tc.contains(col1Img)) col1Content.push(tc);
  });

  // --- COLUMN 2 ---
  const col2 = columns[1];
  let col2Content = [];
  // Find all text blocks (text-component)
  col2.querySelectorAll('.text-component').forEach(tc => {
    col2Content.push(tc);
  });

  // 3. Compose the table
  const headerRow = ['Columns block (columns9)'];
  const contentRow = [col1Content, col2Content];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 4. Replace original element
  element.replaceWith(table);
}
