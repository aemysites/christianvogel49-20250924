/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child sections with class 'card'
  function getAccordionCards(root) {
    const accordionContainer = root.querySelector('.js-accordion-identifier');
    if (!accordionContainer) return [];
    return Array.from(accordionContainer.querySelectorAll(':scope > section.card'));
  }

  // Helper to extract title and content from a card
  function extractCardRow(card) {
    // Title: button inside card-header
    const header = card.querySelector('.card-header');
    let titleText = '';
    if (header) {
      const btn = header.querySelector('button');
      if (btn) {
        titleText = btn.textContent.trim();
      } else {
        titleText = header.textContent.trim();
      }
    }

    // Content: card-body
    const body = card.querySelector('.card-body');
    let contentEl = null;
    if (body) {
      if (body.children.length === 0) {
        contentEl = document.createTextNode(body.textContent.trim());
      } else {
        // If body contains only paragraphs and links, extract their children
        const children = Array.from(body.childNodes).filter(node => {
          // Only keep elements and text nodes
          return node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE;
        });
        // If only one child, use it directly
        if (children.length === 1) {
          contentEl = children[0].cloneNode(true);
        } else {
          // Otherwise, wrap in a fragment
          const frag = document.createDocumentFragment();
          children.forEach(child => frag.appendChild(child.cloneNode(true)));
          contentEl = frag;
        }
      }
    }
    return [titleText, contentEl];
  }

  // Compose table rows
  const headerRow = ['Accordion (accordion38)'];
  const rows = [headerRow];

  const cards = getAccordionCards(element);
  cards.forEach((card) => {
    const [titleText, contentEl] = extractCardRow(card);
    rows.push([titleText, contentEl]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Ensure header row has exactly one column (no colspan)
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].removeAttribute('colspan');
  }

  // Replace the original element
  element.replaceWith(table);
}
