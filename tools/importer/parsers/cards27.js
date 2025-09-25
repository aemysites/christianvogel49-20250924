/* global WebImporter */
export default function parse(element, { document }) {
  // Find the gallery block containing the cards
  const gallery = element.querySelector('.E12-grid-gallery .gallery');
  if (!gallery) return;

  // Table header
  const headerRow = ['Cards (cards27)'];
  const rows = [headerRow];

  // Find all visible card wrappers (ignore .d-none, .moved, and empty wrappers)
  const wrappers = Array.from(gallery.querySelectorAll(':scope > .wrapper'));
  wrappers.forEach(wrapper => {
    // Defensive: skip wrappers with .d-none or .moved
    if (wrapper.classList.contains('d-none') || wrapper.classList.contains('moved')) return;
    const item = wrapper.querySelector('.item');
    if (!item) return;
    const figure = item.querySelector('figure');
    if (!figure) return;

    // Find the image
    const img = figure.querySelector('img');
    // Defensive: skip if no image
    if (!img || !img.src) return;

    // Find the figcaption
    const figcaption = figure.querySelector('figcaption');
    let textCellContent = [];
    if (figcaption) {
      // Find the title (h3)
      let title = figcaption.querySelector('h3');
      // Find all paragraphs and divs for description/extra
      let descNodes = [];
      // All direct children after h3 (if present)
      if (title) {
        let foundTitle = false;
        for (const node of figcaption.childNodes) {
          if (node.nodeType === 1 && node.tagName === 'A' && node.querySelector('h3')) {
            foundTitle = true;
            continue;
          }
          if (foundTitle) {
            if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'DIV')) {
              if (node.textContent.trim().length > 0) descNodes.push(node);
            }
          }
        }
      } else {
        // No h3, just collect all non-empty p/div
        descNodes = Array.from(figcaption.querySelectorAll('p,div')).filter(n => n.textContent.trim().length > 0);
      }
      // Compose cell content
      if (title) textCellContent.push(title);
      descNodes.forEach(n => textCellContent.push(n));
    }

    // Defensive: if no text, fallback to alt
    if (textCellContent.length === 0 && img.alt) {
      const p = document.createElement('p');
      p.textContent = img.alt;
      textCellContent.push(p);
    }

    // Add row: [image, text]
    rows.push([img, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
