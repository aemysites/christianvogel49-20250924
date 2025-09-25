/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row inside the container
  const row = element.querySelector(':scope > .row');
  if (!row) return;

  // Find the three columns
  const col1 = row.querySelector('.col-md-3');
  // The mobile description (visible on small screens)
  const col2 = row.querySelector('.col-12.plp_description.d-sm-block');
  // The desktop description (visible on md+ screens)
  const col3 = row.querySelector('.col-md-9.plp_description, .col-lg-9.plp_description');

  // Compose first column: title and count
  let col1Content = [];
  if (col1) {
    // Push all children of col1 to preserve all text and structure
    Array.from(col1.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        col1Content.push(node.cloneNode(true));
      }
    });
  }

  // Compose second column: description (prefer desktop, fallback to mobile)
  let col2Content = [];
  let descriptionParent = col3 || col2;
  if (descriptionParent) {
    // Instead of only paragraphs, grab all content inside the description parent
    Array.from(descriptionParent.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        col2Content.push(node.cloneNode(true));
      }
    });
  }

  // Only include columns with actual content
  const columnsRow = [];
  if (col1Content.length) columnsRow.push(col1Content);
  if (col2Content.length) columnsRow.push(col2Content);

  // Table header row
  const headerRow = ['Columns block (columns3)'];
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the element with the block
  element.replaceWith(block);
}
