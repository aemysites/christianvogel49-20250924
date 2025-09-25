/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the required header row
  const headerRow = ['Cards (cards49)'];
  const rows = [headerRow];

  // Defensive: get all immediate wrappers containing cards
  const wrappers = element.querySelectorAll(':scope .gallery .wrapper');

  wrappers.forEach((wrapper) => {
    // Each wrapper contains one card
    // Defensive: find the .item inside this wrapper
    const item = wrapper.querySelector('.item');
    if (!item) return;

    // Find the figure (contains image and caption)
    const figure = item.querySelector('figure');
    if (!figure) return;

    // Find the image (mandatory)
    const imgLink = figure.querySelector('a');
    const img = imgLink ? imgLink.querySelector('img') : null;
    // Defensive: ensure image exists
    if (!img) return;

    // Find the figcaption (contains title link and heading)
    const figcaption = figure.querySelector('figcaption');
    let textCellContent = [];
    if (figcaption) {
      // Use the <a> inside figcaption (contains <h3> title)
      const captionLink = figcaption.querySelector('a');
      if (captionLink) {
        // If the link contains an <h3>, use it as the title
        const h3 = captionLink.querySelector('h3');
        if (h3) {
          textCellContent.push(h3);
        }
        // If the link has text outside <h3>, add it
        if (captionLink.childNodes.length > 1) {
          captionLink.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const span = document.createElement('span');
              span.textContent = node.textContent.trim();
              textCellContent.push(span);
            }
          });
        }
      }
    }
    // If no text content found, fallback to alt text
    if (textCellContent.length === 0 && img.alt) {
      const altSpan = document.createElement('span');
      altSpan.textContent = img.alt;
      textCellContent.push(altSpan);
    }

    // Build the row: [image, text content]
    rows.push([img, textCellContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
