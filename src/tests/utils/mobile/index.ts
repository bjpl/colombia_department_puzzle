/**
 * Mobile Test Utilities
 *
 * Utilities for testing mobile-specific features and accessibility compliance.
 *
 * @module tests/utils/mobile
 */

export {
  TouchSimulator,
  touchSimulator,
  createTouchList,
  type TouchOptions,
} from './touch-simulator';

export {
  TouchTargetValidator,
  type TouchTargetResult,
  type TouchTargetReport,
  type TouchTargetValidatorOptions,
} from './touch-target-validator';

export {
  TouchDragDropSimulator,
  touchDragDropSimulator,
  simulateDragDrop,
  dragToPosition,
  simulateCancelledDrag,
  type DragDropOptions,
  type DragDropResult,
  type Position,
} from './touch-drag-drop';

export {
  ViewportTester,
  viewportTester,
  STANDARD_VIEWPORTS,
  BREAKPOINTS,
  type ViewportConfig,
} from './viewport-tester';

export {
  OrientationTester,
  orientationTester,
  type Orientation,
  type OrientationConfig,
} from './orientation-tester';
