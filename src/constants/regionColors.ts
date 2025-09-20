// Shared region color constants used across the application

export const REGION_COLORS: Record<string, string> = {
  'Andina': '#bef264', // Lime Green
  'Caribe': '#93c5fd', // Blue
  'Pacífico': '#e9d5ff', // Light Purple
  'Pacífica': '#e9d5ff', // Support both spellings
  'Orinoquía': '#fde047', // Yellow
  'Amazonía': '#86efac', // Forest Green
  'Insular': '#67e8f9', // Cyan
};

export const REGION_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  'Andina': { bg: 'from-lime-400 to-lime-600', text: 'text-lime-900', icon: '⛰️' },
  'Caribe': { bg: 'from-blue-400 to-blue-600', text: 'text-blue-900', icon: '🏖️' },
  'Pacífico': { bg: 'from-purple-300 to-purple-500', text: 'text-purple-900', icon: '🌊' },
  'Pacífica': { bg: 'from-purple-300 to-purple-500', text: 'text-purple-900', icon: '🌊' },
  'Orinoquía': { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900', icon: '🌾' },
  'Amazonía': { bg: 'from-green-400 to-green-600', text: 'text-green-900', icon: '🌳' },
  'Insular': { bg: 'from-cyan-400 to-cyan-600', text: 'text-cyan-900', icon: '🏝️' },
};

export const REGION_TAILWIND_CLASSES: Record<string, string> = {
  'Andina': 'bg-lime-100 border-lime-400 hover:bg-lime-200 text-lime-900',
  'Caribe': 'bg-blue-100 border-blue-400 hover:bg-blue-200 text-blue-900',
  'Pacífico': 'bg-purple-100 border-purple-400 hover:bg-purple-200 text-purple-900',
  'Pacífica': 'bg-purple-100 border-purple-400 hover:bg-purple-200 text-purple-900',
  'Orinoquía': 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200 text-yellow-900',
  'Amazonía': 'bg-green-100 border-green-400 hover:bg-green-200 text-green-900',
  'Insular': 'bg-cyan-100 border-cyan-400 hover:bg-cyan-200 text-cyan-900',
};