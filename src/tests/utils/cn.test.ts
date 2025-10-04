import { describe, test, expect } from 'vitest';
import { cn, classNames } from '../../design-system/utils/cn';

describe('cn utility', () => {
  test('should combine multiple class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  test('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    expect(cn('base', isActive && 'active', isDisabled && 'disabled'))
      .toBe('base active');
  });

  test('should filter out falsy values', () => {
    expect(cn('class1', null, undefined, false, '', 'class2'))
      .toBe('class1 class2');
  });

  test('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  test('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  test('should handle objects with boolean values', () => {
    expect(cn({
      'class1': true,
      'class2': false,
      'class3': true,
    })).toBe('class1 class3');
  });
});

describe('classNames fallback utility', () => {
  test('should combine multiple class names', () => {
    expect(classNames('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  test('should filter out undefined values', () => {
    expect(classNames('class1', undefined, 'class2')).toBe('class1 class2');
  });

  test('should filter out null values', () => {
    expect(classNames('class1', null, 'class2')).toBe('class1 class2');
  });

  test('should filter out false values', () => {
    expect(classNames('class1', false, 'class2')).toBe('class1 class2');
  });

  test('should handle empty array', () => {
    expect(classNames()).toBe('');
  });

  test('should handle all falsy values', () => {
    expect(classNames(undefined, null, false)).toBe('');
  });
});
