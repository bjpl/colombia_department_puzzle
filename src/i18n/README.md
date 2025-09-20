# Colombian Spanish Translations System

A comprehensive translation system specifically designed for Colombian Spanish (es-CO) with cultural adaptations for Colombian users learning about their country's geography.

## 🇨🇴 Features

- **Colombian Spanish Dialect**: Authentic expressions and terminology used in Colombia
- **Cultural Context**: Department-specific cultural notes and significance
- **Regional Variations**: Expressions and accent notes for each Colombian region
- **Educational Content**: Geography facts and cultural information
- **Type Safety**: Full TypeScript support with type-safe translation keys
- **React Integration**: Context provider and specialized hooks
- **Accessibility**: Complete ARIA labels and screen reader support in Spanish

## 📁 File Structure

```
src/i18n/
├── index.ts              # Main exports and convenience imports
├── translations.ts       # Core translation keys and functions
├── TranslationContext.tsx # React context and hooks
├── types.ts              # TypeScript type definitions
├── cultural.ts           # Colombian cultural adaptations
└── README.md            # This documentation
```

## 🚀 Quick Start

### 1. Wrap your app with the TranslationProvider

```tsx
import { TranslationProvider } from './i18n';
import App from './App';

function Root() {
  return (
    <TranslationProvider locale="es-CO">
      <App />
    </TranslationProvider>
  );
}
```

### 2. Use translations in components

```tsx
import { useTranslations } from './i18n';

function GameHeader() {
  const { t } = useTranslations();

  return (
    <header>
      <h1>{t('gameHeader.title')}</h1>
      <p>{t('gameHeader.subtitle')}</p>
    </header>
  );
}
```

### 3. Use specialized hooks

```tsx
import { useGameModeTranslations, useHintTranslations } from './i18n';

function GameModeSelector() {
  const gameModes = useGameModeTranslations();
  const hints = useHintTranslations();

  return (
    <div>
      <h2>{gameModes.title}</h2>
      <p>{gameModes.subtitle}</p>
    </div>
  );
}
```

## 🎯 Translation Keys Structure

### Navigation and UI
```typescript
t('navigation.title')           // "🇨🇴 Rompecabezas de Colombia"
t('navigation.subtitle')        // "Aprendé los departamentos de nuestra hermosa Colombia"
t('navigation.close')           // "Cerrar"
```

### Game Modes
```typescript
t('gameModes.title')                    // "Elegí Tu Modo de Juego"
t('gameModes.fullCountry.title')        // "Colombia Completa"
t('gameModes.fullCountry.description')  // "Los 33 departamentos de una vez..."
t('gameModes.regions.recommended')      // "Recomendado"
```

### Educational Content
```typescript
t('educational.selectedDepartment')     // "Departamento Seleccionado"
t('educational.fields.name')            // "Nombre"
t('educational.fields.capital')         // "Capital"
t('educational.useHint')               // "Usar Pista"
```

### Hints System
```typescript
t('hints.levels.level1.coastal')       // "Departamento Costero"
t('hints.levels.level2.exactLocation') // "Ubicación Exacta"
t('hints.levels.level3.maximumHelp')   // "Ayuda Máxima"
```

### Cultural Expressions
```typescript
t('cultural.greetings.welcome')         // "¡Bienvenido, parcero!"
t('cultural.expressions.awesome')       // "¡Bacano!"
t('cultural.encouragement.keepGoing')   // "¡Dale que vas bien!"
```

## 🏛️ Cultural Adaptations

### Colombian Expressions
The system includes authentic Colombian expressions:

- **Agreement**: "Así es", "Claro que sí", "Dale", "Listo", "Bacano"
- **Encouragement**: "¡Dale que vas bien!", "¡Venga, que vos podés!", "¡Ánimo, parcero!"
- **Surprise**: "¡Uy no!", "¡Ay, Dios mío!", "¡Qué chimba!", "¡Berraco!"

### Regional Variations
Each Colombian region has specific cultural notes:

```typescript
import { getRegionalExpressions } from './i18n';

const caribeanExpressions = getRegionalExpressions('Caribe');
// Returns: ['Ey, tigre', 'Qué tal, pana', 'Bacano', 'Jajay']

const andinaExpressions = getRegionalExpressions('Andina');
// Returns: ['Parcero', '¿Cómo va todo?', 'Qué pena', 'Chevere']
```

### Department Cultural Notes
Special cultural context for departments:

```typescript
import { getDepartmentCulturalNote } from './i18n';

const note = getDepartmentCulturalNote('San Andrés y Providencia');
// Returns: "Único territorio insular de Colombia, hogar de la cultura raizal..."
```

## 🎣 Specialized Hooks

### useGameHeaderTranslations
```tsx
function GameHeader() {
  const { getModeDisplay, formatTime, formatScore } = useGameHeaderTranslations();

  return (
    <div>
      <span>{getModeDisplay('region', ['Caribe', 'Andina'])}</span>
      <span>{formatTime(120)}</span> {/* "2:00" */}
      <span>{formatScore(1500)}</span> {/* "1.500" */}
    </div>
  );
}
```

### useRegionTranslations
```tsx
function RegionSelector() {
  const { getRegionName, getDifficultyLabel } = useRegionTranslations();

  return (
    <div>
      <h3>{getRegionName('Caribe')}</h3> {/* "Región Caribe" */}
      <span>{getDifficultyLabel('easy')}</span> {/* "Fácil" */}
    </div>
  );
}
```

### useStatsTranslations
```tsx
function Statistics() {
  const { formatDepartmentCount, formatAccuracy } = useStatsTranslations();

  return (
    <div>
      <p>{formatDepartmentCount(5)}</p> {/* "5 departamentos" */}
      <p>{formatAccuracy(8, 10)}</p> {/* "80%" */}
    </div>
  );
}
```

### useHintModalTranslations
```tsx
function HintModal({ departmentName, level }) {
  const { getHintCost, getCoastType, getBorderCountry } = useHintModalTranslations();

  return (
    <div>
      <span>Costo: {getHintCost(level)}</span> {/* "Costo: 25 puntos" */}
      <p>Costa: {getCoastType('Chocó')}</p> {/* "Costa: Pacífico" */}
      <p>Frontera: {getBorderCountry('La Guajira')}</p> {/* "Frontera: Venezuela" */}
    </div>
  );
}
```

## 📊 Utility Functions

### String Interpolation
```typescript
import { interpolate } from './i18n';

const template = "¡Felicitaciones! Completaste {count} departamentos en {time}";
const result = interpolate(template, { count: 10, time: "5:30" });
// Result: "¡Felicitaciones! Completaste 10 departamentos en 5:30"
```

### Number Formatting
```typescript
import { formatColombianNumber, formatColombianCurrency } from './i18n';

formatColombianNumber(1500);    // "1.500"
formatColombianNumber(1000000); // "1.000.000"
formatColombianCurrency(5000);  // "$5.000"
```

### Pluralization
```typescript
import { pluralize } from './i18n';

pluralize(1, 'departamento', 'departamentos'); // "departamento"
pluralize(5, 'departamento', 'departamentos'); // "departamentos"
pluralize(0, 'estrella', 'estrellas');         // "estrellas"
```

## 🌍 Regional Context

### Geographic Terminology
The system uses proper Colombian geographic terms:

- **Regiones**: Insular, Pacífica, Orinoquía, Amazonía, Caribe, Andina
- **Océanos**: Pacífico, Atlántico (not "Océano Atlántico")
- **Características**: Llanos orientales, cordillera andina, selva amazónica

### Cultural Education
Educational facts about Colombian geography:

```typescript
import { colombianGeographyFacts } from './i18n/cultural';

const generalFacts = colombianGeographyFacts.general;
const caribeFacts = colombianGeographyFacts.regions.Caribe;
```

## ♿ Accessibility Support

Complete accessibility support in Spanish:

```typescript
// ARIA labels
t('accessibility.gameControl')      // "Panel de control del juego"
t('accessibility.mapArea')          // "Área del mapa de Colombia"
t('accessibility.departmentTray')   // "Panel de departamentos disponibles"

// Screen reader instructions
t('accessibility.dragDepartment')   // "Arrastrar departamento al mapa"
t('accessibility.dropZone')         // "Zona para soltar departamento"
```

## 🔧 Advanced Usage

### Custom Translation Context
```tsx
import { TranslationProvider, esCOTranslations } from './i18n';

// Extend translations
const customTranslations = {
  ...esCOTranslations,
  custom: {
    myFeature: "Mi característica especial"
  }
};

function App() {
  return (
    <TranslationProvider translations={customTranslations}>
      {/* Your app */}
    </TranslationProvider>
  );
}
```

### Type-Safe Custom Keys
```typescript
import type { TranslationKeys } from './i18n';

interface ExtendedTranslations extends TranslationKeys {
  custom: {
    myFeature: string;
  };
}

// Use with custom hook
function useCustomTranslations() {
  const { t } = useTranslations() as { t: (key: keyof ExtendedTranslations) => string };
  return t;
}
```

## 🎓 Educational Benefits

This translation system is designed to:

1. **Preserve Colombian Culture**: Authentic expressions and cultural context
2. **Enhance Learning**: Geography facts and cultural significance
3. **Improve Accessibility**: Complete Spanish screen reader support
4. **Cultural Pride**: Celebration of Colombian diversity and regional differences
5. **Educational Value**: Teaching proper Colombian Spanish alongside geography

## 🛠️ Development Guidelines

### Adding New Translations
1. Add keys to `TranslationKeys` interface in `translations.ts`
2. Implement translations in `esCOTranslations` object
3. Update type definitions in `types.ts` if needed
4. Add cultural context in `cultural.ts` if relevant
5. Create specialized hooks in `TranslationContext.tsx` for complex usage

### Colombian Spanish Guidelines
- Use "vos" in informal contexts for regions that use it
- Include diminutives naturally: "momentico", "ahorita", "cerquita"
- Use appropriate regional expressions
- Maintain cultural respect and authenticity
- Include educational value in translations

### Testing Translations
```typescript
// Test translation key exists
const translation = getTranslation('gameHeader.title');
expect(translation).not.toBe('gameHeader.title');

// Test interpolation
const result = interpolate('Hello {name}', { name: 'Colombia' });
expect(result).toBe('Hello Colombia');

// Test cultural functions
const encouragement = getRandomEncouragement();
expect(colombianExpressions.expressions.encouragement).toContain(encouragement);
```

## 📝 Contributing

When contributing to the translations:

1. Ensure cultural authenticity and respect
2. Include educational value where possible
3. Maintain type safety
4. Add proper documentation
5. Test with Colombian Spanish speakers
6. Consider regional variations

## 🏆 Best Practices

1. **Use specialized hooks** for complex translation logic
2. **Leverage cultural functions** for authentic expressions
3. **Include educational context** in tooltips and help text
4. **Test with real Colombian users** for cultural appropriateness
5. **Maintain consistency** across the application
6. **Document regional variations** for future enhancements

---

**¡Que viva Colombia!** 🇨🇴

This translation system celebrates Colombian culture while providing an excellent educational experience for learning about Colombia's beautiful geography and diverse regions.