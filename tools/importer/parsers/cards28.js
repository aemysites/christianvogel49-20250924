/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the product cards
  function getProductCards(container) {
    // The products are inside: div.row.list-of-products
    const productList = container.querySelector('.list-of-products');
    if (!productList) return [];
    // Each card is an <article class="wrapper">
    return Array.from(productList.querySelectorAll('article.wrapper'));
  }

  // Helper to extract card content
  function extractCardData(article) {
    // The clickable area is the <a> inside the article
    const link = article.querySelector('a');
    // The image is inside a <img> inside the link
    const img = link ? link.querySelector('img') : null;
    // The title is the <h2> inside the link
    const title = link ? link.querySelector('h2') : null;
    // The price is inside <span class="price at-product-price_lbl">
    const price = link ? link.querySelector('.price.at-product-price_lbl') : null;
    // The additional info is inside <span class="additional-product-info">
    const additionalInfo = link ? link.querySelector('.additional-product-info') : null;
    // The CTA is the 'Več informacij' link in the footer
    let cta = null;
    const ctaFooter = article.querySelector('.plp_product__footer a');
    if (ctaFooter) {
      cta = ctaFooter;
    }

    // Compose the text cell
    const textCell = document.createElement('div');
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent.trim();
      textCell.appendChild(h);
      textCell.appendChild(document.createElement('br'));
    }
    if (price) {
      const priceSpan = document.createElement('span');
      priceSpan.textContent = price.textContent.trim();
      textCell.appendChild(priceSpan);
      textCell.appendChild(document.createElement('br'));
    }
    if (additionalInfo) {
      const infoSpan = document.createElement('span');
      infoSpan.textContent = additionalInfo.textContent.trim();
      textCell.appendChild(infoSpan);
      textCell.appendChild(document.createElement('br'));
    }
    // Remove trailing <br>
    while (textCell.lastChild && textCell.lastChild.tagName === 'BR') {
      textCell.removeChild(textCell.lastChild);
    }
    // Add CTA at the end
    if (cta) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(cta);
    }

    return [img, textCell];
  }

  // Find the product list container
  // The main container is the one with class 'container-full' and a child with class 'list-of-products'
  let container = element;
  if (!container.querySelector('.list-of-products')) {
    container = element.querySelector('.container-full, .container-fluid, .row');
  }
  if (!container) {
    // fallback to original element
    container = element;
  }

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards28)'];
  rows.push(headerRow);

  // Extract product cards
  const cards = getProductCards(container);
  cards.forEach((article) => {
    const [img, textCell] = extractCardData(article);
    // Only add cards with an image and text
    if (img && textCell && textCell.textContent.trim()) {
      rows.push([img, textCell]);
    }
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
