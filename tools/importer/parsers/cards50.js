/* global WebImporter */
export default function parse(element, { document }) {
  // Find the product grid container
  const grid = element.querySelector('.list-of-products');
  if (!grid) return;

  // Extract all cards from the grid
  const cards = Array.from(grid.querySelectorAll('article.wrapper'));

  // Compose the table rows
  const headerRow = ['Cards (cards50)'];
  const rows = cards.map(card => {
    // Image: first <img> in the card
    const img = card.querySelector('img');
    // Title: <h2> in the card
    const title = card.querySelector('h2');
    // Description: get all text content from the card (excluding title)
    let desc = '';
    // Try to get description from .plp_recipe__footer .col-9
    const footer = card.querySelector('.plp_recipe__footer');
    if (footer) {
      const col9 = footer.querySelector('.col-9');
      if (col9) {
        // Get all text content, excluding images and sr-only
        desc = Array.from(col9.querySelectorAll('*'))
          .filter(el => !el.matches('img, .sr-only'))
          .map(el => el.textContent.trim())
          .filter(Boolean)
          .join(' ');
        // If nothing, try to get aria-label
        if (!desc) {
          const timeDiv = col9.querySelector('[aria-label]');
          if (timeDiv) desc = timeDiv.getAttribute('aria-label');
        }
      }
    }
    // Fallback: if no description found, try to get from .product-title's next sibling
    if (!desc && title && title.nextSibling && title.nextSibling.textContent) {
      desc = title.nextSibling.textContent.trim();
    }
    // Compose the text cell
    const textCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.appendChild(strong);
    }
    if (desc) {
      textCell.appendChild(document.createElement('br'));
      textCell.append(desc);
    }
    // Only add row if both image and title exist
    if (img && title) {
      return [img, textCell];
    }
    return null;
  }).filter(Boolean);

  // Only output if there are valid cards
  if (rows.length === 0) return;

  // Build the table
  const table = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
