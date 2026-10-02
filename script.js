// ---------- Load SQLite Database ----------
async function loadDatabase() {
  const dbOutput = document.getElementById('db-output');
  try {
    // Initialize SQL.js
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    // Fetch the .db file as an ArrayBuffer
    const response = await fetch('data.db');
    const buffer = await response.arrayBuffer();

    // Load the database into SQL.js
    const db = new SQL.Database(new Uint8Array(buffer));

    // Run a query
    const result = db.exec("SELECT * FROM users");

    if (result.length === 0) {
      dbOutput.textContent = "No users found.";
      return;
    }

    // Format and display results
    const columns = result[0].columns;
    const values = result[0].values;

    let html = '<ul>';
    values.forEach(row => {
      html += '<li>';
      columns.forEach((col, i) => {
        html += `<strong>${col}:</strong> ${row[i]} `;
      });
      html += '</li>';
    });
    html += '</ul>';
    dbOutput.innerHTML = html;

  } catch (err) {
    console.error(err);
    dbOutput.innerHTML = `<p class="error">Error loading database: ${err.message}</p>`;
  }
}

// ---------- Load JSON Data ----------
async function loadJSON() {
  const jsonOutput = document.getElementById('json-output');
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to fetch JSON');
    const data = await response.json();

    let html = '<ul>';
    data.products.forEach(item => {
      html += `<li><strong>${item.name}</strong> – $${item.price}</li>`;
    });
    html += '</ul>';
    jsonOutput.innerHTML = html;

  } catch (err) {
    console.error(err);
    jsonOutput.innerHTML = `<p class="error">Error loading JSON: ${err.message}</p>`;
  }
}

// ---------- Run on page load ----------
window.addEventListener('DOMContentLoaded', () => {
  loadDatabase();
  loadJSON();
});

