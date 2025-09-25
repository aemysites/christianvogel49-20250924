/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .wrapper
  function extractCard(wrapper) {
    // Defensive: find the .item inside the wrapper
    const item = wrapper.querySelector('.item');
    if (!item) return null;
    // Find figure
    const figure = item.querySelector('figure');
    if (!figure) return null;
    // Find image (mandatory)
    const imgLink = figure.querySelector('a');
    let img = null;
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // Find figcaption (may contain link and heading)
    const figcaption = figure.querySelector('figcaption');
    let textContent = null;
    if (figcaption) {
      // If figcaption contains a link, use its children
      const captionLink = figcaption.querySelector('a');
      if (captionLink) {
        // If link contains h3, use h3 as heading
        const heading = captionLink.querySelector('h3');
        if (heading) {
          textContent = heading;
        } else {
          textContent = captionLink;
        }
      } else {
        // Use figcaption itself
        textContent = figcaption;
      }
    }
    // Defensive: fallback to empty if missing
    return [img || document.createTextNode(''), textContent || document.createTextNode('')];
  }

  // Find all card wrappers
  const wrappers = Array.from(element.querySelectorAll('.wrapper'));
  // Only keep wrappers with valid cards
  const cardRows = wrappers
    .map(extractCard)
    .filter(row => row && (row[0] || row[1]));

  // Table header
  const headerRow = ['Cards (cards36)'];
  // Build table data
  const tableData = [headerRow, ...cardRows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  // Replace original element
  element.replaceWith(block);
}
