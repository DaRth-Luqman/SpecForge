import db from "../models/Index.js";
import { analyzeService } from "../services/analysis.service.js";

const { Assignment, AnalysisResult, AssignmentFile } = db;

import { supabase } from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

export const analyzeController = async (req, res) => {
    try {
        let text = req.body.prompt || "";
        let inputType = "text";

        const file = req.file;
        let fileUrl = null;
        let assignmentFileRecord = null;

        const assignment = await Assignment.create({
            prompt_text: text,
            input_type: inputType,
        });

        if (file) {
            if (file.mimetype === "application/pdf") {
                inputType = "pdf";
                text += "\n[PDF uploaded - content not extracted]";
            }
            if (file.mimetype.startsWith("image")) {
                inputType = "image";
            }
            
            // Upload to Supabase
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from("assignments") // make sure you have this bucket created
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                });
                
            if (error) {
                console.error("Supabase Upload Error:", error);
            } else {
                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from("assignments")
                    .getPublicUrl(fileName);
                
                fileUrl = publicUrlData.publicUrl;
                
                assignmentFileRecord = await AssignmentFile.create({
                    assignment_id: assignment.id,
                    file_name: file.originalname,
                    file_type: inputType,
                    mime_type: file.mimetype,
                    file_url: fileUrl
                });
            }
            
            // Update input type on assignment
            assignment.input_type = inputType;
            await assignment.save();
        }

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