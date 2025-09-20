import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

/**
 * CONCEPT: ARIA Live Regions for Game State Announcements
 * WHY: Screen reader users need real-time feedback about game interactions
 * PATTERN: Observer pattern with live region announcements
 */
export default function ScreenReaderAnnouncements() {
  const game = useGame();
  const lastPlacedRef = useRef<string | null>(null);
  const lastScoreRef = useRef<number>(0);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Announce department placement results
  useEffect(() => {
    const placedCount = game.placedDepartments.size;

    // Check if a new department was placed
    if (placedCount > 0) {
      const lastPlaced = Array.from(game.placedDepartments).pop();

      if (lastPlaced && lastPlaced !== lastPlacedRef.current) {
        lastPlacedRef.current = lastPlaced;

        // Find the department name from the game data
        const dept = game.getFilteredDepartments().find(d => d.id === lastPlaced);
        if (dept) {
          const message = game.correctPlacements.has(lastPlaced)
            ? `¡Correcto! ${dept.name} colocado correctamente. ${placedCount} de ${game.getFilteredDepartments().length} departamentos completados.`
            : `Incorrecto. ${dept.name} colocado en posición incorrecta. Intenta de nuevo.`;

          announceMessage(message);
        }
      }
    }
  }, [game.placedDepartments, game.correctPlacements, game]);

  // Announce score changes
  useEffect(() => {
    if (game.score !== lastScoreRef.current) {
      const diff = game.score - lastScoreRef.current;
      lastScoreRef.current = game.score;

      if (diff > 0) {
        announceMessage(`Puntuación aumentada. Puntuación actual: ${game.score} puntos.`);
      } else if (diff < 0) {
        announceMessage(`Puntuación disminuida. Puntuación actual: ${game.score} puntos.`);
      }
    }
  }, [game.score]);

  // Announce game completion
  useEffect(() => {
    if (game.gameCompleted) {
      const totalDepartments = game.getFilteredDepartments().length;
      const correctCount = game.correctPlacements.size;
      const accuracy = Math.round((correctCount / totalDepartments) * 100);

      announceMessage(
        `¡Juego completado! Has colocado correctamente ${correctCount} de ${totalDepartments} departamentos. ` +
        `Precisión: ${accuracy}%. Puntuación final: ${game.score} puntos.`
      );
    }
  }, [game.gameCompleted, game]);

  // Announce hints
  useEffect(() => {
    if (game.hintsUsed > 0) {
      announceMessage(`Pista utilizada. Pistas restantes: ${3 - game.hintsUsed}.`);
    }
  }, [game.hintsUsed]);

  /**
   * Helper function to announce messages to screen readers
   * Uses assertive announcements for important game events
   */
  const announceMessage = (message: string) => {
    if (announcementRef.current) {
      // Clear previous message to ensure re-announcement
      announcementRef.current.textContent = '';

      // Small delay to ensure screen reader picks up the change
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = message;
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Live region for game announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Polite announcements for less critical updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {game.currentDepartment && (
          <span>
            Arrastrando {game.currentDepartment}. Suelta sobre la ubicación correcta en el mapa.
          </span>
        )}
      </div>

      {/* Game instructions for screen readers */}
      <div className="sr-only" role="region" aria-label="Instrucciones del juego">
        <h2>Cómo jugar:</h2>
        <ol>
          <li>Navega por la lista de departamentos usando las teclas Tab o flechas</li>
          <li>Presiona Enter o Espacio para seleccionar un departamento</li>
          <li>Usa las flechas para mover el departamento seleccionado</li>
          <li>Presiona Enter para colocar el departamento en el mapa</li>
          <li>Presiona Escape para cancelar la selección</li>
        </ol>
      </div>
    </>
  );
}