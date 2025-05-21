import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#e6f6ff",
      100: "#bae3ff",
      200: "#7cc4fa",
      300: "#47a3f3",
      400: "#2186eb",
      500: "#0967d2",
      600: "#0552b5",
      700: "#03449e",
      800: "#01337d",
      900: "#002159",
    },
    editor: {
      bg: "#f8f9fa",
      header: "#edf2f7",
      border: "#e2e8f0",
    },
    syntax: {
      keyword: "#d73a49",
      string: "#22863a",
      comment: "#6a737d",
      function: "#6f42c1",
      variable: "#24292e",
      number: "#005cc5",
      operator: "#d73a49",
      class: "#6f42c1",
    },
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "500",
        borderRadius: "md",
      },
      variants: {
        solid: {
          _hover: {
            transform: "translateY(-2px)",
            boxShadow: "md",
            transition: "all 0.2s",
          },
        },
        outline: {
          _hover: {
            transform: "translateY(-1px)",
            boxShadow: "sm",
            transition: "all 0.2s",
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "md",
        textTransform: "lowercase",
        fontWeight: "medium",
      },
      variants: {
        subtle: {
          bg: "gray.600",
          color: "white",
        },
      },
    },
    Box: {
      variants: {
        card: {
          bg: "white",
          borderRadius: "lg",
          boxShadow: "sm",
          border: "1px solid",
          borderColor: "gray.200",
        },
        editor: {
          bg: "white",
          border: "1px solid",
          borderColor: "editor.border",
          borderRadius: "lg",
          boxShadow: "sm",
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "600",
        color: "gray.800",
      },
    },
    Text: {
      baseStyle: {
        color: "gray.700",
      },
      variants: {
        code: {
          fontFamily: "mono",
          fontSize: "sm",
          bg: "gray.100",
          color: "gray.800",
          px: 1,
          borderRadius: "sm",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#ebf8ff",
        color: "gray.700",
      },
      ".monaco-editor": {
        fontFamily: "mono",
        lineHeight: "1.5",
      },
    },
  },
});

export default theme;
