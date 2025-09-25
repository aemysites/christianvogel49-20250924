/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all recipe cards
  function getRecipeCards() {
    const productList = element.querySelector('.list-of-products');
    if (!productList) return [];
    return Array.from(productList.querySelectorAll('article.wrapper'));
  }

  // Helper to extract image from a card
  function getCardImage(card) {
    const imgContainer = card.querySelector('.plp_recipe__img');
    if (!imgContainer) return null;
    // Use the first non-decorative img
    const img = imgContainer.querySelector('img');
    return img || null;
  }

  // Helper to extract title from a card
  function getCardTitle(card) {
    const title = card.querySelector('h2.product-title');
    if (!title) return null;
    const heading = document.createElement('strong');
    heading.textContent = title.textContent.trim();
    return heading;
  }

  // Helper to extract description (try to get from alt text, fallback to title if needed)
  function getCardDescription(card) {
    // Try to get the description from alt text if available
    const img = getCardImage(card);
    if (img && img.alt) {
      const altText = img.alt.trim();
      const title = card.querySelector('h2.product-title');
      if (title && altText !== title.textContent.trim()) {
        return document.createTextNode(altText);
      }
    }
    // Fallback: use the title if no alt text
    const title = card.querySelector('h2.product-title');
    if (title) {
      return document.createTextNode(title.textContent.trim());
    }
    return null;
  }

  // Helper to extract time/difficulty info from footer
  function getCardFooterInfo(card) {
    const footer = card.querySelector('.plp_recipe__footer');
    if (footer) {
      // Get all .d-inline-block elements (time, difficulty)
      const infoBlocks = Array.from(footer.querySelectorAll('.col-9 .d-inline-block'));
      let infoText = '';
      infoBlocks.forEach(block => {
        let text = block.textContent.replace(/\s+/g, ' ').trim();
        if (text) {
          infoText += (infoText ? ' ' : '') + text;
        }
      });
      if (infoText) {
        return document.createTextNode(infoText);
      }
    }
    return null;
  }

  // Helper to extract call-to-action (if present)
  function getCardCTA(card) {
    const link = card.querySelector('a[href]');
    if (!link) return null;
    const cta = document.createElement('a');
    cta.href = link.href;
    cta.textContent = 'Več';
    return cta;
  }

  // Build the table rows
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  const cards = getRecipeCards();
  cards.forEach(card => {
    const img = getCardImage(card);
    const textContent = [];
    const title = getCardTitle(card);
    if (title) textContent.push(title);
    const desc = getCardDescription(card);
    if (desc) textContent.push(document.createElement('br'), desc);
    const footerInfo = getCardFooterInfo(card);
    if (footerInfo) textContent.push(document.createElement('br'), footerInfo);
    const cta = getCardCTA(card);
    if (cta) textContent.push(document.createElement('br'), cta);

    // Ensure all text content is included
    rows.push([
      img ? img : '',
      textContent.length > 0 ? textContent : ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
