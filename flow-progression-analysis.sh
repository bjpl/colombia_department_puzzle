#!/bin/bash

# Claude-Flow & Ruv-Swarm Progression Analysis Script
# Uses npx to run the tools without installing them as dependencies

echo "🚀 Colombia Puzzle Game - Progression Flow Analysis"
echo "=================================================="
echo ""

# Function to analyze user flows with claude-flow
analyze_with_claude_flow() {
    echo "📊 Running Claude-Flow Analysis..."
    echo "--------------------------------"

    # Initialize claude-flow for the project
    npx claude-flow@latest init \
        --project "colombia-puzzle-progression" \
        --methodology "SPARC" \
        --agents "progression-analyzer,experience-optimizer,test-validator" \
        --topology "hierarchical"

    # Analyze each onboarding combination
    echo ""
    echo "🔍 Analyzing 9 Onboarding Combinations:"

    # Beginner paths
    npx claude-flow@latest analyze \
        --task "beginner-visual-flow" \
        --description "Beginner + Visual → Insular (1 dept) progression" \
        --pattern "convergent" \
        --validate-progression

    npx claude-flow@latest analyze \
        --task "beginner-practice-flow" \
        --description "Beginner + Practice → Insular + Pacífica (4 depts)" \
        --pattern "convergent" \
        --validate-progression

    npx claude-flow@latest analyze \
        --task "beginner-systematic-flow" \
        --description "Beginner + Systematic → Progressive mode" \
        --pattern "systems" \
        --validate-progression

    # Intermediate paths
    npx claude-flow@latest analyze \
        --task "intermediate-challenge-flow" \
        --description "Intermediate + Challenge → Andina (10 depts)" \
        --pattern "divergent" \
        --validate-progression

    npx claude-flow@latest analyze \
        --task "intermediate-review-flow" \
        --description "Intermediate + Review → Caribe + Pacífica" \
        --pattern "divergent" \
        --validate-progression

    npx claude-flow@latest analyze \
        --task "intermediate-learn-flow" \
        --description "Intermediate + Learn → Orinoquía + Amazonía" \
        --pattern "divergent" \
        --validate-progression

    # Expert paths
    npx claude-flow@latest analyze \
        --task "expert-full-flow" \
        --description "Expert → Full country (33 depts)" \
        --pattern "critical" \
        --validate-progression
}

# Function to optimize with ruv-swarm
optimize_with_ruv_swarm() {
    echo ""
    echo "🧠 Running Ruv-Swarm Cognitive Optimization..."
    echo "--------------------------------------------"

    # Initialize ruv-swarm with cognitive patterns
    npx ruv-swarm@latest init \
        --memory-allocation 48 \
        --simd-enabled \
        --vector-dimensions 512

    # Apply cognitive patterns to detect dead-ends
    echo ""
    echo "🔍 Detecting Dead-Ends with Critical Pattern:"

    npx ruv-swarm@latest analyze \
        --pattern "critical" \
        --task "validate-all-paths" \
        --input "src/components/NextChallengeRecommender.tsx" \
        --check-dead-ends \
        --ensure-progression

    # Optimize user experience flow
    echo ""
    echo "✨ Optimizing User Experience with Divergent Pattern:"

    npx ruv-swarm@latest optimize \
        --pattern "divergent" \
        --task "maximize-engagement" \
        --explore-paths 9 \
        --difficulty-scaling "adaptive" \
        --output "progression-optimization-report.json"

    # System coherence check
    echo ""
    echo "🔧 Checking System Coherence:"

    npx ruv-swarm@latest validate \
        --pattern "systems" \
        --task "flow-coherence" \
        --components "QuickStartFlow,PostGameReport,NextChallengeRecommender" \
        --ensure-no-dead-ends
}

# Function to generate comprehensive report
generate_report() {
    echo ""
    echo "📝 Generating Comprehensive Report..."
    echo "-----------------------------------"

    npx claude-flow@latest report \
        --format "markdown" \
        --include-metrics \
        --output "PROGRESSION-ANALYSIS-REPORT.md"

    echo ""
    echo "✅ Analysis Complete!"
    echo ""
    echo "Reports generated:"
    echo "  - PROGRESSION-ANALYSIS-REPORT.md"
    echo "  - progression-optimization-report.json"
}

# Main execution
main() {
    analyze_with_claude_flow
    optimize_with_ruv_swarm
    generate_report
}

# Run the analysis
main