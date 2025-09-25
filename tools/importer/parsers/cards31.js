/* global WebImporter */
export default function parse(element, { document }) {
  // Find the product list container
  const productList = document.querySelector('.list-of-products');
  if (!productList) return;

  // Find all product cards (article.wrapper)
  const articles = productList.querySelectorAll('article.wrapper');

  // Build the table rows
  const rows = [];
  // Header row (CRITICAL: must be exactly this)
  const headerRow = ['Cards (cards31)'];
  rows.push(headerRow);

  // Card rows
  articles.forEach((article) => {
    // Find the image (first img inside the article)
    const img = article.querySelector('img');
    // Find the title (h2 with class 'product-title')
    const title = article.querySelector('h2.product-title');
    // Find the price (span.price)
    const price = article.querySelector('.price .price');
    // Find the additional info (span.additional-product-info)
    const additionalInfo = article.querySelector('.additional-product-info');
    // Find the CTA (a with class 'plp-more-info-btn')
    const cta = article.querySelector('a.plp-more-info-btn');

    // Compose the text cell
    const textParts = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textParts.push(strong);
    }
    if (price) {
      const priceDiv = document.createElement('div');
      priceDiv.textContent = price.textContent.trim();
      textParts.push(priceDiv);
    }
    if (additionalInfo && additionalInfo.textContent.trim()) {
      const infoDiv = document.createElement('div');
      infoDiv.textContent = additionalInfo.textContent.trim();
      textParts.push(infoDiv);
    }
    if (cta) {
      textParts.push(document.createElement('br'));
      textParts.push(cta);
    }
    // Only add if image and at least one text part
    if (img && textParts.length) {
      rows.push([img, textParts]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
