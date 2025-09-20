# Colombia Puzzle Simplification Plan
## Using Claude-Flow + Ruv-Swarm

### 🎯 **Current Problems**
1. **Overcomplicated onboarding** - 9 different paths based on skill/style
2. **Too many progression options** - Confusing array of next steps
3. **Not using tools properly** - Running swarms but not coordinating

### ✅ **Simplification Goals**
1. **Single "How To" Tutorial** - Just teach drag & drop mechanics
2. **3 Clear Modes** - Full, Regional, Learning
3. **Natural Progression** - Each mode has its own clear path

## 🧠 **Cognitive Pattern Analysis** (Ruv-Swarm)

### **Convergent Pattern** - Focus on Core
- **KEEP**: Drag/drop mechanics, 3 modes, hints system
- **REMOVE**: QuickStartFlow, 9-path system, complex recommendations
- **SIMPLIFY**: NextChallengeRecommender to just suggest next region

### **Critical Pattern** - Validate Simplicity
- Every user path must be obvious
- No analysis paralysis from too many options
- Clear visual indicators of what to do next

## 📋 **Implementation Plan** (Claude-Flow SPARC)

### **Phase 1: Specification** ✓
- Simple tutorial replaces QuickStartFlow
- 3 modes with clear descriptions
- Natural progression within each mode

### **Phase 2: Pseudocode**
```
if (firstTime) {
  showSimpleTutorial(); // Just drag & drop
}
showThreeModes(); // Full, Regional, Learning

// In-mode progression
if (mode === 'regional' && completed('Insular')) {
  suggest('Pacífica'); // Simple, linear progression
}
```

### **Phase 3: Architecture**
```
GameContainer
├── SimpleTutorial (replaces QuickStartFlow)
├── ModeSelector (3 clear options)
└── GamePlay
    └── SimpleProgressionHelper (replaces complex recommender)
```

### **Phase 4: Refinement**
- Remove all beginner/intermediate/expert logic
- Remove learning style preferences
- Keep only essential progression

### **Phase 5: Completion**
- Test that any user can understand in <30 seconds
- Ensure progression is obvious without analysis

## 🔧 **Files to Change**

### **Remove/Simplify**
1. ❌ `QuickStartFlow.tsx` - Replace with SimpleTutorial
2. ✂️ `NextChallengeRecommender.tsx` - Simplify to basic suggestions
3. ✂️ `GameModeSelector.tsx` - Remove complexity, just 3 modes

### **Keep/Enhance**
1. ✅ `InteractiveTutorial.tsx` - This is our "How To"
2. ✅ `StudyMode.tsx` - This IS the learning mode
3. ✅ `PostGameReport.tsx` - Simple "play again" or "try different mode"

## 📊 **Success Metrics**
- User understands how to play in <30 seconds
- Mode selection is obvious
- Next step after completion is clear
- No dead ends, no confusion

## 🚀 **Next Actions**
1. Use SimpleTutorial instead of QuickStartFlow
2. Simplify NextChallengeRecommender to basic regional progression
3. Clean up GameModeSelector to just show 3 modes clearly
4. Remove all skill level and learning style code