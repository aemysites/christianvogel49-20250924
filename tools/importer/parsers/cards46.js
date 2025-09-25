/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all cards from the product list
  function extractCards(container) {
    const productList = container.querySelector('.list-of-products');
    if (!productList) return [];
    return Array.from(productList.querySelectorAll('article.wrapper'));
  }

  // Helper to extract card content (image, title, description, cta) from an article
  function extractCardContent(article) {
    // Image: inside .plp_recipe__img img
    const img = article.querySelector('.plp_recipe__img img');
    // Title: inside h2.product-title
    const title = article.querySelector('h2.product-title');
    // Description: try to extract from .plp_recipe__footer (time, difficulty, etc.)
    let description = '';
    const footer = article.querySelector('.plp_recipe__footer');
    if (footer) {
      // Collect all text from the footer except for button text
      // Instead of only d-inline-block, get all visible text except buttons
      let footerText = [];
      footer.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (!node.matches('div.col-3, span.wishlist_tpl, button')) {
            footerText.push(node.textContent.trim());
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) {
            footerText.push(node.textContent.trim());
          }
        }
      });
      description = footerText.filter(Boolean).join(' ');
    }
    // If no description found, fallback to .plp_recipe__content if it has text
    if (!description) {
      const content = article.querySelector('.plp_recipe__content');
      if (content && content.textContent.trim()) {
        description = content.textContent.trim();
      }
    }
    // If still no description, try to get text from the link (sometimes in CTA)
    let cta = '';
    const link = article.querySelector('a[href]');
    if (link && link.textContent.trim() && (!title || link.textContent.trim() !== title.textContent.trim())) {
      cta = link.textContent.trim();
    }
    let textCellContent = [];
    if (title) {
      let strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCellContent.push(strong);
    }
    if (description) {
      let descP = document.createElement('p');
      descP.textContent = description;
      textCellContent.push(descP);
    }
    if (cta) {
      let ctaP = document.createElement('p');
      ctaP.textContent = cta;
      textCellContent.push(ctaP);
    }
    return [img, textCellContent];
  }

  const headerRow = ['Cards (cards46)'];
  const rows = [headerRow];
  const cards = extractCards(element);
  cards.forEach((card) => {
    const [img, textCellContent] = extractCardContent(card);
    if (img && textCellContent.length) {
      rows.push([img, textCellContent]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
