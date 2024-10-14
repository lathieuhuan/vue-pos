import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const Theme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}',
    },
    colorScheme: {
      light: {
        'list.option.focusBackground': '{amber.300}',
        'navigation.item.focusBackground': '{amber.300}',
      },
    },
  },
  components: {
    tag: {
      'font.size': '0.875rem',
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
  },
});

export default Theme;
