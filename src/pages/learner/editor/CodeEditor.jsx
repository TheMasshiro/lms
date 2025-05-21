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

  useEffect(() => {
    setValue(CODE_SNIPPETS[language]);
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      document.getElementById("run-code-btn").click();
    });
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
    <Box bg="#f8f9fa" p={4} borderRadius="lg">
      <HStack spacing={4} alignItems="flex-start">
        <VStack w="60%" spacing={4} align="stretch">
          <LanguageSelector language={language} onSelect={onSelect} />

          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.300"
            pb={2}
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              px={4}
              py={3}
              borderBottom="1px solid"
              borderColor="gray.300"
              bg="#edf2f7"
              borderRadius="lg lg 0 0"
            >
              <Flex alignItems="center">
                <Icon as={BiCodeCurly} mr={2} color="gray.600" boxSize={5} />
                <Heading size="md" fontWeight="semibold" color="gray.700">
                  Code Editor
                  <Badge
                    ml={2}
                    fontSize="0.7em"
                    bg={getBadgeStyles().bg}
                    color={getBadgeStyles().color}
                    textTransform="lowercase"
                    fontWeight="medium"
                    borderRadius="md"
                    px={2}
                    py={0.5}
                  >
                    {language}
                  </Badge>
                </Heading>
              </Flex>

              <Flex>
                <Tooltip label="Download Code" hasArrow placement="top">
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="teal"
                    leftIcon={<FaFileDownload />}
                    mr={2}
                    onClick={handleDownloadCode}
                  >
                    Download
                  </Button>
                </Tooltip>

                <Tooltip label="Clear Editor" hasArrow placement="top">
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="red"
                    leftIcon={<FaEraser />}
                    onClick={clearEditor}
                  >
                    Clear
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>

            <Box
              borderRadius="0 0 md md"
              overflow="hidden"
              height="75vh"
              position="relative"
            >
              <Editor
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 22,
                  fontFamily: "'Fira Code', 'Consolas', monospace",
                  scrollBeyondLastLine: false,
                  roundedSelection: true,
                  padding: { top: 16, bottom: 16 },
                  automaticLayout: true,
                  tabSize: 2,
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                    verticalHasArrows: false,
                    horizontalHasArrows: false,
                    verticalScrollbarLeft: 0,
                    verticalSliderSize: 8,
                    horizontalSliderSize: 8,
                  },
                  fixedOverflowWidgets: true,
                }}
                height="75vh"
                theme="vs-light"
                language={language.toLowerCase()}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value)}
                className="code-editor"
              />
            </Box>

            <Flex
              px={4}
              py={2}
              justifyContent="space-between"
              fontSize="sm"
              color="gray.600"
              bg="#edf2f7"
              borderTop="1px solid"
              borderColor="gray.300"
              borderRadius="0 0 lg lg"
            >
              <Text>{value.split("\n").length} lines</Text>
              <Flex alignItems="center">
                <Text mr={2}>{language}</Text>
                <Badge
                  fontSize="xs"
                  bg="gray.600"
                  color="white"
                  borderRadius="md"
                  px={1.5}
                >
                  Editor
                </Badge>
              </Flex>
            </Flex>
          </Box>
        </VStack>

        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
