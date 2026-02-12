# Simplification TODO

## Phase 1: Preparation ✓
- [x] Analyze codebase structure
- [x] Create simplification plan
- [ ] Create backup branch
- [ ] Identify all FP library usages

## Phase 2: Core Simplification (Plan A)
- [ ] Remove embedded FP library (lines 110-607)
- [ ] Replace curry() patterns with regular functions
- [ ] Replace path/prop with direct property access
- [ ] Convert reduce/map to vanilla JS equivalents
- [ ] Remove unused utility functions

## Phase 3: Feature Consolidation
- [ ] Keep only drag simulation strategy
- [ ] Remove input manipulation fallback code
- [ ] Simplify selector generation
- [ ] Remove debug features (Alt+v)

## Phase 4: Code Organization
- [ ] Add clear section separators
- [ ] Group related functions
- [ ] Inline single-use helpers
- [ ] Extract magic numbers to constants
- [ ] Improve function naming

## Phase 5: Testing & Validation
- [ ] Test Alt+k/j/h/l (move events)
- [ ] Test Alt+Shift+k/j/h/l (expand events)
- [ ] Test Ctrl+b (menu toggle)
- [ ] Check console for errors
- [ ] Verify on actual Google Calendar
- [ ] Performance comparison

## Phase 6: Documentation
- [ ] Update README if needed
- [ ] Add changelog entry for v0.2.0
- [ ] Document simplified architecture
