import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';

export const aplPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f7f3eb',
      100: '#efe5d9',
      200: '#decbb7',
      300: '#c9aa8f',
      400: '#b58a68',
      500: '#a66a46',
      600: '#885236',
      700: '#6c412d',
      800: '#513527',
      900: '#40291e',
      950: '#352218',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#513527',
          contrastColor: '#ffffff',
          hoverColor: '#40291e',
          activeColor: '#352218',
        },
        highlight: {
          background: '#f7f3eb',
          focusBackground: '#ded5c9',
          color: '#513527',
          focusColor: '#513527',
        },
      },
    },
  },
});
