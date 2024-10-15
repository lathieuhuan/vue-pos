import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const Theme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}',
    },
    colorScheme: {
      light: {
        'list.option.focusBackground': '{teal.100}',
        'navigation.item.focusBackground': '{teal.100}',
        primary: {
          color: '{primary.400}',
          contrastColor: '#000',
          hoverColor: '{primary.300}',
          activeColor: '{primary.500}',
        },
      },
    },
  },
  components: {
    tag: {
      'font.size': '0.875rem',
      'font.weight': '600',
      'rounded.border.radius': '999px',
      padding: '0.125rem 0.75rem',
    },
    select: {
      padding: {
        x: '0.75rem',
        y: '0.375rem',
      },
      'option.padding': '0.375rem 0.75rem',
    },
    button: {
      'label.font.weight': '500',
    },
  },
});

export default Theme;
