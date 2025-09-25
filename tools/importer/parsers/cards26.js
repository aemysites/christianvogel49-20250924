/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from an <article> element
  function extractCard(article) {
    // Find image (mandatory)
    let img = article.querySelector('img');
    // Find title (h3)
    let title = article.querySelector('h3');
    // Find description (first <p> inside card_text__content)
    let desc = article.querySelector('.card_text__content p');
    // Find CTA (button/link in card_text__footer)
    let cta = article.querySelector('.card_text__footer a');

    // First cell: image element (mandatory)
    const imageCell = img ? img : '';

    // Second cell: text content (title, description, CTA)
    const textContent = [];
    if (title) textContent.push(title);
    if (desc) textContent.push(desc);
    if (cta) textContent.push(cta);

    return [imageCell, textContent];
  }

  // Find all card articles
  // Defensive: find slick-track or list-of-products-carousel, then articles
  let cardArticles = [];
  const slickTrack = element.querySelector('.slick-track');
  if (slickTrack) {
    cardArticles = Array.from(slickTrack.querySelectorAll('article'));
  } else {
    // Fallback: try to find articles anywhere inside element
    cardArticles = Array.from(element.querySelectorAll('article'));
  }

  // Build table rows
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  cardArticles.forEach((article) => {
    rows.push(extractCard(article));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
