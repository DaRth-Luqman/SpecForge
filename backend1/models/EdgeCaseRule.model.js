import { DataTypes } from "sequelize";

const EdgeCaseRuleModel = (sequelize) => {
    return sequelize.define("EdgeCaseRule", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

        domain: DataTypes.STRING,
        keyword: DataTypes.STRING,
        warning: DataTypes.TEXT,

        severity: {
            type: DataTypes.ENUM("low", "medium", "high"),
            defaultValue: "medium",
        },
    }, {
        tableName: "edge_case_rules",
        timestamps: false,
    });
};

export default EdgeCaseRuleModel;