import sequelize from "../config/db.js";
import AssignmentModel from "./Assignment.model.js";
import AssignmentFileModel from "./AssignmentFile.model.js";
import AnalysisResultModel from "./AnalysisResult.model.js";
import EdgeCaseRuleModel from "./EdgeCaseRule.model.js";

const db = {};

db.sequelize = sequelize;

db.Assignment = AssignmentModel(sequelize);
db.AssignmentFile = AssignmentFileModel(sequelize);
db.AnalysisResult = AnalysisResultModel(sequelize);
db.EdgeCaseRule = EdgeCaseRuleModel(sequelize);

// relations
db.Assignment.hasMany(db.AssignmentFile, { foreignKey: "assignment_id" });
db.Assignment.hasOne(db.AnalysisResult, { foreignKey: "assignment_id" });

db.AssignmentFile.belongsTo(db.Assignment, { foreignKey: "assignment_id" });
db.AnalysisResult.belongsTo(db.Assignment, { foreignKey: "assignment_id" });

export default db;