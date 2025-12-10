import { useGame } from '../../context/GameContext';
import { useProgressiveHints } from '../../hooks/useProgressiveHints';
import {
  Button, Card, CardHeader, CardTitle, CardContent, Badge,
  colors, spacing, textStyles
} from '../../design-system';

export default function HintsPanel() {
  const game = useGame();
  const hints = useProgressiveHints();

  if (!game.currentDepartment) {
    return null;
  }

  return (
    <Card variant="default" style={{ padding: spacing[4] }}>
      <CardHeader style={{ display: 'flex', alignItems: 'center', marginBottom: spacing[3] }}>
        <CardTitle style={{ fontSize: textStyles.heading.h3.fontSize[0], fontWeight: textStyles.heading.h3.fontWeight }}>
          💡 Pistas Progresivas
        </CardTitle>
        <Badge variant="default" style={{ marginLeft: 'auto', fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>
          Puntos: {game.score}
        </Badge>
      </CardHeader>

      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        {/* Level 1: Region Hint */}
        <Button
          variant="secondary"
          onClick={() => hints.activateRegionHint()}
          disabled={game.score < hints.HINT_COSTS.region || hints.activeHint !== null}
          style={{
            width: '100%',
            padding: spacing[3],
            border: `2px solid ${game.score >= hints.HINT_COSTS.region && !hints.activeHint ? colors.success[500] : colors.gray[300]}`,
            backgroundColor: game.score >= hints.HINT_COSTS.region && !hints.activeHint ? 'rgb(240 253 244)' : colors.gray[50],
            cursor: game.score >= hints.HINT_COSTS.region && !hints.activeHint ? 'pointer' : 'not-allowed',
            opacity: game.score >= hints.HINT_COSTS.region && !hints.activeHint ? 1 : 0.6,
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'semibold', fontSize: textStyles.body.small.fontSize[0] }}>🗺️ Mostrar Región</div>
              <div style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>
                Resalta la región donde pertenece
              </div>
            </div>
            <div>
              <Badge variant="default" style={{ fontSize: textStyles.body.small.fontSize[0], fontWeight: 'bold', color: colors.success[600] }}>
                -{hints.HINT_COSTS.region} pts
              </Badge>
            </div>
          </div>
        </Button>

        {/* Level 2: First Letter Hint */}
        <Button
          variant="secondary"
          onClick={() => hints.activateLetterHint()}
          disabled={game.score < hints.HINT_COSTS.letter || hints.activeHint !== null}
          style={{
            width: '100%',
            padding: spacing[3],
            border: `2px solid ${game.score >= hints.HINT_COSTS.letter && !hints.activeHint ? colors.warning[500] : colors.gray[300]}`,
            backgroundColor: game.score >= hints.HINT_COSTS.letter && !hints.activeHint ? 'rgb(254 252 232)' : colors.gray[50],
            cursor: game.score >= hints.HINT_COSTS.letter && !hints.activeHint ? 'pointer' : 'not-allowed',
            opacity: game.score >= hints.HINT_COSTS.letter && !hints.activeHint ? 1 : 0.6,
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'semibold', fontSize: textStyles.body.small.fontSize[0] }}>🔤 Primera Letra</div>
              <div style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>
                Muestra &ldquo;{game.currentDepartment.name[0]}...&rdquo; en el mapa
              </div>
            </div>
            <div>
              <Badge variant="default" style={{ fontSize: textStyles.body.small.fontSize[0], fontWeight: 'bold', color: colors.warning[600] }}>
                -{hints.HINT_COSTS.letter} pts
              </Badge>
            </div>
          </div>
        </Button>

        {/* Level 3: Flash Location Hint */}
        <Button
          variant="secondary"
          onClick={() => hints.activateFlashHint()}
          disabled={game.score < hints.HINT_COSTS.flash || hints.activeHint !== null}
          style={{
            width: '100%',
            padding: spacing[3],
            border: `2px solid ${game.score >= hints.HINT_COSTS.flash && !hints.activeHint ? colors.error[500] : colors.gray[300]}`,
            backgroundColor: game.score >= hints.HINT_COSTS.flash && !hints.activeHint ? '#fef2f2' : colors.gray[50],
            cursor: game.score >= hints.HINT_COSTS.flash && !hints.activeHint ? 'pointer' : 'not-allowed',
            opacity: game.score >= hints.HINT_COSTS.flash && !hints.activeHint ? 1 : 0.6,
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'semibold', fontSize: textStyles.body.small.fontSize[0] }}>✨ Mostrar Ubicación</div>
              <div style={{ fontSize: textStyles.body.small.fontSize[0], color: colors.text.secondary }}>
                Destella la ubicación exacta
              </div>
            </div>
            <div>
              <Badge variant="default" style={{ fontSize: textStyles.body.small.fontSize[0], fontWeight: 'bold', color: colors.error[600] }}>
                -{hints.HINT_COSTS.flash} pts
              </Badge>
            </div>
          </div>
        </Button>
      </CardContent>

      {/* Active Hint Indicator */}
      {hints.activeHint && (
        <Card variant="default" style={{ marginTop: spacing[3], padding: spacing[2], backgroundColor: '#e0f2fe', border: `1px solid ${colors.brand[300]}` }}>
          <div style={{ fontSize: textStyles.body.small.fontSize[0], color: '#075985', fontWeight: 'medium' }}>
            {hints.activeHint === 'region' && '🗺️ Región resaltada en el mapa'}
            {hints.activeHint === 'letter' && `🔤 Busca \u201C${game.currentDepartment.name[0]}...\u201D en la región`}
            {hints.activeHint === 'flash' && '✨ ¡Mira el departamento destellando!'}
          </div>
        </Card>
      )}

      {/* First Letter Display */}
      {hints.showFirstLetter && game.currentDepartment && (
        <Card variant="default" style={{ marginTop: spacing[3], padding: spacing[3], backgroundColor: '#fefce8', border: `2px solid ${colors.warning[500]}` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: textStyles.heading.xlarge.fontSize[0], fontWeight: 'bold', color: '#a16207' }}>
              {game.currentDepartment.name[0]}...
            </div>
            <div style={{ fontSize: textStyles.body.small.fontSize[0], color: '#a16207', marginTop: spacing[1] }}>
              Empieza con esta letra
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
}