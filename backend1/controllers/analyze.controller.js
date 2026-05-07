import db from "../models/Index.js";
import { analyzeService } from "../services/analysis.service.js";

const { Assignment, AnalysisResult } = db;

export const analyzeController = async (req, res) => {
    try {
        let text = req.body.prompt || "";
        let inputType = "text";

        const file = req.file;

        if (file) {
            if (file.mimetype === "application/pdf") {
                inputType = "pdf";

                // ❌ no parsing
                text += "\n[PDF uploaded - content not extracted]";
            }

            if (file.mimetype.startsWith("image")) {
                inputType = "image";
            }
        }

        const assignment = await Assignment.create({
            prompt_text: text,
            input_type: inputType,
        });

        const result = await analyzeService({ text, file });

        const saved = await AnalysisResult.create({
            assignment_id: assignment.id,
            category: result.category,
            difficulty: result.difficulty,
            phases: result.phases,
            diagrams: result.diagrams,
            pitfalls: result.pitfalls,
            concepts: result.concepts,
            raw_response: JSON.stringify(result),
        });

        return res.json({
            success: true,
            data: saved,
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getHistory = async (req, res) => {
    const data = await AnalysisResult.findAll();
    res.json({ success: true, data });
};

export const getAnalysis = async (req, res) => {
    const data = await AnalysisResult.findByPk(req.params.id);
    res.json({ success: true, data });
};