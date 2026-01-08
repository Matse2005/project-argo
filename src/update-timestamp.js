const fs = require("fs");
const { execSync } = require("child_process");

const timestamp = new Date().toISOString();
const appFile = "src/app.js";
const testFile = "test/app.test.js"; // adjust if your test path is different

// Replace timestamp in a file
function updateFile(file) {
  if (!fs.existsSync(file)) {
    console.log(`File not found, skipping: ${file}`);
    return;
  }

  let content = fs.readFileSync(file, "utf-8");
  // Matches any ISO timestamp inside double quotes
  content = content.replace(
    /"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z"/,
    `"${timestamp}"`
  );
  fs.writeFileSync(file, content, "utf-8");
  console.log(`Updated timestamp in ${file}`);
}

// Update both files
updateFile(appFile);
updateFile(testFile);

// Commit & push to multiple branches
const branches = ["main", "dev", "qa", "rollout"];

branches.forEach((branch) => {
  try {
    // Make sure we don't have uncommitted changes blocking the checkout
    execSync("git add -A");
    execSync(
      `git commit -m "Auto-update timestamp to ${timestamp}" || echo "Nothing to commit"`
    );

    // Checkout branch and pull latest
    execSync(`git checkout ${branch}`);
    execSync("git pull");

    // Apply changes again (in case different branches have different content)
    updateFile(appFile);
    updateFile(testFile);

    execSync("git add -A");
    execSync(
      `git commit -m "Auto-update timestamp to ${timestamp}" || echo "Nothing to commit"`
    );
    execSync(`git push origin ${branch}`);

    console.log(`✅ Updated and pushed branch ${branch}`);
  } catch (err) {
    console.error(`❌ Failed on branch ${branch}:`, err.message);
  }
});

console.log("All done. Timestamp:", timestamp);
