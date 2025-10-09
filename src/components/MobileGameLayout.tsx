import { useState } from 'react';
import MapCanvas from './MapCanvas';
import DepartmentTray from './DepartmentTray';
import BottomSheet, { SnapPoint } from './BottomSheet';
import { useGame } from '../context/GameContext';
import {
  MOBILE_LAYOUT,
  Z_INDEX,
  SAFE_AREA,
} from '../constants/responsive';
import {
  Badge,
  colors,
  spacing,
  textStyles,
} from '../design-system';
import '../styles/mobile.css';

/**
 * MobileGameLayout Component
 *
 * Mobile-optimized layout using Google Maps style bottom sheet pattern.
 * Primary view is full-screen map with swipeable bottom drawer for departments.
 *
 * Layout Structure:
 * - Floating semi-transparent header (56px)
 * - Full-screen map (100vh - header height)
 * - Bottom sheet overlay (departments)
 *
 * Features:
 * - Full-screen map prioritization
 * - Swipeable bottom sheet (3 snap points)
 * - Compact stats in header
 * - Safe area handling (iOS/Android)
 * - Orientation change support
 *
 * @example
 * <MobileGameLayout />
 */
export default function MobileGameLayout() {
  const game = useGame();
  const [_sheetSnap, setSheetSnap] = useState<SnapPoint>('collapsed');

  // Calculate remaining departments
  const remainingCount = game.departments.filter(
    (d) => !game.placedDepartments.has(d.id)
  ).length;

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        backgroundColor: colors.surface.background,
      }}
    >
      {/* Floating Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all"
        style={{
          height: MOBILE_LAYOUT.headerHeight,
          paddingTop: SAFE_AREA.top,
          paddingLeft: SAFE_AREA.left,
          paddingRight: SAFE_AREA.right,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: `blur(${MOBILE_LAYOUT.backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${MOBILE_LAYOUT.backdropBlur}px)`, // Safari
          borderBottom: `1px solid ${colors.surface.border}`,
          zIndex: Z_INDEX.header,
        }}
      >
        <div
          className="flex items-center justify-between h-full"
          style={{
            padding: `0 ${spacing[4]}`,
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: textStyles.body.base.fontSize[0],
              fontWeight: textStyles.ui.semibold.fontWeight,
              color: colors.text.primary,
              margin: 0,
            }}
          >
            Colombia Puzzle
          </h1>

          {/* Compact Stats */}
          <div
            className="flex items-center gap-2"
            style={{
              fontSize: textStyles.caption.fontSize[0],
              color: colors.text.secondary,
            }}
          >
            {/* Score */}
            {game.isGameStarted && (
              <>
                <span style={{ fontWeight: textStyles.ui.medium.fontWeight }}>
                  {game.score}
                </span>
                <span style={{ color: colors.text.tertiary }}>•</span>
              </>
            )}

            {/* Timer */}
            {game.isGameStarted && (
              <>
                <span>
                  {Math.floor(game.elapsedTime / 60)}:
                  {String(game.elapsedTime % 60).padStart(2, '0')}
                </span>
                <span style={{ color: colors.text.tertiary }}>•</span>
              </>
            )}

            {/* Remaining Count */}
            <Badge
              variant="info"
              size="sm"
              style={{
                fontSize: textStyles.caption.fontSize[0],
                backgroundColor: colors.brand[100],
                color: colors.brand[700],
              }}
            >
              {remainingCount}/{game.departments.length}
            </Badge>
          </div>
        </div>
      </header>

      {/* Full-Screen Map */}
      <main
        className="flex-1"
        style={{
          marginTop: MOBILE_LAYOUT.headerHeight,
          height: `calc(100vh - ${MOBILE_LAYOUT.headerHeight}px)`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <MapCanvas />
      </main>

      {/* Bottom Sheet with Departments */}
      <BottomSheet
        initialSnapPoint="collapsed"
        onSnapChange={setSheetSnap}
      >
        {/* Department Tray in compact mode */}
        <div
          style={{
            paddingTop: spacing[2],
          }}
        >
          {/* Sheet Title */}
          <div
            className="flex items-center justify-between"
            style={{
              marginBottom: spacing[3],
            }}
          >
            <h2
              style={{
                fontSize: textStyles.body.base.fontSize[0],
                fontWeight: textStyles.ui.semibold.fontWeight,
                color: colors.text.primary,
                margin: 0,
              }}
            >
              Departamentos
            </h2>
            <Badge
              variant="info"
              size="sm"
              style={{
                backgroundColor: colors.brand[100],
                color: colors.brand[700],
              }}
            >
              {remainingCount} restantes
            </Badge>
          </div>

          {/* Departments List - Mobile optimized with horizontal scroll */}
          <DepartmentTray layout="mobile-scroll" />
        </div>
      </BottomSheet>
    </div>
  );
}
