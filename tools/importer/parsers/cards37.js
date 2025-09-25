/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from the product list
  function extractCards(container) {
    const cards = [];
    // Each card is an article.wrapper
    const articles = container.querySelectorAll('article.wrapper');
    articles.forEach((article) => {
      // Find image (first img inside .plp_recipe__img)
      let img = article.querySelector('.plp_recipe__img img');
      if (!img) img = article.querySelector('img');

      // Find title (h2 inside the card)
      const title = article.querySelector('h2');
      let heading = null;
      if (title) {
        heading = document.createElement('strong');
        heading.textContent = title.textContent.trim();
      }

      // Find time and difficulty (in .plp_recipe__footer)
      const footer = article.querySelector('.plp_recipe__footer');
      let description = '';
      if (footer) {
        // Time
        const timeBlock = footer.querySelector('[aria-label^="Skupni čas"]');
        if (timeBlock) {
          description += timeBlock.textContent.replace(/Skupni čas/, '').trim();
        }
        // Difficulty
        const srOnly = footer.querySelector('.sr-only:last-of-type');
        if (srOnly) {
          description += description ? ' · ' : '';
          description += srOnly.textContent.trim();
        }
      }

      // Add more text from the card if available (e.g. description in .plp_recipe__content or link)
      let extraText = '';
      const content = article.querySelector('.plp_recipe__content');
      if (content && content.textContent.trim()) {
        extraText = content.textContent.trim();
      }
      // Also try to get alt text from image if no description
      if (!description && img && img.alt) {
        description = img.alt;
      }

      // Compose text cell
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) {
        const descP = document.createElement('p');
        descP.textContent = description;
        textCell.push(descP);
      }
      if (extraText) {
        const extraP = document.createElement('p');
        extraP.textContent = extraText;
        textCell.push(extraP);
      }
      // Add row: [image, text]
      cards.push([img, textCell]);
    });
    return cards;
  }

  // Find the product list container
  const productList = element.querySelector('.list-of-products');
  if (!productList) return;

  // Build table rows
  const headerRow = ['Cards (cards37)'];
  const cardRows = extractCards(productList);
  const rows = [headerRow, ...cardRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
