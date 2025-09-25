/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all card items from the gallery block
  function extractGalleryCards(gallery) {
    const wrappers = gallery.querySelectorAll('.wrapper');
    const cards = [];
    wrappers.forEach((wrapper) => {
      const item = wrapper.querySelector('.item');
      if (!item) return;
      const figure = item.querySelector('figure');
      if (!figure) return;
      const img = figure.querySelector('img');
      // Try to get the most complete text: prefer figcaption div, fallback to all figcaption content
      let captionContent = '';
      const figcaption = figure.querySelector('figcaption');
      if (figcaption) {
        const captionDiv = figcaption.querySelector('div');
        if (captionDiv && captionDiv.textContent.trim()) {
          captionContent = captionDiv.innerHTML;
        } else if (figcaption.textContent.trim()) {
          captionContent = figcaption.innerHTML;
        }
      }
      // Only add cards with both image and non-empty caption
      if (img && captionContent.trim()) {
        // Create a wrapper div for the text content (preserves formatting)
        const textDiv = document.createElement('div');
        textDiv.innerHTML = captionContent;
        cards.push([img, textDiv]);
      }
    });
    return cards;
  }

  // Find all E12-grid-gallery blocks
  const galleries = element.querySelectorAll('.E12-grid-gallery');
  const cardsRows = [];
  galleries.forEach((galleryBlock) => {
    const gallery = galleryBlock.querySelector('.gallery');
    if (gallery) {
      const cardRows = extractGalleryCards(gallery);
      cardsRows.push(...cardRows);
    }
  });

  // Only proceed if we have at least one card
  if (cardsRows.length === 0) return;

  // Table header
  const headerRow = ['Cards (cards40)'];
  const tableRows = [headerRow, ...cardsRows];

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
