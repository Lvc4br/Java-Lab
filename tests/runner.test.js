import { describe, it, expect } from 'vitest';
import { adaptSource, interpret, checkLimits, detectMainClass } from '../assets/js/runner.js';

describe('adaptSource', () => {
  it('renomeia a classe pública para Main e avisa', () => {
    const { source, notes } = adaptSource('public class D1 { D1() {} }');
    expect(source).toBe('public class Main { Main() {} }');
    expect(notes).toHaveLength(1);
  });
  it('não mexe em código que já usa Main', () => {
    expect(adaptSource('public class Main {}').notes).toEqual([]);
  });
  it('remove package e avisa', () => {
    const { source, notes } = adaptSource('package a.b;\npublic class Main {}');
    expect(source).not.toContain('package');
    expect(notes).toHaveLength(1);
  });
  it('detecta a classe principal', () => expect(detectMainClass('public final class X {}')).toBe('X'));
});

describe('interpret', () => {
  it('diferencia compilação, execução, tempo e serviço', () => {
    expect(interpret({ status: { id: 3 }, stdout: 'oi' }).kind).toBe('ok');
    expect(interpret({ status: { id: 6 }, compile_output: 'erro' }).kind).toBe('compile_error');
    expect(interpret({ status: { id: 11 }, stderr: 'Exception' }).kind).toBe('runtime_error');
    expect(interpret({ status: { id: 5 } }).kind).toBe('timeout');
    expect(interpret({ status: { id: 13 }, message: 'x' }).kind).toBe('service_error');
    expect(interpret(null).kind).toBe('service_error');
  });
});

describe('checkLimits', () => {
  const limits = { maxCodeBytes: 10, maxStdinBytes: 5 };
  it('aceita dentro do limite', () => expect(checkLimits('abc', '1', limits)).toBeNull());
  it('recusa código e entrada grandes', () => {
    expect(checkLimits('a'.repeat(11), '', limits)).toMatch(/código/);
    expect(checkLimits('a', '1'.repeat(6), limits)).toMatch(/entrada/);
  });
});
