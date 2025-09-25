/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find the gallery container
  const gallery = element.querySelector('.gallery');
  if (!gallery) return;

  // Each card is inside a .wrapper > .item
  const wrappers = gallery.querySelectorAll(':scope > .wrapper');

  wrappers.forEach(wrapper => {
    const item = wrapper.querySelector(':scope > .item');
    if (!item) return;
    const figure = item.querySelector('figure');
    if (!figure) return;
    const img = figure.querySelector('img');
    if (!img) return;

    // For this source HTML, there is no figcaption or text in the cards, so use the alt attribute as text content
    const altText = img.getAttribute('alt') || '';
    const textCell = document.createElement('p');
    textCell.textContent = altText;

    rows.push([img, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
