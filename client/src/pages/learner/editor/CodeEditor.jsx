import { useRef, useState, useEffect } from "react";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Flex,
  Icon,
  Text,
  Badge,
  Tooltip,
  Button,
  useDisclosure,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "./configs/constants";
import Output from "./Output";
import { FaFileDownload, FaEraser } from "react-icons/fa";
import { BiCodeCurly } from "react-icons/bi";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fileName, setFileName] = useState("untitled");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isTablet] = useMediaQuery("(max-width: 1024px)");

  const editorHeight = useBreakpointValue({
    base: "40vh",
    sm: "45vh",
    md: "50vh",
    lg: "60vh",
    xl: "65vh",
  });

  const buttonSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const spacing = useBreakpointValue({ base: 3, sm: 4, md: 5, lg: 6 });
  const fontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  useEffect(() => {
    setValue(CODE_SNIPPETS[language]);
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    if (typeof monaco !== 'undefined') {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        document.getElementById("run-code-btn")?.click();
      });
    }
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");

    let fileExtension = ".txt";
    switch (language.toLowerCase()) {
      case "javascript":
        fileExtension = ".js";
        break;
      case "typescript":
        fileExtension = ".ts";
        break;
      case "python":
        fileExtension = ".py";
        break;
      case "java":
        fileExtension = ".java";
        break;
      case "csharp":
        fileExtension = ".cs";
        break;
      case "php":
        fileExtension = ".php";
        break;
    }

    const file = new Blob([value], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearEditor = () => {
    setValue("");
    editorRef.current?.focus();
  };

  const getLanguageColor = () => {
    switch (language.toLowerCase()) {
      case "python":
        return "blue";
      case "javascript":
        return "yellow";
      case "typescript":
        return "blue";
      case "java":
        return "orange";
      case "csharp":
        return "purple";
      case "php":
        return "indigo";
      default:
        return "green";
    }
  };

  const getBadgeStyles = () => {
    const color = getLanguageColor();
    switch (color) {
      case "blue":
        return { bg: "blue.600", color: "white" };
      case "yellow":
        return { bg: "yellow.600", color: "white" };
      case "green":
        return { bg: "green.600", color: "white" };
      case "orange":
        return { bg: "orange.600", color: "white" };
      case "purple":
        return { bg: "purple.600", color: "white" };
      case "indigo":
        return { bg: "gray.300", color: "black" };
      default:
        return { bg: "gray.600", color: "white" };
    }
  };

  return (
    <Box
      bg="#f8f9fa"
      p={{ base: 3, sm: 4, md: 6 }}
      borderRadius="lg"
      minH="100vh"
      w="100%"
    >
      <VStack spacing={spacing} w="100%" maxW="100%">
        <Box w="100%" mb={{ base: 2, sm: 3 }}>
          <LanguageSelector language={language} onSelect={onSelect} />
        </Box>

        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={spacing}
          w="100%"
          maxW="100%"
          align="stretch"
          minH="70vh"
        >
          <Box
            w={{ base: "100%", lg: "50%" }}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.300"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              px={{ base: 3, sm: 4 }}
              py={{ base: 2, sm: 3 }}
              borderBottom="1px solid"
              borderColor="gray.300"
              bg="#edf2f7"
              flexShrink={0}
            >
              <Flex
                alignItems="center"
                minW="0"
                flex="1"
              >
                <Icon
                  as={BiCodeCurly}
                  mr={{ base: 1, sm: 2 }}
                  color="gray.600"
                  boxSize={{ base: 4, sm: 5 }}
                />
                <Heading
                  size={headingSize}
                  fontWeight="semibold"
                  color="gray.700"
                  isTruncated
                >
                  Code Editor
                  <Badge
                    ml={{ base: 1, sm: 2 }}
                    fontSize={{ base: "0.6em", sm: "0.7em" }}
                    bg={getBadgeStyles().bg}
                    color={getBadgeStyles().color}
                    textTransform="lowercase"
                    fontWeight="medium"
                    borderRadius="md"
                    px={{ base: 1, sm: 2 }}
                    py={0.5}
                    display={{ base: "none", sm: "inline-block" }}
                  >
                    {language}
                  </Badge>
                </Heading>
              </Flex>

              <Flex gap={{ base: 1, sm: 2 }} flexShrink={0}>
                <Tooltip
                  label="Download Code"
                  hasArrow
                  placement="top"
                  isDisabled={isMobile}
                >
                  <Button
                    size={buttonSize}
                    variant="solid"
                    colorScheme="teal"
                    leftIcon={<FaFileDownload />}
                    onClick={handleDownloadCode}
                    fontSize={fontSize}
                    px={{ base: 2, sm: 3 }}
                  >
                    {isMobile ? "" : "Download"}
                  </Button>
                </Tooltip>

                <Tooltip
                  label="Clear Editor"
                  hasArrow
                  placement="top"
                  isDisabled={isMobile}
                >
                  <Button
                    size={buttonSize}
                    variant="solid"
                    colorScheme="red"
                    leftIcon={<FaEraser />}
                    onClick={clearEditor}
                    fontSize={fontSize}
                    px={{ base: 2, sm: 3 }}
                  >
                    {isMobile ? "" : "Clear"}
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>

            <Box
              height={editorHeight}
              position="relative"
              w="100%"
              overflow="hidden"
              flex="1"
            >
              <Editor
                options={{
                  minimap: { enabled: !isMobile && !isTablet },
                  fontSize: isMobile ? 12 : isTablet ? 13 : 14,
                  lineHeight: isMobile ? 18 : isTablet ? 20 : 22,
                  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                  scrollBeyondLastLine: false,
                  roundedSelection: true,
                  padding: {
                    top: isMobile ? 8 : 16,
                    bottom: isMobile ? 8 : 16,
                  },
                  automaticLayout: true,
                  tabSize: 2,
                  scrollbar: {
                    verticalScrollbarSize: isMobile ? 12 : 8,
                    horizontalScrollbarSize: isMobile ? 12 : 8,
                    verticalHasArrows: false,
                    horizontalHasArrows: false,
                  },
                  wordWrap: isMobile ? "on" : "off",
                  glyphMargin: !isMobile,
                  folding: !isMobile,
                  lineNumbers: isMobile ? "off" : "on",
                  lineDecorationsWidth: isMobile ? 0 : 10,
                  lineNumbersMinChars: isMobile ? 0 : 3,
                  renderLineHighlight: isMobile ? "none" : "line",
                  overviewRulerBorder: !isMobile,
                  hideCursorInOverviewRuler: isMobile,
                  matchBrackets: "always",
                  selectOnLineNumbers: !isMobile,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: true,
                  contextmenu: !isMobile,
                  links: !isMobile,
                  colorDecorators: !isMobile,
                  codeLens: false,
                  quickSuggestions: !isMobile,
                  suggestOnTriggerCharacters: !isMobile,
                  acceptSuggestionOnEnter: isMobile ? "off" : "on",
                  hover: { enabled: !isMobile },
                  parameterHints: { enabled: !isMobile },
                }}
                height="100%"
                width="100%"
                theme="vs-light"
                language={language.toLowerCase()}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value)}
                loading={
                  <Flex
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.500"
                  >
                    <Text fontSize={fontSize}>Loading editor...</Text>
                  </Flex>
                }
              />
            </Box>

            <Flex
              px={{ base: 3, sm: 4 }}
              py={{ base: 1, sm: 2 }}
              justifyContent="space-between"
              fontSize={{ base: "xs", sm: "sm" }}
              color="gray.600"
              bg="#edf2f7"
              borderTop="1px solid"
              borderColor="gray.300"
              flexShrink={0}
            >
              <Text isTruncated>
                {value.split("\n").length} lines
              </Text>
              <Flex alignItems="center" gap={{ base: 1, sm: 2 }}>
                <Text
                  display={{ base: "none", sm: "block" }}
                  fontSize={{ base: "xs", sm: "sm" }}
                  isTruncated
                >
                  {language}
                </Text>
                <Badge
                  fontSize={{ base: "xs", sm: "sm" }}
                  bg="gray.600"
                  color="white"
                  borderRadius="md"
                  px={{ base: 1, sm: 1.5 }}
                  py={0.5}
                >
                  Editor
                </Badge>
              </Flex>
            </Flex>
          </Box>

          <Box w={{ base: "100%", lg: "50%" }}>
            <Output editorRef={editorRef} language={language} />
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CodeEditor;
