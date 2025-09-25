/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion container
  const accordionRoot = element.querySelector('.js-accordion-identifier');
  if (!accordionRoot) return;

  // Get all accordion items (sections)
  const cards = accordionRoot.querySelectorAll('section.card');

  // Table header row
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // For each accordion item, extract title and content
  cards.forEach((card) => {
    // Defensive: Find header and body
    const header = card.querySelector('.card-header');
    const body = card.querySelector('.card-body');
    if (!header || !body) return;

    // Title: The button text inside header
    const button = header.querySelector('button');
    let titleCell;
    if (button) {
      // Use a <p> for semantic clarity, but preserve any HTML
      const titleP = document.createElement('p');
      titleP.innerHTML = button.innerHTML;
      titleCell = titleP;
    } else {
      // Fallback: use header text
      const titleP = document.createElement('p');
      titleP.textContent = header.textContent.trim();
      titleCell = titleP;
    }

    // Content: Use the card-body element directly
    rows.push([titleCell, body]);
  });

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
