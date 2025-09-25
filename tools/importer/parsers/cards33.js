/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // Defensive: find all gallery items (cards)
  // The structure is: .gallery > .wrapper > .item > figure
  const gallery = element.querySelector('.gallery');
  if (!gallery) {
    // If not found, replace with an empty block
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  // Each card is inside .wrapper > .item
  const wrappers = gallery.querySelectorAll(':scope > .wrapper');
  wrappers.forEach((wrapper) => {
    // Defensive: find .item inside wrapper
    const item = wrapper.querySelector(':scope > .item');
    if (!item) return;
    const figure = item.querySelector('figure');
    if (!figure) return;

    // Find image (first img inside figure)
    const img = figure.querySelector('img');

    // Find figcaption (contains h3 and description)
    const figcaption = figure.querySelector('figcaption');
    let textContent = [];
    if (figcaption) {
      // Find heading (h3)
      const heading = figcaption.querySelector('h3');
      if (heading) textContent.push(heading);
      // Find all paragraphs and lists after heading
      // We'll include all <p> and <ul> that are not inside <h3>
      figcaption.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node !== heading) {
          if (node.tagName === 'P' || node.tagName === 'UL' || node.tagName === 'OL') {
            textContent.push(node);
          }
        }
      });
    }
    // If no text content, fallback to empty string
    if (textContent.length === 0) textContent = [''];

    // Each card row: [image, text content]
    rows.push([
      img || '',
      textContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
