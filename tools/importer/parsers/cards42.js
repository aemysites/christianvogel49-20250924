/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards42)'];
  const rows = [headerRow];

  // Find the main gallery container
  const gallery = element.querySelector('.gallery');
  if (!gallery) {
    // Defensive: fallback if structure changes
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Each card is inside a .wrapper > .item > figure
  const wrappers = gallery.querySelectorAll(':scope > .wrapper');
  wrappers.forEach(wrapper => {
    // Defensive: skip empty wrappers
    const item = wrapper.querySelector(':scope > .item');
    if (!item || item.classList.contains('d-none')) return;
    const figure = item.querySelector('figure');
    if (!figure) return;

    // Find image (mandatory)
    let img = figure.querySelector('img');
    // Defensive: skip cards without a visible image
    if (!img || img.classList.contains('d-none')) return;

    // Find title (h3)
    let title = figure.querySelector('figcaption h3');
    // Defensive: fallback to figcaption text if no h3
    let textCellContent = [];
    if (title) {
      // Use a heading element
      textCellContent.push(title);
    } else {
      // Fallback: use figcaption text
      const figcaption = figure.querySelector('figcaption');
      if (figcaption && figcaption.textContent.trim()) {
        textCellContent.push(document.createTextNode(figcaption.textContent.trim()));
      }
    }

    // If the title is wrapped in a link, preserve the link
    const titleLink = figure.querySelector('figcaption a');
    if (titleLink && title && title.parentElement === titleLink) {
      // Replace the heading with the link-wrapped heading
      textCellContent = [titleLink];
    }

    // Build the row: [image, text content]
    rows.push([img, textCellContent]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
