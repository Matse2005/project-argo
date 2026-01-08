const fs = require("fs");
const { execSync } = require("child_process");

const timestamp = new Date().toISOString();
const appFile = "src/app.js";
const testFile = "test/app.test.js"; // adjust if needed
const branches = ["main", "dev", "qa", "rollout"];

// Replace timestamp in a file
function updateFile(file) {
  if (!fs.existsSync(file)) {
    console.log(`File not found, skipping: ${file}`);
    return;
  }

  let content = fs.readFileSync(file, "utf-8");
  content = content.replace(
    /"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z"/,
    `"${timestamp}"`
  );
  fs.writeFileSync(file, content, "utf-8");
  console.log(`Updated timestamp in ${file}`);
}

branches.forEach((branch) => {
  try {
    // Checkout branch
    execSync(`git checkout ${branch}`);
    execSync("git pull");

    // Update files
    updateFile(appFile);
    updateFile(testFile);

    // Commit & push
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

console.log("All branches updated. Timestamp:", timestamp);
