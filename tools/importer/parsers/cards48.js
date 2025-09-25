/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all visible card items
  function getCardItems(el) {
    // Find the gallery container
    const gallery = el.querySelector('.gallery');
    if (!gallery) return [];
    // Get all wrappers (each contains an .item)
    const wrappers = Array.from(gallery.querySelectorAll(':scope > .wrapper'));
    // Only use wrappers with visible items
    return wrappers.map(wrap => wrap.querySelector(':scope > .item'))
      .filter(item => item && !item.classList.contains('d-none'));
  }

  // Helper to extract image and text from a card item
  function extractCardContent(item) {
    // Find figure
    const figure = item.querySelector('figure');
    if (!figure) return [null, null];
    // Find image
    const img = figure.querySelector('img');
    // Find figcaption (all text content)
    const figcaption = figure.querySelector('figcaption');
    // Defensive: if no image or figcaption, skip
    if (!img || !figcaption) return [null, null];
    // Compose text cell: use all figcaption children except empty <p>
    // We'll use a fragment to hold all text blocks
    const frag = document.createDocumentFragment();
    // Only append non-empty and non-whitespace children
    Array.from(figcaption.children).forEach(child => {
      // Ignore empty <p> and empty <div>
      if (child.tagName === 'P' && child.textContent.trim() === '') return;
      if (child.tagName === 'DIV' && child.textContent.replace(/\u00a0/g, '').trim() === '') return;
      frag.appendChild(child.cloneNode(true));
    });
    return [img, frag];
  }

  // Build table rows
  const headerRow = ['Cards (cards48)'];
  const rows = [headerRow];

  // Get all card items
  const cardItems = getCardItems(element);
  cardItems.forEach(item => {
    const [img, textContent] = extractCardContent(item);
    if (img && textContent) {
      rows.push([img, textContent]);
    }
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
