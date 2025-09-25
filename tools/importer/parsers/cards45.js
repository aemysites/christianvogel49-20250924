/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must be exactly as specified
  const headerRow = ['Cards (cards45)'];
  const rows = [headerRow];

  // Defensive: find the gallery container
  const gallery = element.querySelector('.gallery');
  if (!gallery) return;

  // Get all visible card wrappers
  const wrappers = Array.from(gallery.querySelectorAll(':scope > .wrapper'));

  wrappers.forEach(wrapper => {
    // Find the .item inside each wrapper
    const item = wrapper.querySelector('.item');
    if (!item) return;

    // Find the figure
    const figure = item.querySelector('figure');
    if (!figure) return;

    // Get image (first <img> in figure)
    const img = figure.querySelector('img');
    // Defensive: skip if no image
    if (!img || img.classList.contains('d-none')) return;

    // Get figcaption (title link)
    const figcaption = figure.querySelector('figcaption');
    let titleEl = null;
    if (figcaption) {
      // Use h3 if present
      titleEl = figcaption.querySelector('h3');
    }

    // Build text cell: title as heading, optional link
    let textCell = [];
    if (titleEl) {
      // If the h3 is wrapped in a link, use the link
      const titleLink = titleEl.closest('a');
      if (titleLink) {
        // Use the link with h3 inside
        textCell.push(titleLink);
      } else {
        textCell.push(titleEl);
      }
    }
    // No description in source, so only title

    // Add row: [image, text]
    rows.push([img, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
