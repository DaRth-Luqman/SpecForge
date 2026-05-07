import streamlit as st
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure page settings
st.set_page_config(
    page_title="SpecForge AI",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Inject custom CSS for Dark Futuristic Theme
st.markdown("""
    <style>
    :root {
        --bg-color: #0f172a;
        --card-bg: #1e293b;
        --border-glow: #3b82f6;
        --text-color: #f8fafc;
        --accent-red: #ef4444;
    }
    
    /* Global Background */
    .stApp {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: 'Inter', sans-serif;
    }
    
    /* Headers */
    h1, h2, h3, h4, h5, h6 {
        color: var(--text-color) !important;
        font-weight: 700;
    }
    
    /* Slogan */
    .slogan {
        font-size: 1.2rem;
        color: #94a3b8;
        margin-bottom: 2rem;
        text-align: center;
    }
    
    /* Text Area */
    .stTextArea textarea {
        background-color: var(--card-bg) !important;
        color: var(--text-color) !important;
        border: 1px solid #334155 !important;
        border-radius: 8px !important;
    }
    .stTextArea textarea:focus {
        border-color: var(--border-glow) !important;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5) !important;
    }
    
    /* Custom Metric Badges */
    .metric-badge {
        background-color: var(--card-bg);
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }
    .metric-title {
        font-size: 0.9rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }
    .metric-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--border-glow);
    }
    
    /* Edge Cases Box */
    .edge-cases-box {
        background-color: rgba(239, 68, 68, 0.1);
        border-left: 4px solid var(--accent-red);
        padding: 1rem;
        border-radius: 0 8px 8px 0;
        margin: 1rem 0;
    }
    
    /* Timelines / Lists */
    .timeline-item {
        margin-bottom: 1rem;
        padding-left: 1rem;
        border-left: 2px solid var(--border-glow);
    }
    
    /* Fix Streamlit standard components blending */
    div[data-testid="stVerticalBlock"] > div {
        background-color: transparent;
    }
    </style>
""", unsafe_allow_html=True)

# Application Header
st.markdown("<h1 style='text-align: center; font-size: 3rem;'>SpecForge <span style='color: #3b82f6;'>AI</span></h1>", unsafe_allow_html=True)
st.markdown("<p class='slogan'>Turn Confusing Assignments into Clear Engineering Plans</p>", unsafe_allow_html=True)

# Pre-loaded Prompts
SAMPLE_PROMPTS = {
    "AI Pathfinding Maze": "Build a program that reads a 2D grid maze from a text file where 'S' is start, 'E' is end, and '#' are walls. Implement A* search to find the shortest path. Output the path coordinates.",
    "State-Space Search (Water Jug)": "Implement a solver for the classic water jug problem. You have a 3-gallon jug and a 5-gallon jug. You need to measure exactly 4 gallons of water. Use Breadth-First Search to find the shortest sequence of steps.",
    "OS Deadlock Problem": "Simulate the dining philosophers problem using threads and mutexes. Ensure your program handles resource allocation correctly and avoids deadlock. Demonstrate that your solution works without starvation for at least 5 minutes."
}

if "user_input" not in st.session_state:
    st.session_state.user_input = ""

# Sample Buttons
st.write("### Try a Sample Assignment")
col1, col2, col3 = st.columns(3)
if col1.button("🤖 AI Pathfinding Maze"):
    st.session_state.user_input = SAMPLE_PROMPTS["AI Pathfinding Maze"]
if col2.button("💧 State-Space Search"):
    st.session_state.user_input = SAMPLE_PROMPTS["State-Space Search (Water Jug)"]
if col3.button("🔄 OS Deadlock Problem"):
    st.session_state.user_input = SAMPLE_PROMPTS["OS Deadlock Problem"]

# Input Area
user_input = st.text_area("Paste your assignment prompt here:", value=st.session_state.user_input, height=150)

# API Setup
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    client = OpenAI(api_key=api_key)

# Deconstruct Logic
if st.button("🚀 Deconstruct Prompt", use_container_width=True):
    if not user_input.strip():
        st.warning("Please enter an assignment prompt first.")
    elif not api_key:
        st.error("API Key not found. Please set OPENAI_API_KEY in the .env file.")
    else:
        with st.spinner("SpecForge AI is analyzing architecture with GPT-4..."):
            try:
                # System prompt forcing STRICT JSON and explicit edge case instructions
                system_instruction = """
                You are a strict, elite Senior Software Engineer and Architect.
                A student has provided you with their technical assignment prompt.
                Your job is NOT to write code or solve the assignment.
                Your job is to generate a structured engineering execution plan.

                CRITICAL INSTRUCTION FOR EDGE CASES:
                Be highly specific based on the domain. Prove you understand the underlying computer science constraints:
                - If the assignment involves A* search or grid pathfinding, explicitly warn the user to structure their grid using a `(row, column)` coordinate system (row-major order) rather than generic `(x, y)` math to prevent out-of-bounds indexing.
                - If the assignment involves a state-space search (like water jugs), warn them to explicitly define the exact target state stop condition (e.g., reaching state (2, 3)) and use a `visited` set to prevent infinite BFS loops.
                - If the assignment is OS/threading, explicitly warn them about the exact lock ordering to prevent cyclic wait and deadlock.

                You MUST return ONLY valid JSON matching exactly this structure, with no extra text or markdown formatting:
                {
                  "assignmentDomain": "Domain Name",
                  "phaseBreakdown": ["Phase 1 task list...", "Phase 2 task list..."],
                  "edgeCases": ["Edge case 1...", "Edge case 2..."],
                  "blueprintRecommendations": ["Diagram 1...", "Pattern 2..."],
                  "conceptGuide": ["Concept 1...", "Concept 2..."],
                  "complexityEstimate": "Complexity level",
                  "firstSteps": ["Step 1...", "Step 2..."]
                }
                """

                # Call OpenAI GPT-4o with JSON object mode
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": user_input}
                    ],
                    response_format={ "type": "json_object" }
                )

                raw_json = response.choices[0].message.content
                
                try:
                    result = json.loads(raw_json)
                except json.JSONDecodeError:
                    st.error("Failed to parse the AI's response as valid JSON. Raw output:")
                    st.code(raw_json)
                    st.stop()

                # Dashboard Layout rendering
                st.markdown("---")
                st.markdown("## 🛠️ Engineering Execution Plan")
                
                # Metrics Row
                mcol1, mcol2 = st.columns(2)
                with mcol1:
                    st.markdown(f"""
                        <div class="metric-badge">
                            <div class="metric-title">Assignment Domain</div>
                            <div class="metric-value">{result.get("assignmentDomain", "N/A")}</div>
                        </div>
                    """, unsafe_allow_html=True)
                with mcol2:
                    st.markdown(f"""
                        <div class="metric-badge">
                            <div class="metric-title">Complexity Estimate</div>
                            <div class="metric-value">{result.get("complexityEstimate", "N/A")}</div>
                        </div>
                    """, unsafe_allow_html=True)

                st.markdown("---")
                
                # Edge Cases (Bold Red Warning)
                st.markdown("### 🚨 Critical Edge Cases & Pitfalls")
                edge_cases_html = "".join([f"<li>{ec}</li>" for ec in result.get("edgeCases", [])])
                st.markdown(f"""
                    <div class="edge-cases-box">
                        <ul style="margin-bottom: 0;">
                            {edge_cases_html}
                        </ul>
                    </div>
                """, unsafe_allow_html=True)
                
                # Main Details Columns
                col_left, col_right = st.columns([1.5, 1])
                
                with col_left:
                    st.markdown("### 🏗️ Phase Breakdown")
                    for idx, phase in enumerate(result.get("phaseBreakdown", [])):
                        st.markdown(f"""
                            <div class="timeline-item">
                                <strong>Phase {idx + 1}:</strong> {phase}
                            </div>
                        """, unsafe_allow_html=True)
                        
                    st.markdown("### 🚀 Immediate First Steps")
                    for step in result.get("firstSteps", []):
                        st.markdown(f"- {step}")

                with col_right:
                    st.markdown("### 📐 Blueprint Recommendations")
                    for item in result.get("blueprintRecommendations", []):
                        st.markdown(f"- {item}")
                        
                    st.markdown("### 📚 Concept Guide")
                    for item in result.get("conceptGuide", []):
                        st.markdown(f"- {item}")

            except Exception as e:
                st.error(f"An unexpected error occurred during analysis: {str(e)}")
