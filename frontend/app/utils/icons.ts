import {
  Atom,
  BookOpen,
  Cpu,
  FlaskConical,
  GraduationCap,
  Landmark,
  Languages,
  Leaf,
  Microscope,
  Scale,
  Sigma,
  TrendingUp,
} from '@lucide/vue';
import type { Component } from 'vue';

const FACULTY_ICONS: Record<string, Component> = {
  sigma: Sigma,
  atom: Atom,
  'flask-conical': FlaskConical,
  leaf: Leaf,
  landmark: Landmark,
  'book-open': BookOpen,
  languages: Languages,
  'trending-up': TrendingUp,
  scale: Scale,
  cpu: Cpu,
  microscope: Microscope,
};

export const facultyIcon = (name?: string | null): Component => (name && FACULTY_ICONS[name]) || GraduationCap;
