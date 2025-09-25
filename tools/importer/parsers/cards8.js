/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Find the gallery container (may be nested)
  const gallery = element.querySelector('.gallery');
  if (!gallery) return;

  // Each card is in a .wrapper > .item
  const wrappers = gallery.querySelectorAll(':scope > .wrapper');

  wrappers.forEach((wrapper) => {
    // Defensive: find the .item inside each .wrapper
    const item = wrapper.querySelector(':scope > .item');
    if (!item) return;

    // Get the image (mandatory)
    const figure = item.querySelector('figure');
    let img = null;
    if (figure) {
      img = figure.querySelector('img');
    }

    // Get all text content from the figure (not just alt)
    let textContent = '';
    // Try to get any visible text in the figure (e.g. captions, spans, etc.)
    if (figure) {
      textContent = figure.textContent.trim();
    }
    // If figure text is empty, fallback to alt
    if (!textContent && img && img.alt) {
      textContent = img.alt;
    }

    // Create a text element for the card text
    let textEl = document.createElement('div');
    textEl.textContent = textContent;

    // Add image and text to the row
    rows.push([
      img || '', // image element (mandatory)
      textEl     // text content element (mandatory)
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
