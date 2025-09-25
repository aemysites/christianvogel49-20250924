/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the two columns
  const columns = Array.from(element.querySelectorAll(':scope > .parsys_column'));

  // Defensive fallback: if not exactly 2 columns, treat as empty columns
  const col0 = columns[0] || document.createElement('div');
  const col1 = columns[1] || document.createElement('div');

  // 2. Extract the main button/link from each column
  function extractButtonContent(col) {
    // Look for a button-like <a> (with .btn or .btn-custom)
    const btn = col.querySelector('a.btn, a.btn-custom');
    if (btn) return btn;
    // Fallback: any <a>
    const a = col.querySelector('a');
    if (a) return a;
    // Fallback: any non-empty text node
    const text = Array.from(col.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
    if (text) return document.createTextNode(text.textContent.trim());
    // Fallback: empty
    return document.createTextNode('');
  }

  const col0Content = extractButtonContent(col0);
  const col1Content = extractButtonContent(col1);

  // 3. Build the table rows
  const headerRow = ['Columns block (columns25)'];
  const contentRow = [col0Content, col1Content];

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
