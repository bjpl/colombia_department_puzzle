import { describe, test, expect } from 'vitest';
import { normalizeId, departmentNameMap } from '../../utils/nameNormalizer';

describe('nameNormalizer', () => {
  describe('normalizeId', () => {
    test('should convert to lowercase', () => {
      expect(normalizeId('ANTIOQUIA')).toBe('antioquia');
      expect(normalizeId('Bogotá')).toBe('bogota');
    });

    test('should remove accents and diacritics', () => {
      expect(normalizeId('Bogotá')).toBe('bogota');
      expect(normalizeId('Nariño')).toBe('narino');
      expect(normalizeId('Quindío')).toBe('quindio');
      expect(normalizeId('Caquetá')).toBe('caqueta');
    });

    test('should replace non-alphanumeric characters with dash', () => {
      expect(normalizeId('Norte de Santander')).toBe('norte-de-santander');
      expect(normalizeId('Valle del Cauca')).toBe('valle-del-cauca');
      expect(normalizeId('San Andrés')).toBe('san-andres');
    });

    test('should replace multiple dashes with single dash', () => {
      expect(normalizeId('Test  Multiple   Spaces')).toBe('test-multiple-spaces');
      expect(normalizeId('Dash--Test---More')).toBe('dash-test-more');
    });

    test('should remove leading and trailing dashes', () => {
      expect(normalizeId(' Leading Space')).toBe('leading-space');
      expect(normalizeId('Trailing Space ')).toBe('trailing-space');
      expect(normalizeId(' Both ')).toBe('both');
    });

    test('should handle empty string', () => {
      expect(normalizeId('')).toBe('');
    });

    test('should handle special characters and emojis', () => {
      expect(normalizeId('Test@#$%^')).toBe('test');
      expect(normalizeId('Hello! World?')).toBe('hello-world');
    });

    test('should be idempotent (running twice gives same result)', () => {
      const input = 'Bogotá D.C.';
      const firstRun = normalizeId(input);
      const secondRun = normalizeId(firstRun);
      expect(firstRun).toBe(secondRun);
    });
  });

  describe('departmentNameMap', () => {
    test('should contain all 33 departments', () => {
      // Colombia has 32 departments + 1 capital district
      const entries = Object.keys(departmentNameMap);
      expect(entries.length).toBeGreaterThanOrEqual(32);
    });

    test('should map common department names correctly', () => {
      expect(departmentNameMap['antioquia']).toBe('antioquia');
      expect(departmentNameMap['bogota']).toBe('bogota-d-c');
      expect(departmentNameMap['valle-del-cauca']).toBe('valle-del-cauca');
    });

    test('should handle San Andrés alternative names', () => {
      expect(departmentNameMap['san-andres']).toBe('archipielago-de-san-andres-providencia-y-santa-catalina');
      expect(departmentNameMap['san-andres-y-providencia']).toBe('archipielago-de-san-andres-providencia-y-santa-catalina');
    });

    test('should map Norte de Santander correctly', () => {
      expect(departmentNameMap['norte-santander']).toBe('norte-de-santander');
    });

    test('all values should be normalized (lowercase, no accents)', () => {
      Object.values(departmentNameMap).forEach(value => {
        expect(value).toBe(value.toLowerCase());
        expect(value).not.toMatch(/[áéíóúñ]/i);
      });
    });
  });
});
