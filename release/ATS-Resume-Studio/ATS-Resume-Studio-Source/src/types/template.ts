export type TemplateCategory =
  | 'corporate'
  | 'tech'
  | 'creative'
  | 'healthcare'
  | 'academic'
  | 'trades';

export type TemplateId =
  | 'corporate-boardroom'
  | 'corporate-partner'
  | 'tech-builder'
  | 'tech-architect'
  | 'creative-editorial'
  | 'creative-studio'
  | 'healthcare-practitioner'
  | 'healthcare-educator'
  | 'academic-scholar'
  | 'academic-researcher'
  | 'trades-operator'
  | 'trades-foreman';

export type SectionHeaderStyle =
  | 'banner'
  | 'banner-soft'
  | 'small-caps-rule'
  | 'small-caps-italic'
  | 'banner-underline';

export type DecorativeMarkType =
  | 'corner-arc'
  | 'name-rule'
  | 'name-rule-orange'
  | 'thin-rule'
  | 'none';

export interface TemplateConfig {
  id: TemplateId;
  label: string;
  blurb: string;
  category: TemplateCategory;
  accent: string;
  accent2?: string;
  accentSage?: string;
  nameFont: string;
  bodyFont: string;
  nameAlign: 'center' | 'left' | 'asymmetric';
  nameStyle:
    | 'uppercase-tracked'
    | 'sans-uppercase-tracked'
    | 'sans-bold'
    | 'sans-bold-uppercase'
    | 'serif-display';
  sectionStyle: SectionHeaderStyle;
  decorativeMark: DecorativeMarkType;
  italicTagline: boolean;
  italicRoles?: boolean;
  density: 'normal' | 'compact';
  tabularDates?: boolean;
  monoSkills?: boolean;
  pillSkills?: boolean;
  licensesProminent?: boolean;
  creativeTone?: boolean;
}

export interface CategoryConfig {
  id: TemplateCategory;
  label: string;
  variants: TemplateId[];
}

export interface ColorPreset {
  name: string;
  value: string;
}
