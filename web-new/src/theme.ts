import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid white',
          color: 'white',
          '&:hover': {
            border: '2px solid white',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      },
    },
  },
})
