// styled.d.ts
import 'styled-components/native';
import { colors, typography, spacing, borderRadius, shadows } from '@/lib/theme';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: typeof colors & {
      errorLight?: string;
    };
    typography: typeof typography & {
      fontFamily: typeof typography.fontFamily & {
        monospace?: string;
      }
    };
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
    mode?: 'light' | 'dark';
  }
}
