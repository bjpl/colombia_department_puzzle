/**
 * Device Detection Utility
 *
 * Detects input method capabilities and user preferences for touch/mouse interaction.
 * Follows iOS HIG and Material Design guidelines for touch detection.
 *
 * @module deviceDetection
 */

import { storage } from '../services/storage';

const STORAGE_KEY = 'preferred-interaction-mode';

/**
 * Pointer type enumeration
 */
export enum PointerType {
  FINE = 'fine',     // Mouse, trackpad, stylus
  COARSE = 'coarse', // Touch
  NONE = 'none'      // Keyboard only
}

/**
 * Interaction mode preference
 */
export enum InteractionMode {
  TAP = 'tap',       // Tap-to-select, tap-to-place
  DRAG = 'drag',     // Traditional drag-and-drop
  AUTO = 'auto'      // Auto-detect based on device
}

/**
 * Device capabilities interface
 */
export interface DeviceCapabilities {
  hasTouch: boolean;
  pointerType: PointerType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsHover: boolean;
}

/**
 * Detects if device has touch capability
 * Uses modern pointer media query for accurate detection
 *
 * @returns True if device has coarse pointer (touch)
 */
export function isTouchDevice(): boolean {
  // Primary detection: pointer media query
  if (window.matchMedia('(pointer: coarse)').matches) {
    return true;
  }

  // Fallback: check for touch events support
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return true;
  }

  return false;
}

/**
 * Gets the primary pointer type of the device
 *
 * @returns PointerType enum value
 */
export function getPointerType(): PointerType {
  if (window.matchMedia('(pointer: coarse)').matches) {
    return PointerType.COARSE;
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    return PointerType.FINE;
  }

  return PointerType.NONE;
}

/**
 * Checks if device supports hover interactions
 *
 * @returns True if device has hover capability
 */
export function supportsHover(): boolean {
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Detects device form factor based on screen size and capabilities
 *
 * @returns DeviceCapabilities object
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  const hasTouch = isTouchDevice();
  const pointerType = getPointerType();
  const hover = supportsHover();

  // Screen size breakpoints (matches design system)
  const width = window.innerWidth;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return {
    hasTouch,
    pointerType,
    isMobile,
    isTablet,
    isDesktop,
    supportsHover: hover
  };
}

/**
 * Determines if user prefers touch mode interaction
 * Checks user preference first, then falls back to device detection
 *
 * @returns True if touch mode should be used
 */
export function prefersTouchMode(): boolean {
  const preference = storage.get<InteractionMode>(STORAGE_KEY);

  if (preference === InteractionMode.TAP) {
    return true;
  }

  if (preference === InteractionMode.DRAG) {
    return false;
  }

  // Auto mode: use device detection
  const capabilities = getDeviceCapabilities();
  return capabilities.hasTouch && (capabilities.isMobile || !capabilities.supportsHover);
}

/**
 * Gets the current interaction mode preference
 *
 * @returns Current InteractionMode setting
 */
export function getInteractionMode(): InteractionMode {
  const preference = storage.get<InteractionMode>(STORAGE_KEY);
  return preference || InteractionMode.AUTO;
}

/**
 * Sets the user's preferred interaction mode
 * Persists to localStorage
 *
 * @param mode - InteractionMode to set
 */
export function setInteractionMode(mode: InteractionMode): void {
  storage.set(STORAGE_KEY, mode);

  // Dispatch event for components to react to mode change
  window.dispatchEvent(new CustomEvent('interaction-mode-changed', {
    detail: { mode }
  }));
}

/**
 * Resets interaction mode to auto-detect
 */
export function resetInteractionMode(): void {
  storage.remove(STORAGE_KEY);

  window.dispatchEvent(new CustomEvent('interaction-mode-changed', {
    detail: { mode: InteractionMode.AUTO }
  }));
}

/**
 * Checks if device is likely a mobile device based on multiple signals
 * More comprehensive than just screen size
 *
 * @returns True if likely mobile
 */
export function isMobileDevice(): boolean {
  const capabilities = getDeviceCapabilities();

  // Mobile if:
  // - Has touch AND small screen
  // - OR has coarse pointer AND no hover
  return (capabilities.hasTouch && capabilities.isMobile) ||
         (capabilities.pointerType === PointerType.COARSE && !capabilities.supportsHover);
}

/**
 * Checks if device is likely a tablet
 *
 * @returns True if likely tablet
 */
export function isTabletDevice(): boolean {
  const capabilities = getDeviceCapabilities();

  // Tablet if:
  // - Has touch AND medium screen
  // - AND (has hover OR portrait orientation)
  return capabilities.hasTouch &&
         capabilities.isTablet &&
         (capabilities.supportsHover || window.innerHeight > window.innerWidth);
}
