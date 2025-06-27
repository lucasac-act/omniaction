import React, { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

// Definição de cores personalizadas para o novo design
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    type: mode,
    ...(mode === 'light'
      ? {
          // Modo claro - Nova identidade visual
          primary: {
            main: '#667eea',
            light: '#9bb5ff',
            dark: '#3d4ab7',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#764ba2',
            light: '#a478d1',
            dark: '#4a2574',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          // Compatibilidade com tema antigo
          textPrimary: '#682EE3',
          borderPrimary: '#682EE3',
          dark: { main: '#333333' },
          light: { main: '#F3F3F3' },
          tabHeaderBackground: '#EEE',
          optionsBackground: '#fafafa',
          options: '#fafafa',
          fontecor: '#128c7e',
          fancyBackground: '#fafafa',
          bordabox: '#eee',
          newmessagebox: '#eee',
          inputdigita: '#fff',
          contactdrawer: '#fff',
          announcements: '#ededed',
          login: '#fff',
          announcementspopover: '#fff',
          chatlist: '#eee',
          boxlist: '#ededed',
          boxchatlist: '#ededed',
          total: '#fff',
          messageIcons: 'grey',
          inputBackground: '#FFFFFF',
          barraSuperior: '#ffffff',
          boxticket: '#EEE',
          campaigntab: '#ededed',
          mediainput: '#ededed',
          drawerBackground: '#1a202c',
          drawerText: '#FFFFFF',
          drawerTextSecondary: '#B8C5D6',
          text: {
            primary: '#1a202c',
            secondary: '#64748b',
            disabled: '#94a3b8',
          },
          // Cores customizadas para o header
          header: {
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderBottom: '#e2e8f0',
            accentLine: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            text: '#1a202c',
            textSecondary: '#64748b',
            userName: '#667eea',
            companyName: '#1a202c',
            statusBg: '#dcfce7',
            statusText: '#10b981',
          },
          // Cores para botões de ação
          actionButtons: {
            background: '#ffffff',
            border: '#e2e8f0',
            buttonBg: '#f8fafc',
            buttonBorder: '#e2e8f0',
            buttonText: '#64748b',
            buttonHoverBg: '#667eea',
            buttonHoverText: '#ffffff',
            shadow: 'rgba(0, 0, 0, 0.1)',
          },
          // Cores para o drawer/sidebar
          drawer: {
            background: '#1a202c',
            text: '#e2e8f0',
            textSecondary: '#94a3b8',
            selected: 'rgba(102, 126, 234, 0.1)',
            hover: 'rgba(255, 255, 255, 0.05)',
          },
        }
      : {
          // Modo escuro - Cores adaptadas para o novo design
          primary: {
            main: '#9bb5ff',
            light: '#cdd8ff',
            dark: '#667eea',
            contrastText: '#000000',
          },
          secondary: {
            main: '#b794d1',
            light: '#e1c4ea',
            dark: '#764ba2',
            contrastText: '#000000',
          },
          background: {
            default: '#0f172a',
            paper: '#1e293b',
          },
          // Compatibilidade com tema antigo
          textPrimary: '#FFFFFF',
          borderPrimary: '#FFFFFF',
          dark: { main: '#F3F3F3' },
          light: { main: '#333333' },
          tabHeaderBackground: '#666',
          optionsBackground: '#333',
          options: '#666',
          fontecor: '#fff',
          fancyBackground: '#333',
          bordabox: '#333',
          newmessagebox: '#333',
          inputdigita: '#666',
          contactdrawer: '#666',
          announcements: '#333',
          login: '#1C1C1C',
          announcementspopover: '#666',
          chatlist: '#666',
          boxlist: '#666',
          boxchatlist: '#333',
          total: '#222',
          messageIcons: '#F3F3F3',
          inputBackground: '#333',
          barraSuperior: '#1e293b',
          boxticket: '#666',
          campaigntab: '#666',
          mediainput: '#1c1c1c',
          drawerBackground: '#0f172a',
          drawerText: '#FFFFFF',
          drawerTextSecondary: '#E1E3E6',
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            disabled: '#64748b',
          },
          // Cores customizadas para o header no modo escuro
          header: {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderBottom: '#334155',
            accentLine: 'linear-gradient(90deg, #9bb5ff 0%, #b794d1 50%, #9bb5ff 100%)',
            text: '#f1f5f9',
            textSecondary: '#cbd5e1',
            userName: '#9bb5ff',
            companyName: '#f1f5f9',
            statusBg: '#064e3b',
            statusText: '#34d399',
          },
          // Cores para botões de ação no modo escuro
          actionButtons: {
            background: '#1e293b',
            border: '#334155',
            buttonBg: '#334155',
            buttonBorder: '#475569',
            buttonText: '#cbd5e1',
            buttonHoverBg: '#9bb5ff',
            buttonHoverText: '#000000',
            shadow: 'rgba(0, 0, 0, 0.3)',
          },
          // Cores para o drawer/sidebar no modo escuro
          drawer: {
            background: '#0f172a',
            text: '#e2e8f0',
            textSecondary: '#94a3b8',
            selected: 'rgba(155, 181, 255, 0.1)',
            hover: 'rgba(255, 255, 255, 0.05)',
          },
        }),
      },
  scrollbarStyles: {
    "&::-webkit-scrollbar": {
      width: '8px',
      height: '8px',
    },
    "&::-webkit-scrollbar-thumb": {
      boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      backgroundColor: "#262626",
    },
  },
  scrollbarStylesSoft: {
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: mode === "light" ? "#262626" : "#333333",
    },
  },
  typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
        letterSpacing: '0.025em',
      },
      body1: {
        letterSpacing: '0.025em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: mode === 'light' 
      ? [
          'none',
          '0 1px 3px rgba(0, 0, 0, 0.1)',
          '0 4px 6px rgba(0, 0, 0, 0.1)',
          '0 10px 15px rgba(0, 0, 0, 0.1)',
          '0 20px 25px rgba(0, 0, 0, 0.1)',
        ]
      : [
          'none',
          '0 1px 3px rgba(0, 0, 0, 0.3)',
          '0 4px 6px rgba(0, 0, 0, 0.3)',
          '0 10px 15px rgba(0, 0, 0, 0.3)',
          '0 20px 25px rgba(0, 0, 0, 0.3)',
        ],
});



// Contexto aprimorado para gerenciamento de tema
const ColorModeContext = createContext({
  colorMode: {
    toggleColorMode: () => {},
  },
  mode: 'light',
});

// Provider do contexto de tema
export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Carrega o modo salvo no localStorage ou usa 'light' como padrão
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    // Salva o modo atual no localStorage
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  // Adiciona propriedades customizadas ao tema
  const enhancedTheme = useMemo(() => ({
    ...theme,
    mode,
    customPalette: getDesignTokens(mode).palette,
  }), [theme, mode]);

  return (
    <ColorModeContext.Provider value={{ colorMode, mode }}>
      <ThemeProvider theme={enhancedTheme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeContext;