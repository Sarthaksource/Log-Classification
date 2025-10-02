const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const fileLabel = document.getElementById('file-label');
const spinner = document.getElementById('spinner');
const tableContainer = document.getElementById('table-container');
const downloadLink = document.getElementById('download-link');

fileInput.addEventListener('change', () => {
  fileLabel.textContent = fileInput.files.length > 0 
    ? `Selected: ${fileInput.files[0].name}` 
    : 'Click to choose a .csv file or drag it here.';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  spinner.style.display = 'block';
  tableContainer.innerHTML = "";
  downloadLink.style.display = 'none';

  try {
    const response = await fetch('/classify-csv/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const text = await blob.text();

    // Parse CSV properly (handles quotes, commas inside text, etc.)
    const parsed = Papa.parse(text, { header: true });

    renderTable(parsed.data);

    // Prepare download link
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'classified_logs.csv';
    downloadLink.style.display = 'inline-block';

  } catch (error) {
    alert(`An error occurred: ${error.message}`);
    console.error('Error:', error);
  } finally {
    spinner.style.display = 'none';
  }
});

function renderTable(data) {
  if (!data || data.length === 0) {
    tableContainer.innerHTML = "<p>No data found in CSV.</p>";
    return;
  }

  let html = "<table><thead><tr>";
  Object.keys(data[0]).forEach(col => {
    html += `<th>${col}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    Object.values(row).forEach(val => {
      html += `<td>${val ?? ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  tableContainer.innerHTML = html;
}