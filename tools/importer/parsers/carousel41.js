/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container in the Experience Fragment
  const carouselContainer = element.querySelector('.E14-carousel-container');
  if (!carouselContainer) return;

  // Find the carousel block inside the container
  const carouselBlock = carouselContainer.querySelector('.component_carousel');
  if (!carouselBlock) return;

  // Find all carousel slides (articles)
  const slideArticles = carouselBlock.querySelectorAll('.at-carousel-item_grp');

  // Prepare table rows
  const headerRow = ['Carousel (carousel41)'];
  const rows = [headerRow];

  // For each slide, extract image and text content
  slideArticles.forEach((article) => {
    // Find the image (first img inside .plp_recipe__img)
    let imgEl = article.querySelector('.plp_recipe__img img');
    // Defensive: if not found, fallback to any img in article
    if (!imgEl) {
      imgEl = article.querySelector('img');
    }

    // Find the text content (title)
    const title = article.querySelector('.product-title');
    // Optionally, add time and difficulty info from the footer
    const footer = article.querySelector('.plp_recipe__footer');
    let metaDiv = null;
    if (footer) {
      // Collect all meta info (time, difficulty) as a div
      metaDiv = document.createElement('div');
      // Time
      const timeBlock = footer.querySelector('[aria-label^="Skupni čas"]');
      if (timeBlock) {
        metaDiv.appendChild(timeBlock.cloneNode(true));
      }
      // Difficulty (all .d-inline-block after the time)
      const difficultyBlocks = footer.querySelectorAll('.d-inline-block:not([aria-label^="Skupni čas"])');
      difficultyBlocks.forEach((block) => {
        metaDiv.appendChild(block.cloneNode(true));
      });
    }

    // Compose text cell content
    const textCell = [];
    if (title) textCell.push(title);
    if (metaDiv && metaDiv.childNodes.length > 0) textCell.push(metaDiv);

    // Add row: [image, text]
    rows.push([
      imgEl || '',
      textCell.length > 0 ? textCell : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original carousel container with the block table
  carouselContainer.replaceWith(block);
}
