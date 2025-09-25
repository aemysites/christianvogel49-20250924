/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find a background image (none in this HTML, but structure allows for future extensibility)
  function extractBackgroundImage(el) {
    // Check for inline background-image style
    const bg = el.style && el.style.backgroundImage;
    if (bg && bg.startsWith('url(')) {
      const url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      if (url) {
        const img = document.createElement('img');
        img.src = url;
        return img;
      }
    }
    // Check for <img> as direct child (not present here)
    const img = el.querySelector('img');
    if (img) return img;
    return null;
  }

  // Find the content container (where the heading and form live)
  let contentContainer = element;
  // Defensive: find the deepest child with class 'container-element' if present
  const containerEl = element.querySelector('.container-element');
  if (containerEl) contentContainer = containerEl;

  // Extract the heading (optional)
  const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');

  // Extract the form (optional, used as a call-to-action)
  const form = contentContainer.querySelector('form');

  // Compose the content cell (row 3): heading and form, if present
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (form) contentCell.push(form);

  // Compose the table rows
  const headerRow = ['Hero (hero23)'];

  // Row 2: background image (none in this HTML, so leave cell empty)
  const bgImg = extractBackgroundImage(element);
  const bgImgRow = [bgImg ? bgImg : ''];

  // Row 3: content (heading, form)
  const contentRow = [contentCell.length ? contentCell : ''];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgImgRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
