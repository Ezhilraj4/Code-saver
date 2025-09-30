const SNIPPETS_FILE = 'snippets.json';
const container = document.getElementById('snippets-container');

// Function to safely escape HTML special characters
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

async function loadAndDisplaySnippets() {
    try {
        // 1. Fetch the JSON file from the GitHub Pages server
        const response = await fetch(SNIPPETS_FILE);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${SNIPPETS_FILE}: ${response.statusText}`);
        }

        const snippets = await response.json();
        
        // Clear loading message
        container.innerHTML = ''; 

        if (snippets.length === 0) {
            container.innerHTML = '<p>No snippets saved yet. Edit the snippets.json file!</p>';
            return;
        }

        // 2. Loop through each snippet and create the HTML structure
        snippets.forEach(snippet => {
            const card = document.createElement('div');
            card.className = 'snippet-card';

            const title = document.createElement('h2');
            title.textContent = snippet.title;
            card.appendChild(title);

            // Create the Prism.js code block
            const pre = document.createElement('pre');
            // The class must be in the format 'language-XXX' for Prism to work
            pre.className = `language-${snippet.language}`;

            const code = document.createElement('code');
            code.className = `language-${snippet.language}`;

            // Use the escapeHTML function to safely insert the code
            code.innerHTML = escapeHTML(snippet.code);
            
            pre.appendChild(code);
            card.appendChild(pre);
            container.appendChild(card);
        });

        // 3. Tell Prism.js to highlight the newly added code blocks
        Prism.highlightAll();

    } catch (error) {
        console.error("Error loading snippets:", error);
        container.innerHTML = `<p style="color: red;">Error loading snippets. Check the console for details. (Did you commit the snippets.json file?)</p>`;
    }
}

// Run the function when the page loads
loadAndDisplaySnippets();
