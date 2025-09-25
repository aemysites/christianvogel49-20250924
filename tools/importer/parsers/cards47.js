/* global WebImporter */
export default function parse(element, { document }) {
  // Get all top-level columns (cards)
  const cardColumns = Array.from(element.querySelectorAll(':scope > div'));
  const rows = [];
  // Always use the required block name header row
  rows.push(['Cards (cards47)']);

  // For each card column, extract image and text content
  cardColumns.forEach((col) => {
    // Defensive: find the text-component inside this column
    const textComp = col.querySelector('.text-component');
    if (!textComp) return;
    // Find image (first img in textComp)
    const img = textComp.querySelector('img');
    // Find all paragraphs (usually: first is image, second is text)
    const paragraphs = Array.from(textComp.querySelectorAll('p'));
    // The image is in the first paragraph, text in the second
    let imageEl = null;
    let textEls = [];
    if (img) {
      imageEl = img;
    }
    // For text, get all nodes from the second <p> (if exists)
    if (paragraphs.length > 1) {
      // Use all child nodes of the second <p> for text (preserves formatting)
      textEls = Array.from(paragraphs[1].childNodes);
    }
    // Fallback: if no second <p>, try to find text elsewhere
    if (textEls.length === 0 && paragraphs.length > 0) {
      textEls = Array.from(paragraphs[0].childNodes).filter((n) => n !== img);
    }
    // Build the row: [image, text]
    rows.push([
      imageEl || '',
      textEls.length ? textEls : '',
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
