import db from "./models/Index.js";

async function check() {
  try {
    const last = await db.AnalysisResult.findOne({
      order: [['id', 'DESC']]
    });
    console.log("LAST RESULT:");
    console.log(JSON.stringify(last, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
