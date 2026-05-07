import { DataTypes } from "sequelize";

const AssignmentFileModel = (sequelize) => {
  return sequelize.define("AssignmentFile", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    assignment_id: { type: DataTypes.INTEGER },

    file_name: DataTypes.STRING,
    file_type: DataTypes.STRING,
    mime_type: DataTypes.STRING,

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "assignment_files",
    timestamps: false,
  });
};

export default AssignmentFileModel;