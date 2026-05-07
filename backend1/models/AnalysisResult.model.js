import { DataTypes } from "sequelize";

const AnalysisResultModel = (sequelize) => {
    return sequelize.define("AnalysisResult", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        assignment_id: DataTypes.INTEGER,

        category: DataTypes.STRING,
        difficulty: DataTypes.STRING,

        phases: DataTypes.JSON,
        diagrams: DataTypes.JSON,
        pitfalls: DataTypes.JSON,
        concepts: DataTypes.JSON,

        raw_response: DataTypes.TEXT,

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "analysis_results",
        timestamps: false,
    });
};

export default AnalysisResultModel;