/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the card content from each column
  function extractCardContent(col) {
    // Defensive: find the deepest .item .text block
    const item = col.querySelector('.item');
    if (!item) return null;
    const text = item.querySelector('.text');
    if (!text) return null;
    // Collect heading and paragraphs
    const heading = text.querySelector('h2, h3, h4, h5, h6');
    // Filter out empty <p> tags
    const paragraphs = Array.from(text.querySelectorAll('p')).filter(p => p.textContent.trim());
    // Compose cell content
    const cellContent = [];
    if (heading) cellContent.push(heading);
    cellContent.push(...paragraphs);
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  }

  // Get all columns (cards)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: filter only columns with expected structure
  const cardColumns = columns.filter(col => col.querySelector('.item .text'));

  // Build table rows
  const headerRow = ['Cards (cardsNoImages30)'];
  const rows = [headerRow];
  cardColumns.forEach(col => {
    const cardContent = extractCardContent(col);
    if (cardContent) {
      rows.push([cardContent]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
