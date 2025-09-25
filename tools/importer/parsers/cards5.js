/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text content from a recipe card
  function extractCardInfo(article) {
    // Find the image (first img inside the card)
    let img = article.querySelector('img');
    // Find the title (first h2 inside the card)
    let title = article.querySelector('h2');
    // Find description: get all text nodes after the h2 until the next block element or end
    let description = '';
    if (title) {
      let node = title.nextSibling;
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          description += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.match(/^(DIV|H2|A|IMG|BUTTON|SPAN)$/i)) {
          break;
        }
        node = node.nextSibling;
      }
      description = description.trim();
    }
    // Compose text cell: if title exists, use as heading (strong), then description
    let textContent = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textContent.appendChild(strong);
    }
    if (description) {
      textContent.appendChild(document.createElement('br'));
      textContent.append(description);
    }
    // If no description, try to get time/difficulty from footer
    if (!description) {
      const footer = article.querySelector('.plp_recipe__footer');
      if (footer) {
        // Get all visible text in the footer except wishlist button
        let footerText = '';
        footer.querySelectorAll('button,svg').forEach(el => el.remove());
        footerText = footer.textContent.replace(/\s+/g, ' ').trim();
        if (footerText) {
          textContent.appendChild(document.createElement('br'));
          textContent.append(footerText);
        }
      }
    }
    return [img, textContent];
  }

  // Find the main product list container
  const productList = element.querySelector('.list-of-products');
  if (!productList) return;

  // Get all recipe cards (articles)
  const articles = productList.querySelectorAll('article.wrapper');
  if (!articles.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards5)']);

  // Each card row: [image, text]
  articles.forEach((article) => {
    const [img, textContent] = extractCardInfo(article);
    // Only include rows with an image and text
    if (img && textContent) {
      rows.push([img, textContent]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
