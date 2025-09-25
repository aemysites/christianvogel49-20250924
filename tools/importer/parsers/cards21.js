/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all recipe cards
  function getCards() {
    const productList = element.querySelector('.list-of-products');
    if (!productList) return [];
    return Array.from(productList.querySelectorAll('article.wrapper'));
  }

  // Helper to extract image from card
  function getCardImage(card) {
    const imgWrap = card.querySelector('.plp_recipe__img');
    if (!imgWrap) return null;
    const img = imgWrap.querySelector('img');
    return img || null;
  }

  // Helper to extract title from card
  function getCardTitle(card) {
    const title = card.querySelector('h2.product-title');
    return title ? title.textContent.trim() : '';
  }

  // Helper to extract description from card (try to get extra info from footer)
  function getCardDescription(card) {
    // Try to get time and difficulty from the footer
    const footer = card.querySelector('.plp_recipe__footer');
    let desc = '';
    if (footer) {
      // Get time
      const timeBlock = footer.querySelector('[aria-label*="Skupni čas"]');
      if (timeBlock) {
        const timeText = timeBlock.textContent.replace(/Skupni čas/, '').trim();
        if (timeText) desc += timeText;
      }
      // Get difficulty (from sr-only span after images)
      const diffBlock = footer.querySelector('span.sr-only');
      if (diffBlock) {
        if (desc) desc += ' · ';
        desc += diffBlock.textContent.trim();
      }
    }
    // Try to get main description from the list page (above cards)
    let mainDesc = '';
    const mainDescEl = element.querySelector('.plp_description .text-component p');
    if (mainDescEl) {
      mainDesc = mainDescEl.textContent.trim();
    }
    // If no footer desc, use main desc for all cards
    if (!desc && mainDesc) {
      desc = mainDesc;
    }
    return desc;
  }

  // Helper to extract CTA from card
  function getCardCTA(card) {
    const link = card.querySelector('a[href]');
    if (link) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = 'Več';
      return cta;
    }
    return null;
  }

  // Build the table rows
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  const cards = getCards();
  cards.forEach(card => {
    // First column: image
    const img = getCardImage(card);
    // Second column: text content (title, description, CTA)
    const cellContent = [];
    const title = getCardTitle(card);
    if (title) {
      const heading = document.createElement('h3');
      heading.textContent = title;
      cellContent.push(heading);
    }
    const desc = getCardDescription(card);
    if (desc) {
      const descEl = document.createElement('p');
      descEl.textContent = desc;
      cellContent.push(descEl);
    }
    const cta = getCardCTA(card);
    if (cta) {
      cellContent.push(cta);
    }
    rows.push([
      img ? img : '',
      cellContent.length ? cellContent : ''
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
