import { DataTypes } from "sequelize";

const AssignmentModel = (sequelize) => {
  return sequelize.define("Assignment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    prompt_text: { type: DataTypes.TEXT },

    input_type: {
      type: DataTypes.ENUM("text", "pdf", "image"),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "assignments",
    timestamps: false,
  });
};

export default AssignmentModel;