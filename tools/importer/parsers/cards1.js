/* global WebImporter */
export default function parse(element, { document }) {
  // Find the gallery root
  const gallery = element.querySelector('.gallery');
  if (!gallery) return;

  // Get all wrappers that contain visible items with images
  const wrappers = Array.from(gallery.querySelectorAll(':scope > .wrapper'));
  const cardRows = wrappers.map(wrapper => {
    const item = wrapper.querySelector('.item');
    if (!item || item.classList.contains('d-none')) return null;
    const figure = item.querySelector('figure');
    if (!figure) return null;
    const img = figure.querySelector('img');
    if (!img || !img.src) return null;
    // Use the actual <img> element reference
    // For text, use figcaption if present (and not empty), else fallback to figure
    let textCell = null;
    const figcaption = figure.querySelector('figcaption');
    if (figcaption && figcaption.textContent.trim().length > 0) {
      textCell = figcaption;
    } else {
      textCell = figure;
    }
    return [img, textCell];
  }).filter(row => row !== null);

  // Always use the required header
  const headerRow = ['Cards (cards1)'];
  const tableRows = [headerRow, ...cardRows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
